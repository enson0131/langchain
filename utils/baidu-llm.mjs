// 对接文心一言模型 https://js.langchain.com/v0.1/docs/integrations/chat/baidu_wenxin/
import "dotenv/config";
import { ChatBaiduWenxin } from "@langchain/community/chat_models/baiduwenxin";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Default model is ERNIE-Bot-turbo
const ernieTurbo = new ChatBaiduWenxin({
    baiduApiKey: process.env.BAIDU_API_KEY, // In Node.js defaults to process.env.BAIDU_API_KEY
    baiduSecretKey: process.env.BAIDU_SECRET_KEY, // In Node.js defaults to process.env.BAIDU_SECRET_KEY
});

// const messages = [
//   new SystemMessage("你是一位语言模型专家"),
//   new HumanMessage("模型正则化的目的是什么？"),
// ];

// const outputParse = new StringOutputParser();

// let res = await ernieTurbo.pipe(outputParse).invoke(messages);

// console.log(res);

export default ernieTurbo;