import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
os.environ.setdefault("DASHSCOPE_API_KEY", os.environ.get("ALIBABA_API_KEY", ""))

from langchain.agents import create_agent
from langchain_community.chat_models.tongyi import ChatTongyi

def get_weather(city: str) -> str:  # (1)!
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

model = ChatTongyi(model="qwen-turbo")  # (2)!

agent = create_agent(
    model=model,
    tools=[get_weather],  # (3)!
    system_prompt="You are a helpful assistant"  # (4)!
)

# Run the agent
result = agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in 广州"}]}
)
print(result["messages"][-1].content)
