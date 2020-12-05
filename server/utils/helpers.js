import { commandSync } from "execa";
import { readdirSync, writeFileSync } from "fs";
import _ from "lodash";

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

export const saveImageAndGetPath = ({ data, title }) => {
  const now = new Date().getTime();
  const fileTitle = _.kebabCase(title);
  const imageFileName = `${fileTitle}-${now}`;
  const uploadPath = `tmp/media/${imageFileName}.png`;
  const mdImagePath = `![](http://localhost:${PORT}/media/${imageFileName}.png)`;
  const imageData = data.replace(/^data:image\/png;base64,/, "");
  console.log(`[ server/utils/helpers ] saving image as ${imageFileName}`);
  writeFileSync(uploadPath, imageData, 'base64');
  return mdImagePath;
}

export const listFilesInDocumentsPath = () => {
  return readdirSync(process.env.DOCUMENTS_PATH);
};
