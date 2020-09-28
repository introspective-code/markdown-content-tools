import { readFileSync } from "fs";
import { loadFront } from "yaml-front-matter";
import markdownIt from "markdown-it";
import markdownItHighlightJs from "markdown-it-highlightjs";
import _ from "lodash";

const converter = new markdownIt().use(markdownItHighlightJs);

export const getDocument = (path) => {
  try {
    const text = readFileSync(path, "utf-8");
    const { description, title, date, tags, __content: markdown } = loadFront(
      text
    );

    let processedMarkdown = markdown;

    processedMarkdown = _(processedMarkdown)
      .chain()
      .split("\n")
      .filter((line) => !_.includes(line, "%%%"))
      .join("\n")
      .value();

    const markup = converter.render(processedMarkdown);

    return {
      path,
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

export const getDocumentComponents = (path) => {
  const output = {};

  const text = readFileSync(path, "utf-8");
  const { description, title, date, tags } = loadFront(text);

  let markdown = text.split("---\n")[2];

  output.title = title;
  output.description = description;
  output.date = date;
  output.tags = tags;
  output.path = path;

  const codeblocks = {};

  const codeblockPattern = /<%%% (.*?)%%%>/gms;

  let codeblockCounter = 0;
  const codeblockMatches = markdown.matchAll(codeblockPattern);

  for (const match of codeblockMatches) {
    const key = codeblockCounter++;
    const [header, block] = match[1].split(/\n(.*)/s);
    const extension = getExtension(/```(.*)/gm.exec(block)[1]);
    const filename = `${_.kebabCase(title)}-${key}-${_.kebabCase(
      header
    )}.${extension}`;

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
    } else if (section !== "") {
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
    json: "json",
  };
  return extensionMap[language];
};
