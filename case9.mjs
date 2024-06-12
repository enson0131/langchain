// DirectoryLoader 加载文件夹内的文件内容

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new DirectoryLoader(
    "./data",
    {
      // 通过文件后缀名来指定加载器
      ".pdf": (path) => new PDFLoader(path, { splitPages: false }),
      ".txt": (path) => new TextLoader(path),
    }
);
const docs = await loader.load();

console.log(docs); 