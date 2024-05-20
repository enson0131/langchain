import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import "cheerio";

const loader = new CheerioWebBaseLoader(
  "https://kaiyi.cool/blog/github-copilot",
  {
    selector: "h3",
  }
);

const docs = await loader.load();

console.log(`******爬取网页数据*********`);
console.log(docs);
console.log(`******爬取网页数据*********`); 