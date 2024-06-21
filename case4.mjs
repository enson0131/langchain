// case4: chat prompt 的使用

import { SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Ollama } from '@langchain/community/llms/ollama';
import 'dotenv/config';
import baidu from './utils/baidu-llm.mjs';
import alibaba from './utils/alibaba-llm.mjs';


// 构建 system 角色，通常用于设置对话的上下文或指定模型采取特定的行为模式
const translateInstructionTemplate = SystemMessagePromptTemplate.fromTemplate(`你是一个专
业的翻译员，你的任务是将文本从{source_lang}翻译成{target_lang}。`);

// 构建 use 角色，代表真实用户在对话中的发言
const userQuestionTemplate = HumanMessagePromptTemplate.fromTemplate("请翻译这句话：{text}");

const chatPrompt = ChatPromptTemplate.fromMessages([
  translateInstructionTemplate,
  userQuestionTemplate,
]);


const formattedChatPrompt = await chatPrompt.formatMessages({
    source_lang: "中文",
    target_lang: "法语",
    text: "你好，世界",
});
  
console.log(formattedChatPrompt)


// 语法糖
const systemTemplate = "你是一个专业的翻译员，你的任务是将文本从{source_lang}翻译成{target_lang}。";
const humanTemplate = "请翻译这句话：{text}";

const chatPrompt2 = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["human", humanTemplate],
]);


const outputParser = new StringOutputParser(); // 输出字符串
const chatModel = new Ollama({
    baseUrl: "http://localhost:11434", 
    model: "llama3", 
});

const chain = chatPrompt2.pipe(baidu).pipe(outputParser);

const res = await chain.invoke({
    source_lang: "中文",
    target_lang: "英语",
    text: "你好，世界",
})

console.log(res);