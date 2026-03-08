import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
os.environ.setdefault("DASHSCOPE_API_KEY", os.environ.get("ALIBABA_API_KEY", ""))

from langchain.agents import create_agent
from langchain_community.chat_models.tongyi import ChatTongyi


model = ChatTongyi(model="qwen3-max")  # (2)!

agent = create_agent(
    model=model,
    system_prompt="You are a helpful assistant"  # (4)!
)

# Run the agent
result = agent.invoke(
    {"messages": [{"role": "user", "content": "你是谁？"}]}
)
print(result)

# 执行命令 ./run.sh "langGraph/test.py"  