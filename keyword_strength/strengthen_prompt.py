# strengthen_prompt.py

import os
import openai
from dotenv import load_dotenv, find_dotenv

# 加载环境变量
load_dotenv(find_dotenv())



# 创建 OpenAI 客户端
client = openai.Client(api_key=api_key)
client.base_url = "https://api.deepseek.com"  # 自定义 API 基础 URL

# 初始化对话历史
messages = [
    {"role": "system", "content": "You are a helpful assistant"}
]

def ask_question(prompt):
    """发送用户问题给 API 并返回响应"""
    try:
        print("正在发送请求...")
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages + [{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        
        assistant_message = response.choices[0].message.content
        return assistant_message
    except Exception as e:
        print(f"API 调用出错: {e}")
        return None

def generate_research_prompt(user_input):
    """根据用户输入生成结构化的科研提示词"""
    template = """
    根据以下内容，请帮我整理成一个清晰的研究提示词：
    
    用户输入：{user_input}
    
    结构如下：
    - 研究背景：简要说明研究领域及其重要性。
    - 研究目的：明确研究的目标和期望解决的问题。
    - 研究方法：描述拟采用的方法和技术手段。
    - 研究结论：总结可能的结果和影响。
    
    请按照上述结构提供整理后的内容。
    """
    full_prompt = template.format(user_input=user_input)
    return full_prompt

def main():
    while True:
        # 用户输入
        user_input = input("\n请输入您的科研思路或关键词 (输入 'exit' 退出): ")
        if user_input.lower() == 'exit':
            print("对话结束，再见！")
            break

        # 生成结构化提示词
        structured_prompt = generate_research_prompt(user_input)

        # 添加到对话历史
        messages.append({"role": "user", "content": user_input})

        # 获取回答
        assistant_message = ask_question(structured_prompt)
        if assistant_message:
            # 打印回答并添加到对话历史
            print("\nDeepSeek 回答:")
            print(f"{assistant_message}")
            messages.append({"role": "assistant", "content": assistant_message})

if __name__ == "__main__":
    main()