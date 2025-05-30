import re
from collections import Counter
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import json
import nltk
from nltk.corpus import stopwords, wordnet
from nltk.tokenize import word_tokenize
from collections import Counter

nltk.download([
    'punkt',
    'punkt_tab',  # 支持英文句子切分
    'averaged_perceptron_tagger',
    'averaged_perceptron_tagger_eng',  # 支持词性标注
    'wordnet',     # 支持词义分析
    'stopwords'    # 支持停用词过滤
])

def extract_noun_phrases(abstract):
    stop_words = set(stopwords.words('english'))

    # Tokenize and POS tag
    tokens = word_tokenize(abstract.lower())
    tagged = nltk.pos_tag(tokens)

    # Keep only nouns (NN, NNS, NNP, NNPS) and not in stop words
    nouns = [
        word for word, pos in tagged
        if pos in ('NN', 'NNS', 'NNP', 'NNPS') and word not in stop_words and len(word) > 2
    ]

    return nouns
def extract_noun_phrases_complex(abstract):
    grammar = r"""
        NBAR:
            {<DT>?<JJ>*<NN.*>*<CC>*<NN.*>+}
    """
    chunker = nltk.RegexpParser(grammar)
    tokens = word_tokenize(abstract.lower())
    tagged = nltk.pos_tag(tokens)
    tree = chunker.parse(tagged)

    noun_phrases = [
        ' '.join(word for word, _ in subtree.leaves())
        for subtree in tree.subtrees()
        if subtree.label() == 'NBAR'
    ]
    return noun_phrases

# 1. 读取 Markdown 文件
def read_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# 2. 提取 "keyword:" 后的内容
def extract_keywords(text):
    # 使用正则表达式匹配 "keyword: ..." 的内容
    pattern = r'keyword:\s*(.+)'
    matches = re.findall(pattern, text, re.IGNORECASE)
    
    # 将提取的关键词拆分为单词或短语并归一化（小写）
    keywords = []
    for match in matches:
        # 拆分逗号分隔的关键词，如 "machine learning, ai, deep learning"
        parts = [k.strip().lower() for k in match.split(',')]
        keywords.extend(parts)
    return keywords

def extract_keywords_from_abstracts(data):
    keywords = []
    for entry in data["chosen"] + data["filtered"]:
        abstract = entry.get("abstract", "")
        noun_keywords = extract_noun_phrases(abstract)
        keywords.extend(noun_keywords)
    return keywords
# 3. 统计词频
def count_keywords(keywords):
    return Counter(keywords)


# 4. 绘制直方图
def plot_histogram(counter):
    # 只显示前20个最常见的关键词
    most_common = counter.most_common(20)
    words, counts = zip(*most_common)

    plt.figure(figsize=(10, 6))
    plt.bar(words, counts, color='skyblue')
    plt.xticks(rotation=45, ha='right')
    plt.xlabel('Keywords')
    plt.ylabel('Frequency')
    plt.title('Keyword Frequency Histogram')
    plt.tight_layout()
    plt.show()


# 5. 生成词云图
def generate_wordcloud(counter):
    # 将 Counter 转换为字符串格式供 WordCloud 使用
    wordcloud_text = ' '.join([word + ' ' * count for word, count in counter.items()])
    
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(wordcloud_text)

    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")
    plt.title("Keyword Word Cloud")
    plt.show()


# 主程序入口
if __name__ == "__main__":
    file_path = 'D:/ai/ai_research_assistant/arxiv/output_llms/2025-04-22.json'
    data = read_json_file(file_path)
    keywords = extract_keywords_from_abstracts(data)
    counter = count_keywords(keywords)

    plot_histogram(counter)
    generate_wordcloud(counter)