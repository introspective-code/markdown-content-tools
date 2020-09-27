import { readFileSync } from "fs";
import { loadFront } from "yaml-front-matter";
import markdownIt from "markdown-it";
import markdownItHighlightJs from "markdown-it-highlightjs";
import _ from "lodash";

const DOCUMENT_PATH = process.env.DOCUMENT_PATH;

const converter = new markdownIt().use(markdownItHighlightJs);

export const getDocument = () => {
  try {
    const text = readFileSync(DOCUMENT_PATH, "utf-8");
    const { description, title, date, tags, __content: markdown } = loadFront(
      text
    );
    const markup = converter.render(markdown);

    return {
      description,
      title,
      date,
      tags,
      markup,
    };
  } catch (err) {
    console.log(err.message);
  }
  return {};
};

export const getSplitDocument = () => {
  const output = {};

  const text = readFileSync(DOCUMENT_PATH, "utf-8");
  const { description, title, date, tags } = loadFront(text);

  let markdown = text.split("---\n")[2];

  output.title = title;
  output.description = description;
  output.date = date;
  output.tags = tags;

  const codeblocks = {};

  const codeblockPattern = /<%%% (.*)%%%>/gms;

  let codeblockCounter = 0;
  const codeblockMatches = markdown.matchAll(codeblockPattern);

  for (const match of codeblockMatches) {
    const [header, block] = match[1].split(/\n(.*)/s);
    const extension = getExtension(/```(.*)/gm.exec(block)[1]);
    const filename = `${_.kebabCase(title)}-${_.kebabCase(
      header
    )}.${extension}`;

    const key = codeblockCounter++;

    codeblocks[key] = {
      header,
      block,
      filename,
    };

    markdown = markdown.replace(
      match[0],
      `+++\n<%%% codeblock %%%>:${key}\n+++\n`
    );
  }

  const components = [];

  _.each(markdown.split("+++\n"), (section) => {
    if (_.includes(section, "<%%% codeblock %%%>")) {
      const { header, block, filename } = codeblocks[
        _.trim(section.split(":")[1], "\n")
      ];
      components.push({
        type: "codeblock",
        meta: {
          header,
          filename,
        },
        content: {
          markup: converter.render(block),
          markdown: block,
        },
      });
    } else {
      components.push({
        type: "slide",
        meta: {},
        content: {
          markup: converter.render(section),
          markdown: section,
        },
      });
    }
  });

  output.components = components;

  return output;
};

const getExtension = (language) => {
  const extensionMap = {
    javascript: "js",
  };
  return extensionMap[language];
};
