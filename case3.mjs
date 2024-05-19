// 基础的 Prompt 模版使用
import { PromptTemplate } from "@langchain/core/prompts";

const greetingPrompt = new PromptTemplate({
    inputVariables: [], // 不传入任何变量
    template: 'hello world'
})

const formattedGreetingPrompt = await greetingPrompt.format();

console.log(formattedGreetingPrompt); // Prompt 模版 👉 hello world

const personalizedGreetingPrompt = new PromptTemplate({
    inputVariables: ["name"], // 传入一个变量
    template: "hello，{name}",
});

const formattedPersonalizedGreetingPrompt = await personalizedGreetingPrompt.format({
    name: "enson"
});

console.log(formattedPersonalizedGreetingPrompt); // 变量 Prompt 模版 👉 hello，enson


// 语法糖模版
const autoInferTemplate = PromptTemplate.fromTemplate("hello，{name}");

const formattedAutoInferTemplate = await autoInferTemplate.format({
    name: "enson",
  });
console.log(formattedAutoInferTemplate)