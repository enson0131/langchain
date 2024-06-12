// List Output Parser 集合输出解析器

import { CommaSeparatedListOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import ollama from './utils/ollama-llm.mjs';
import baidu from './utils/baidu-llm.mjs';

const model = baidu;

const parser = new CommaSeparatedListOutputParser();
// console.log(parser.getFormatInstructions())

const prompt = PromptTemplate.fromTemplate("列出3个 {country} 的著名的互联网公司.\n{instructions}")

const chain = prompt.pipe(model).pipe(parser);

const res = await chain.invoke({
    country: "中国",
    instructions: parser.getFormatInstructions()
});

console.log(res);



