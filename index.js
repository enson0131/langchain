const { Ollama } = require('@langchain/community/llms/ollama');

const ollama = new Ollama({
  baseUrl: "http://localhost:11434", 
  model: "llama3", 
});


ollama.invoke("用中文讲一个笑话").then((res) => {
  console.log('res', res);
});