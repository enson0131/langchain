// StructuredOutputParser 的学习

import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import ollama from './utils/ollama-llm.mjs';
import baidu from './utils/baidu-llm.mjs';

const model = baidu;

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "用户问题的答案",
  evidence: "你回答用户问题所依据的答案",
  confidence: "问题答案的可信度评分，格式是百分数",
});

// console.log(parser.getFormatInstructions());

const prompt = PromptTemplate.fromTemplate("尽可能的用中文回答用户问题 \n{instructions} \n{question}")

const chain = prompt.pipe(model).pipe(parser)
const res = await chain.invoke({
    question: "蒙娜丽莎的作者是谁？是什么时候绘制的？",
    instructions: parser.getFormatInstructions()
})
                               
console.log(res)