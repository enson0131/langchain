// RecursiveCharacterTextSplitter 对文本进行分割
// https://chunkviz.up.railway.app/
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { TextLoader } from 'langchain/document_loaders/fs/text';

const text = new TextLoader('./data/kong.txt');
const docs = await text.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 64, // 分块的大小
    chunkOverlap: 0, // 块之间的重叠
});

const splitDocs = await splitter.splitDocuments(docs);

console.log(splitDocs);
