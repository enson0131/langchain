// global.ReadableStream = require('web-streams-polyfill').ReadableStream; // issues: https://github.com/langchain-ai/langchainjs/issues/2815
// import "web-streams-polyfill/es6"; // https://js.langchain.com/v0.1/docs/get_started/installation/#unsupported-nodejs-16
import { Ollama } from '@langchain/community/llms/ollama';
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import 'dotenv/config'

const ollama = new Ollama({
  baseUrl: "http://localhost:11434", 
  model: "llama3", 
});

const outputParse = new StringOutputParser();


// ollama.invoke([
//   new HumanMessage("用中文讲一个笑话"),
// ]).then((res) => {
//   console.log('res', res);
// });

const simpleChain = ollama.pipe(outputParse);

// invoke 的调用方式 基础调用
// const res = await simpleChain.invoke([
//   new HumanMessage("用中文讲一个笑话"),
// ]);
// console.log(`res---->`, res);

// batch 的调用方式 批量调用
// const res = await simpleChain.batch([
//   [new HumanMessage("用中文讲一个笑话")],
//   [new HumanMessage("用中文描述你是谁")],
// ])
// console.log(`res---->`, res);

// stream 的调用方式 流式调用
// const res = await simpleChain.stream([
//   new HumanMessage("用中文讲一个笑话"),
// ])

// for await (const r of res) {
//   console.log(r);
// }

// streamLog 的调用方式 流式调用
const stream = await simpleChain.streamLog([
  new HumanMessage("用中文讲一个笑话")
])

for await (const chunk of stream){
 console.log(chunk)
}


