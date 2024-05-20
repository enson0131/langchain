// Loader: langchain 提供了一系列的 Loader 加载不同的数据源
import * as pdfParse from "pdf-parse";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const textLoader = new TextLoader("data/qiu.txt");

const text = await textLoader.load();

console.log(text);

const pdfLoader = new PDFLoader("data/github-copliot.pdf");

const pdfText = await pdfLoader.load();

console.log(pdfText); // 返回的是每一个的 pdf document 对象

const pdfloader2 = new PDFLoader("data/github-copliot.pdf", { splitPages: false }); // 只返回一个 document 对象

const pdfText2 = await pdfloader2.load();

console.log(pdfText2);