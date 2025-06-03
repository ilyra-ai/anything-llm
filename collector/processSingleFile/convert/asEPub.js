const { v4 } = require("uuid");
const { EPubLoader } = require("langchain/document_loaders/fs/epub");
const { tokenizeString } = require("../../utils/tokenizer");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { default: slugify } = require("slugify");
const { EPub } = require("epub2");

async function asEPub({ fullFilePath = "", filename = "" }) {
  let content = "";
  let metadata = {};
  try {
    const loader = new EPubLoader(fullFilePath, { splitChapters: false });
    const docs = await loader.load();
    docs.forEach((doc) => (content += doc.pageContent));
    const epub = await EPub.createAsync(fullFilePath);
    metadata = epub.metadata || {};
  } catch (err) {
    console.error("Could not read epub file!", err);
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

  const docAuthor = metadata.creator || "Unknown";
  const description = metadata.description || "Unknown";

  console.log(`-- Working ${filename} --`);
  const data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: filename,
    docAuthor,
    description,
    docSource: "a epub file uploaded by the user.",
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

module.exports = asEPub;
