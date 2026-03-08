# 有记忆功能的 Agent

import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
os.environ.setdefault("DASHSCOPE_API_KEY", os.environ.get("ALIBABA_API_KEY", ""))

from langchain.agents import create_agent
from langchain_community.chat_models.tongyi import ChatTongyi
from langgraph.checkpoint.memory import InMemorySaver


checkpointer = InMemorySaver()

def get_weather(city: str) -> str:
    """获取某个城市的天气"""
    return f"城市：{city}，天气晴朗！"

model = ChatTongyi(model="qwen-turbo")

agent = create_agent(
    model=model,
    tools=[get_weather],
    checkpointer=checkpointer, # 添加记忆功能
)

config = {
    "configurable": {
        "thread_id": "1",
    }
}

gz_response = agent.invoke(
    {"messages": [{"role": "user", "content": "广州天气怎么样？"}]},
    config,
)

print(gz_response)

bj_response = agent.invoke(
    {"messages": [{"role": "user", "content": "北京呢？"}]},
    config,
)

print(bj_response)