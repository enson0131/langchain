import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { SearchApiLoader } from "@langchain/community/document_loaders/web/searchapi";

import "cheerio";
import 'dotenv/config'

// const loader = new CheerioWebBaseLoader(
//   "https://enson0131.github.io/vitePress-blob/",
//   {
//     selector: "h3",
//   }
// );

// const docs = await loader.load();

// console.log(`******爬取网页数据*********`);
// console.log(docs);
// console.log(`******爬取网页数据*********`); 



// https://js.langchain.com/v0.2/docs/integrations/document_loaders/web_loaders/searchapi
const apiKey = process.env["SERP_KEY"]
const question = "什么 github copliot"
const searchLoader = new SearchApiLoader({ q: question, apiKey, engine: "google" });
const searchRes = await searchLoader.load();

console.log(searchRes)