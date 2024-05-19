import { Ollama } from '@langchain/community/llms/ollama';

import 'dotenv/config'

const ollama = new Ollama({
  baseUrl: "http://localhost:11434", 
  model: "llama3", 
});

export default ollama;