const { v4 } = require("uuid");
const fs = require("fs");
const { tokenizeString } = require("../../utils/tokenizer");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { default: slugify } = require("slugify");

async function asTxt({ fullFilePath = "", filename = "" }) {
  let content = "";
  try {
    content = fs.readFileSync(fullFilePath, "utf8");
  } catch (err) {
    console.error("Could not read file!", err);
  }

  if (!content?.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }

  let docAuthor = "Unknown";
  let description = "Unknown";
  const fm = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    try {
      const lines = fm[1].split(/\n/);
      for (const line of lines) {
        const [key, ...rest] = line.split(":");
        if (!key || rest.length === 0) continue;
        const value = rest.join(":").trim();
        if (key.trim() === "author" && value) docAuthor = value;
        if (["description", "summary"].includes(key.trim()) && value)
          description = value;
      }
      content = content.slice(fm[0].length);
    } catch (e) {
      console.warn("Failed to parse front matter", e.message);
    }
  }

  console.log(`-- Working ${filename} --`);
  const data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: filename,
    docAuthor,
    description,
    docSource: "a text file uploaded by the user.",
    chunkSource: "",
    published: createdDate(fullFilePath),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content),
  };

  const document = writeToServerDocuments(
    data,
    `${slugify(filename)}-${data.id}`
  );
  trashFile(fullFilePath);
  console.log(`[SUCCESS]: ${filename} converted & ready for embedding.\n`);
  return { success: true, reason: null, documents: [document] };
}

module.exports = asTxt;
