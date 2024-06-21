import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  temperature: 0.9,
//   apiKey: "YOUR-API-KEY", // In Node.js defaults to process.env.OPENAI_API_KEY
});

export default model;