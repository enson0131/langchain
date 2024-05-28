// MultiQueryRetriever: 
import "dotenv/config";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { BaiduQianfanEmbeddings } from "@langchain/community/embeddings/baidu_qianfan";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import ollama from './utils/ollama-llm.mjs';
import ernieTurbo from './utils/baidu-llm.mjs';

const loader = new TextLoader('./data/kong.txt');

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100, // 分块的大小
    chunkOverlap: 20, // 块之间的重叠
});

const splitDocs = await splitter.splitDocuments(docs); // 对文章进行切片

const embedding = new BaiduQianfanEmbeddings(); // Embedding-V1是基于百度文心大模型技术的文本表示模型，将文本转化为用数值表示的向量形式，用于文本检索、信息推荐、知识挖掘等场景。

const vectorStore = await FaissStore.fromDocuments(splitDocs, embedding); // 从文档中创建一个向量存储

const retriever = MultiQueryRetriever.fromLLM({ // 通过 LLM 去生存不同的检索
    llm: ernieTurbo, // 传入的 LLM 模型
    retriever: vectorStore.asRetriever(3), // 向量数据库的 retriever
    queryCount: 3, // 生成 3 条不同的描述
    verbose: true, // 设置为 true 会打印出 chain 内部的详细执行过程方便 debug
});

const res = await retriever.invoke("茴香豆是做什么用的"); // 一共会生成 9 条数据，再做去重

console.log(`res`, res);

