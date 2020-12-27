import { commandSync } from "execa";
import { readdirSync, writeFileSync, unlinkSync } from "fs";
import _ from "lodash";
import cloudinary from 'cloudinary';
import { Octokit } from "@octokit/core"
import axios from "axios";
import regeneratorRuntime from "regenerator-runtime";
import { TEMP_PATH } from "./constants";
import mime from "mime-types";

const PORT = process.env.PORT || 8000;
const EXPORT_PATH = process.env.EXPORT_PATH || 'exports';
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const TEMPLATES_PATH = './templates';

export const executeShellCommand = (command) => {
  console.log(`> ${command}`);
  try {
    const { stdout } = commandSync(command, { shell: true });
    console.log(stdout);
  } catch (error) {
    console.log(error);
  }
};

export const openWithEditor = (file) => {
  if (process.env.EDITOR) {
    executeShellCommand(`$EDITOR ${process.env.DOCUMENTS_PATH}/${file}`);
  } else {
    console.log(`[ server/utils/helpers ] No $EDITOR detected...`);
  }
};

export const createAndOpenWithEditor = ({ file, template }) => {
  if (process.env.EDITOR) {
    executeShellCommand(
      `cp ${TEMPLATES_PATH}/${template}.mct-template ${process.env.DOCUMENTS_PATH}/${file}.md`
    );
    executeShellCommand(`$EDITOR ${process.env.DOCUMENTS_PATH}/${file}.md`);
  } else {
    console.log(`[ server/utils/helpers ] No $EDITOR detected...`);
  }
};

export const saveImageAndGetPath = async ({ data, title }) => {
  const now = new Date().getTime();
  const fileTitle = _.kebabCase(title);

  const imageFileName = `${fileTitle}-${now}`;
  const uploadPath = `tmp/${imageFileName}.png`;

  const imageData = data.replace(/^data:image\/png;base64,/, "");
  console.log(`[ server/utils/helpers ] uploading image ${imageFileName}`);
  writeFileSync(uploadPath, imageData, 'base64');

  try {
    const { secure_url: secureUrl } = await uploadMedia({ path: uploadPath });
    unlinkSync(uploadPath);
    return `![](${secureUrl})`;
  } catch (err) {
    console.log(err);
    return "![]()";
  }
}

export const uploadMedia = ({ path }) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(path, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

export const uploadMediaAndUnlink = ({ path }) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        unlinkSync(path);
        resolve({ secureUrl: result.secure_url });
      }
    });
  });
}

export const listFilesInDocumentsPath = () => {
  return readdirSync(process.env.DOCUMENTS_PATH);
};

export const getGists = async () => {
  try {
    const gists = await octokit.request('GET /gists');
    return gists;
  } catch (err) {
    console.log(err);
  }
}

export const createGistAndGetScriptTag = async ({ name, content, description }) => {
  try {
    const { data } = await octokit.request("POST /gists", {
      description,
      files: {
        [name]: {
          content
        },
      },
      public: true,
    });
    const { id } = data;
    return `<script src="https://gist.github.com/${process.env.GITHUB_USERNAME}/${id}.js"></script>`;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const createAndGetMediumDraft = async ({ mctDocument }) => {
  const { meta, components } = mctDocument;

  try {
    const title = meta.title;
    const content = await getMediumDraftContent({ components });
    const tags = meta.tags;

    const { data: results } = await axios.post(
      `https://api.medium.com/v1/users/${process.env.MEDIUM_USER_ID}/posts`,
      {
        title,
        contentFormat: "markdown",
        content,
        tags,
        publishStatus: "draft",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MEDIUM_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Charset": "utf-8",
        },
      }
    );
    const { url } = results.data;

    return {
      url,
      content,
      tags,
      title
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const saveAndGetExportedBlog = ({ mctDocument }) => {
  const { meta, components } = mctDocument;

  const exportPath = `${EXPORT_PATH}/${meta.date.split("T")[0]}-${_.kebabCase(meta.title)}.md`;
  const fileContent = getBlogSafeFileContent({ components, meta });

  writeFileSync(exportPath, fileContent);

  executeShellCommand(`$EDITOR ${exportPath}`);

  return { exportPath, fileContent };
}

export const getBlogSafeFileContent = ({ components, meta }) => {
  let output = "";

  output = getFrontMatter({ meta });

  _.each(components, ({ type, content, meta: componentMeta }) => {
    output += content.markdown;
  });

  return output;
}

export const getMediumDraftContent = async ({ components }) => {
  let output = "";

  try {
    for (const component of components) {
      const { type, content, meta } = component;

      if (type === 'codeblock') {
        const scriptTag = await createGistAndGetScriptTag({
          name: meta.filename,
          content: content.code,
          title: meta.header
        });
        output += `\n${scriptTag}\n`;
      } else {
        output += content.markdown;
      }
    }
  } catch (err) {
    console.log(err);
  }

  return output;
}

export const getFrontMatter = ({ meta }) => {
  let output = '---\n';

  output += `layout: post\n`;
  output += `title: "${meta.title}"\n`;
  output += `description: "${meta.description}"\n`;
  output += `date: ${meta.date.split("T")[0]}\n`;
  output += `tags: [${meta.tags.join(',')}]\n`;
  output += `comments: true\n`;
  output += `share: true\n`;

  output += '---\n';

  return output;
}

export const moveUploadedFile = ({ file }) => {
  const path = getUploadedFilePath({ file });
  return new Promise((resolve, reject) => {
    file.mv(path, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve({ path });
      }
    });
  });
}

export const getUploadedFilePath = ({ file }) => {
  const extension = mime.extension(file.mimetype);
  const filename = file.name.replace(/\.[^/.]+$/, "");
  const timestamp = (new Date()).getTime();
  return `${timestamp}-${_.kebabCase(filename)}.${extension}`;
}