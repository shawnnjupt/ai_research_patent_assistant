import json
import requests
from collections import Counter
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import os
from tqdm import tqdm
# 配置DeepSeek API



def extract_keywords_with_deepseek(text):
    """使用DeepSeek API提取集成电路领域专业关键词"""
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
    请从以下英文摘要中提取出集成电路/半导体相关的专业术语或技术关键词。
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
    except (requests.exceptions.RequestException, KeyError, IndexError) as e:
        print(f"API调用失败: {e}")
        return []


def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)


def extract_keywords_from_abstracts(data):
    keywords = []
    entries = data["chosen"] + data["filtered"]
    
    print("🧠 正在调用 DeepSeek 提取关键词...")
    for entry in tqdm(entries, desc="🔍 关键词提取进度", unit="abstract"):
        abstract = entry.get("abstract", "")
        if abstract:
            extracted = extract_keywords_with_deepseek(abstract)
            keywords.extend(extracted)
    return keywords


def count_keywords(keywords):
    return Counter(keywords)


def plot_histogram(counter):
    most_common = counter.most_common(20)
    words, counts = zip(*most_common)

    plt.figure(figsize=(10, 6))
    plt.bar(words, counts, color='skyblue')
    plt.xticks(rotation=45, ha='right')
    plt.xlabel('Keywords')
    plt.ylabel('Frequency')
    plt.title('Keyword Frequency Histogram (Top 20)')  # 👈 删除了 (DeepSeek)
    plt.tight_layout()
    plt.show()
def read_all_json_files(folder_path):
    all_data = {"chosen": [], "filtered": []}
    json_files = [f for f in os.listdir(folder_path) if f.endswith(".json")]
    
    print("📚 正在读取 JSON 文件...")
    for filename in tqdm(json_files, desc="📄 读取进度", unit="file"):
        file_path = os.path.join(folder_path, filename)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                all_data["chosen"].extend(data.get("chosen", []))
                all_data["filtered"].extend(data.get("filtered", []))
        except Exception as e:
            print(f"⚠️ 读取 {filename} 失败: {e}")
    
    return all_data

def generate_wordcloud(counter, top_n=20):
    """生成词云图，只包含直方图中显示的前 top_n 个关键词"""
    most_common = counter.most_common(top_n)
    wordcloud_text = ' '.join([word + ' ' * count for word, count in most_common])

    wordcloud = WordCloud(
        width=800,
        height=400,
        background_color='white',
        font_path= None  # 中文支持
    ).generate(wordcloud_text)

    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")
    plt.title(f"Top {top_n} Keyword Word Cloud")  # 👈 删除了 (DeepSeek)
    plt.show()


if __name__ == "__main__":
    folder_path = 'D:/ai/ai_research_assistant/arxiv/output_llms'  # 包含多个 .json 的文件夹
    data = read_all_json_files(folder_path)
    keywords = extract_keywords_from_abstracts(data)
    counter = count_keywords(keywords)
    plot_histogram(counter)
    generate_wordcloud(counter)