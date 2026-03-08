import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
os.environ.setdefault("DASHSCOPE_API_KEY", os.environ.get("ALIBABA_API_KEY", ""))

from langgraph.prebuilt import create_react_agent
from langchain_community.chat_models.tongyi import ChatTongyi

model = ChatTongyi(model="qwen-turbo", streaming=True)

agent = create_react_agent(
    model=model,
    tools=[],
    prompt="You are a helpful assistant",
)

# 通过 agent.stream 进行流式输出
for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "你是谁？"}]},
    stream_mode="messages",
):
    msg, metadata = chunk
    if hasattr(msg, "content") and msg.content:
        print(msg.content, end="", flush=True)
print()

