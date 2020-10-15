import { commandSync } from "execa";
import { readdirSync } from "fs";
import _ from "lodash";

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

export const listFilesInDocumentsPath = () => {
  return readdirSync(process.env.DOCUMENTS_PATH);
};