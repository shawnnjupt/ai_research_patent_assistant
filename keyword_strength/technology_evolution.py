import os
import json
import re
import requests
from collections import defaultdict, Counter
from tqdm import tqdm
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm


# 配置DeepSeek API
DEEPSEEK_API_KEY = my_apikey
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"
MODEL_NAME = "deepseek-chat"


def extract_keywords_with_deepseek(text):
    """使用DeepSeek API提取集成电路领域专业关键词"""
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
请从以下文本中提取集成电路/半导体相关的专业术语或技术关键词。
如果是英文，请翻译成中文；如果是中文，直接提取即可。
只返回关键词列表，每行一个，不要解释或其他内容。

文本内容：
{text}
"""

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "top_p": 0.1,
        "max_tokens": 150
    }

    try:
        response = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        content = response.json()['choices'][0]['message']['content'].strip()
        return [line.strip().lower() for line in content.split('\n') if line.strip()]
    except Exception as e:
        print(f"API调用失败: {e}")
        return []
def format_evolution_data(evolution_data):
    formatted_result = ""
    sorted_years = sorted(evolution_data.keys())
    
    for year in sorted_years:
        keywords = evolution_data[year]
        if keywords:
            formatted_result += f"{year}年：{', '.join(keywords)}；\n"
        else:
            formatted_result += f"{year}年：无关键词；\n"
    
    return formatted_result


def extract_and_translate_keywords(text):
    """使用DeepSeek API直接提取并翻译集成电路领域关键词"""
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
    请从以下英文摘要中提取集成电路/半导体相关的专业术语或技术关键词，并直接翻译成中文。如果是中文，则不需要翻译。
    只返回翻译后的关键词列表，每行一个，不要解释或其他内容。

    文本内容：
    {text}
    """

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "top_p": 0.1,
        "max_tokens": 150
    }

    try:
        response = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        content = response.json()['choices'][0]['message']['content'].strip()
        return [line.strip() for line in content.split('\n') if line.strip()]
    except Exception as e:
        print(f"API调用失败: {e}")
        return []
def read_all_json_files(folder_path):
    all_patents = []

    json_files = [f for f in os.listdir(folder_path) if f.endswith(".json")]
    print("📚 正在读取 JSON 文件...")

    current_year = 2000  # 起始年份

    for filename in tqdm(json_files, desc="📄 读取进度", unit="file"):
        file_path = os.path.join(folder_path, filename)

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # 为每一条专利分配一个循环年份（2000~2025）
                for patent in data:
                    patent['assigned_year'] = 2000 + (current_year - 2000) % 26
                    current_year += 1  # 每处理一条专利，年份加一
                all_patents.extend(data)
        except Exception as e:
            print(f"⚠️ 读取 {filename} 失败: {e}")

    return all_patents


def ensure_full_year_range(evolution_data, start_year=2000, end_year=2025):
    """
    补全年份范围，缺失年份用空列表填充
    """
    full_data = {}
    for year in range(start_year, end_year + 1):
        full_data[year] = evolution_data.get(year, [])
    return full_data


def build_tech_evolution_data(patents):
    evolution_data = defaultdict(list)

    print("🧠 正在提取并翻译关键词...")
    for patent in tqdm(patents, desc="🔍 提取关键词进度", unit="patent"):
        title = patent.get("title", "")
        abstract = patent.get("abstract", "")

        # 合并标题和摘要作为输入文本
        text = title + "。" + abstract
        if len(text.strip()) < 30:
            continue  # 内容太短不处理text = title + "。" + abstract

        year = patent.get('assigned_year', None)
        if not year or year < 2000 or year > 2030:
            continue  # 过滤无效年份

        # 提取并翻译关键词
        keywords = extract_and_translate_keywords(text)
        evolution_data[year].extend(keywords)

    # 补全 2000 - 2025 年份
    full_evolution_data = ensure_full_year_range(evolution_data, 2000, 2025)

    # 统计每年前3个高频关键词
    result = {}
    for year, keywords in full_evolution_data.items():
        if keywords:
            counter = Counter(keywords)
            top_terms = [term for term, _ in counter.most_common(3)]
        else:
            top_terms = ["无关键词"]
        result[year] = top_terms

    return result


def plot_technology_evolution(evolution_data):
    # 设置中文字体和解决负号显示问题
    plt.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei']
    plt.rcParams['axes.unicode_minus'] = False

    sorted_years = sorted(evolution_data.keys())
    y_labels = []
    x_values = []

    for year in sorted_years:
        terms = evolution_data[year]
        for term in terms:
            y_labels.append(term)
            x_values.append(year)

    plt.figure(figsize=(12, 8))
    scatter = plt.scatter(x_values, y_labels, s=100, alpha=0.7, c=x_values, cmap='viridis')

    plt.title("集成电路行业技术演进图 (关键词演进 - 每年最多显示3个)")
    plt.xlabel("年份")
    plt.ylabel("技术关键词")
    plt.yticks(range(len(set(y_labels))), set(y_labels))
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    folder_path = 'D:/ai/zhuanli'

    # Step 1: 读取所有专利数据
    patents = read_all_json_files(folder_path)

    # Step 2: 构建技术演进数据
    evolution_data = build_tech_evolution_data(patents)
    # 在 main 中调用
    formatted_output = format_evolution_data(evolution_data)
    print(formatted_output)
    plot_technology_evolution(evolution_data)