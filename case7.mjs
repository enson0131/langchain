// Auto Fix Parser

import { z } from "zod"; // zod 是一个可以验证 js/ts 是否符合类型的库
import { StructuredOutputParser, OutputFixingParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import ollama from "./utils/ollama-llm.mjs";

const schema = z.object({
    answer:  z.string().describe("用户问题的答案"),
    confidence: z.number().min(0).max(100).describe("问题答案的可信度评分，满分 100")
});

const parser = StructuredOutputParser.fromZodSchema(schema);
const prompt = PromptTemplate.fromTemplate("尽可能的回答用户问题 \n{instructions} \n{question}");

const model = ollama;
const chain = prompt.pipe(model).pipe(parser);

const res = await chain.invoke({
    question: "蒙娜丽莎的作者是谁？是什么时候绘制的",
    instructions: parser.getFormatInstructions()
});

console.log(res);

const wrongOutput = {
    "answer": "蒙娜丽莎的作者是达芬奇，大约在16世纪初期（1503年至1506年之间）开始绘制。",
    "sources": "90%" 
};
  

// 自动校正
const fixParser = OutputFixingParser.fromLLM(model, parser);
const output = await fixParser.parse(JSON.stringify(wrongOutput));

console.log(output);


const wrongOutput2 = {
    "answer": "蒙娜丽莎的作者是达芬奇，大约在16世纪初期（1503年至1506年之间）开始绘制。",
    "sources": "-1" 
};
  

const output2 = await fixParser.parse(JSON.stringify(wrongOutput2));

console.log(output2);