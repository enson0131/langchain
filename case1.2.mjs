import { ChatBaiduWenxin } from "@langchain/community/chat_models/baiduwenxin";
import { HumanMessage } from "@langchain/core/messages";
import 'dotenv/config';

const ernieTurbo = new ChatBaiduWenxin({
    modelName: process.env.BAIDU_MODEL_NAME,
});

const messages = [new HumanMessage("讲一个笑话")];

const res = await ernieTurbo.invoke(messages);

console.log(res);
