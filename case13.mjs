// https://js.langchain.com/v0.2/docs/integrations/vectorstores/faiss/#create-a-new-index-from-texts
import "dotenv/config";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { BaiduQianfanEmbeddings } from "@langchain/community/embeddings/baidu_qianfan"; // 开通千帆 Embedding 模型, https://cloud.baidu.com/doc/VDB/s/Nltgvlg7k
import { AlibabaTongyiEmbeddings } from "@langchain/community/embeddings/alibaba_tongyi";
const loader = new TextLoader('./data/kong.txt');

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100, // 分块的大小
    chunkOverlap: 20, // 块之间的重叠
});

const splitDocs = await splitter.splitDocuments(docs);

const embedding = new BaiduQianfanEmbeddings(); // Embedding-V1是基于百度文心大模型技术的文本表示模型，将文本转化为用数值表示的向量形式，用于文本检索、信息推荐、知识挖掘等场景。

const vectorStore = await FaissStore.fromDocuments(splitDocs, embedding);

const retriever = vectorStore.asRetriever(2);
const res = await retriever.invoke("茴香豆是做什么用的");

console.log(res);