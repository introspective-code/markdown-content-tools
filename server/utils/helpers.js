import { commandSync } from "execa";
import { readdirSync, writeFileSync, unlinkSync } from "fs";
import _ from "lodash";
import cloudinary from 'cloudinary';

const PORT = process.env.PORT || 8000;

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
      `cp ${process.env.TEMPLATES_PATH}/${template}.mct-template ${process.env.DOCUMENTS_PATH}/${file}.md`
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
  const uploadPath = `tmp/media/${imageFileName}.png`;

  const imageData = data.replace(/^data:image\/png;base64,/, "");
  console.log(`[ server/utils/helpers ] uploading image ${imageFileName}`);
  writeFileSync(uploadPath, imageData, 'base64');

  try {
    const { secure_url: secureUrl } = await uploadImage({ path: uploadPath });
    unlinkSync(uploadPath);
    return `![](${secureUrl})`;
  } catch (err) {
    console.log(err);
    return "![]()";
  }
}

export const uploadImage = ({ path }) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(path, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

export const listFilesInDocumentsPath = () => {
  return readdirSync(process.env.DOCUMENTS_PATH);
};
