// https://js.langchain.com/v0.2/docs/integrations/vectorstores/faiss/#create-a-new-index-from-texts
import "dotenv/config";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { BaiduQianfanEmbeddings } from "@langchain/community/embeddings/baidu_qianfan"; // 开通千帆 Embedding 模型, https://cloud.baidu.com/doc/VDB/s/Nltgvlg7k

const loader = new TextLoader('./data/kong.txt');

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100, // 分块的大小
    chunkOverlap: 20, // 块之间的重叠
});

console.log(process.env);
const splitDocs = await splitter.splitDocuments(docs);

const embedding = new BaiduQianfanEmbeddings();

const vectorStore = await FaissStore.fromDocuments(splitDocs, embedding);


const retriever = vectorStore.asRetriever(2);
const res = await retriever.invoke("茴香豆是做什么用的");

console.log(res);