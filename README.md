# AI 实战指北

通过 Ollama 跑本地模型，通过 langchain 进行调用。

## llama3 模型

```shell
# 模型列表参考：https://ollama.com/library
ollama pull [model] # 拉取模型
```

## 文心一言模型
```TS
import { ChatBaiduWenxin } from "@langchain/community/chat_models/baiduwenxin";
const ernieTurbo = new ChatBaiduWenxin({
    baiduApiKey: process.env.BAIDU_API_KEY, // In Node.js defaults to process.env.BAIDU_API_KEY
    baiduSecretKey: process.env.BAIDU_SECRET_KEY, // In Node.js defaults to process.env.BAIDU_SECRET_KEY
});
```

## 环境
Node >= 18.0.0

## 参考文档
- 对接文心一言模型 https://js.langchain.com/v0.1/docs/integrations/chat/baidu_wenxin/
- 段落分割 https://chunkviz.up.railway.app/
- 通过 Faiss 创建向量数据库 https://js.langchain.com/v0.2/docs/integrations/vectorstores/faiss/#create-a-new-index-from-texts
