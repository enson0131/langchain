import { OpenAI } from "@langchain/openai";
import 'dotenv/config';

const model = new OpenAI({
    model: "gpt-3.5-turbo", // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
    temperature: 0.9,
});

const res = await model.invoke(
    "What would be a good company name a company that makes colorful socks?"
);
console.log({ res });