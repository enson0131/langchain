// ScoreThresholdRetriever: 
import "dotenv/config";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { BaiduQianfanEmbeddings } from "@langchain/community/embeddings/baidu_qianfan";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import ernieTurbo from './utils/baidu-llm.mjs';
import { AlibabaTongyiEmbeddings } from "@langchain/community/embeddings/alibaba_tongyi";
process.env.LANGCHAIN_VERBOSE = "true"; // 显示调试信息

const loader = new TextLoader('./data/kong.txt');

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500, // 分块的大小
    chunkOverlap: 100, // 块之间的重叠
});

const splitDocs = await splitter.splitDocuments(docs); // 对文章进行切片

const embedding = new BaiduQianfanEmbeddings(); // Embedding-V1是基于百度文心大模型技术的文本表示模型，将文本转化为用数值表示的向量形式，用于文本检索、信息推荐、知识挖掘等场景。

const vectorStore = await FaissStore.fromDocuments(splitDocs, embedding); // 从文档中创建一个向量存储

const retriever = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
    minSimilarityScore: 0.9, // 最小的相似度阈值，一般是 0.8
    maxK: 5, // 最大 K 值，返回多少个文档
    kIncrement: 1, // 每次获取多少个文档
});

// const compressor = LLMChainExtractor.fromLLM(ernieTurbo); // 从 LLM 模型中提取 LLMChainExtractor

// const retriever2 = new ContextualCompressionRetriever({ // 通过 LLM 去生存不同的检索
//     baseCompressor: compressor, // baseCompressor 根据用户的问题和 Document 对象的内容，进行核心信息的提取
//     baseRetriever: retriever,
// });

const res = await retriever.invoke("茴香豆是做什么用的"); // 从检索中根据相关性提取信息

console.log(`res`, res);

