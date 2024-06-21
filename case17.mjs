import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
// import { BaiduQianfanEmbeddings } from "@langchain/community/embeddings/baidu_qianfan";
import { AlibabaTongyiEmbeddings } from "@langchain/community/embeddings/alibaba_tongyi";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import qwenTurbo from './utils/alibaba-llm.mjs';
import "dotenv/config";

const model = qwenTurbo;
  
const loader = new TextLoader("./data/qiu.txt"); // 《球状闪电》
const docs = await loader.load();

// console.log(docs);

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
});


const splitDocs = await splitter.splitDocuments(docs); // 对文章进行切片

const embedding = new AlibabaTongyiEmbeddings(); // AlibabaTongyiEmbeddings

const vectorStore = await FaissStore.fromDocuments(splitDocs, embedding); // 从文档中创建一个向量存储

const retriever = vectorStore.asRetriever(2);

// const res = await retriever.invoke("原文中，谁提出了宏原子的假设？并详细介绍给我宏原子假设的理论")

// console.log(`res`, res);


const convertDocsToString = (documents) => {
    return documents.map((document) =>  document.pageContent).join("\n")
}

const contextRetriverChain = RunnableSequence.from([
    (input) => input.question,
    retriever,
    convertDocsToString
])


// const result = await contextRetriverChain.invoke({ question: "原文中，谁提出了宏原子的假设？并详细介绍给我宏原子假设的理论"})

// console.log(result)

const TEMPLATE = `
你是一个熟读刘慈欣的《球状闪电》的终极原著党，精通根据作品原文详细解释和回答问题，你在回答时会引用作品原文。
并且回答时仅根据原文，尽可能回答用户问题，如果原文中没有相关内容，你可以回答“原文中没有相关内容”，

以下是原文中跟用户回答相关的内容：
{context}

现在，你需要基于原文，回答以下问题：
{question}`;

const prompt = ChatPromptTemplate.fromTemplate(
    TEMPLATE
);


const ragChain = RunnableSequence.from([
    {
        context: contextRetriverChain,
        question: (input) => input.question,
    },
    prompt,
    model,
    new StringOutputParser()
])

const answer = await ragChain.invoke({
    question: "什么是球状闪电"
});  

console.log(answer);

