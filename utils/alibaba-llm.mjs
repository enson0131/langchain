import { ChatAlibabaTongyi } from "@langchain/community/chat_models/alibaba_tongyi";
import 'dotenv/config'

// Default model is qwen-turbo

const qwenTurbo = new ChatAlibabaTongyi();

export default qwenTurbo