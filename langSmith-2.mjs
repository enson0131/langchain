import qwenTurbo from './utils/alibaba-llm.mjs';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// 语法糖
const systemTemplate = "你是一个专业的翻译员，你的任务是将文本从{source_lang}翻译成{target_lang}。";
const humanTemplate = "请翻译这句话：{text}";

const chatPrompt2 = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["human", humanTemplate],
]);


const outputParser = new StringOutputParser(); // 输出字符串

const chain = chatPrompt2.pipe(qwenTurbo).pipe(outputParser);

const res = await chain.invoke({
    source_lang: "中文",
    target_lang: "英语",
    text: "你好，世界",
})

console.log(res);