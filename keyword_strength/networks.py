import os
import json
import re
from collections import Counter, defaultdict
import requests
from tqdm import tqdm




def extract_keywords_with_deepseek(text):
    """使用 DeepSeek API 提取集成电路领域专业关键词"""
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
        return [line.strip() for line in content.split('\n') if line.strip()]
    except Exception as e:
        print(f"API调用失败: {e}")
        return []


def read_all_json_files(folder_path):
    all_papers = []

    json_files = [f for f in os.listdir(folder_path) if f.endswith(".json")]
    print("📚 正在读取 JSON 文件...")

    for filename in tqdm(json_files, desc="📄 读取进度", unit="file"):
        file_path = os.path.join(folder_path, filename)

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

                # 检查是否为预期结构
                if not isinstance(data, dict):
                    print(f"⚠️ {filename} 中的数据不是字典类型")
                    continue

                # 提取 "chosen" 列表中的每篇论文
                papers = data.get("chosen", [])
                if not isinstance(papers, list):
                    print(f"⚠️ {filename} 中的 'chosen' 不是列表类型")
                    continue

                for paper in papers:
                    if isinstance(paper, dict):
                        # 添加年份信息（从 date 字段提取）
                        date_str = data.get("date", "")
                        if date_str.startswith(("202", "203")):  # 如 "2025-04-22"
                            year = int(date_str.split("-")[0])
                            paper["assigned_year"] = year
                        all_papers.append(paper)
                    else:
                        print(f"⚠️ 跳过非字典类型的论文：{repr(paper)}")

        except Exception as e:
            print(f"⚠️ 读取 {filename} 失败: {e}")

    return all_papers


def extract_keywords_per_article_from_patents(patents):
    """从论文数据中提取每篇文章的关键词"""
    all_keywords_list = []

    print("🧠 正在提取每篇论文的关键词...")
    for patent in tqdm(patents, desc="🔍 提取关键词进度", unit="patent"):
        title = patent.get("title", "")
        abstract = patent.get("abstract", "")

        text = title + "。" + abstract
        if len(text.strip()) < 30:
            continue

        keywords = extract_keywords_with_deepseek(text)
        if keywords:
            all_keywords_list.append(keywords)

    return all_keywords_list


def build_keyword_frequency(all_keywords_list):
    """统计每个关键词的出现频率"""
    keyword_counter = Counter()
    for keywords in all_keywords_list:
        keyword_counter.update(set(keywords))  # 每篇只计一次
    return keyword_counter


def build_cooccurrence_matrix(all_keywords_list):
    """构建关键词共现矩阵"""
    co_occurrence = Counter()

    for keywords in all_keywords_list:
        keywords = sorted(set(keywords))  # 去重并排序以避免重复对
        for i in range(len(keywords)):
            for j in range(i + 1, len(keywords)):
                pair = tuple(sorted((keywords[i], keywords[j])))
                co_occurrence[pair] += 1

    return co_occurrence


import random

# 可以根据需要自定义颜色组
GROUP_COLORS = ["red", "blue", "green", "yellow"]

import random

# 将 group 改为数字 1~4
GROUP_VALUES = [1, 2, 3, 4]

def generate_graph_data(keyword_freq, co_occurrence, top_n=30):
    """生成图谱数据结构，并支持控制输出节点数量和随机 group 分组"""
    # 按照频率排序并选取前top_n个关键词
    sorted_keywords = sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)[:top_n]
    keyword_set = set(kw for kw, _ in sorted_keywords)

    nodes = []
    links = []

    # 构建节点数据，并随机分配 group 值（1~4）
    for keyword, freq in sorted_keywords:
        nodes.append({
            "id": keyword,
            "group": random.choice(GROUP_VALUES)  # 添加随机分组编号
        })

    # 构建连线数据，并随机指定value值
    for (source, target), weight in co_occurrence.items():
        if source in keyword_set and target in keyword_set:
            links.append({
                "source": source,
                "target": target,
                "value": random.randint(1, 10)  # 线宽随机设定在1-10之间
            })


    return {"nodes": nodes, "links": ensure_connected_graph(nodes, links)}


def save_graph_data_to_json(graph_data, output_path):
    """保存为 JSON 文件"""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(graph_data, f, ensure_ascii=False, indent=2)
    print(f"✅ 图谱数据已保存至 {output_path}")

def ensure_connected_graph(nodes, links):
    """
    确保图是连通的：选择一个中心节点，将其与所有其他节点连接
    """
    node_ids = [node["id"] for node in nodes]
    if len(node_ids) <= 1:
        return links

    central_node = node_ids[0]  # 选择第一个节点作为中心节点
    existing_pairs = set((link["source"], link["target"]) for link in links)

    for node_id in node_ids[1:]:
        if (central_node, node_id) not in existing_pairs and (node_id, central_node) not in existing_pairs:
            links.append({
                "source": central_node,
                "target": node_id,
                "value": random.randint(1, 10)  # 随机赋值
            })

    return links

if __name__ == "__main__":
    folder_path = 'D:/ai/output_llms'  # 改为你自己的路径
    output_path = 'graph_data.json'

    # Step 1: 读取所有论文数据
    papers = read_all_json_files(folder_path)

    # Step 2: 提取每篇论文的关键词
    all_keywords_list = extract_keywords_per_article_from_patents(papers)

    # Step 3: 统计关键词频率
    keyword_freq = build_keyword_frequency(all_keywords_list)

    # Step 4: 构建共现矩阵
    co_occurrence = build_cooccurrence_matrix(all_keywords_list)

    # Step 5: 生成图谱数据
    # Step 5: 生成图谱数据，这里可以指定输出的关键词数量，默认是30
    graph_data = generate_graph_data(keyword_freq, co_occurrence, top_n=20)

    # Step 6: 保存为 JSON 文件
    save_graph_data_to_json(graph_data, output_path)