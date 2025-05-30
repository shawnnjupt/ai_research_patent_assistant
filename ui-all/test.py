# test.py
import sys
import time
import argparse
import urllib.parse

def main():
    parser = argparse.ArgumentParser(description="Process optional keywords")
    parser.add_argument('--optional_keywords', type=str, default="default", help="Optional keywords for processing")
    args = parser.parse_args()

    # 解码接收到的参数
    input_text = urllib.parse.unquote(args.optional_keywords)
    print(f"Processing: {input_text}", flush=True)
    time.sleep(2)  # 模拟耗时操作
    print(f"Processed input: {input_text.upper()}", flush=True)
#     print("""
# ## 创新度分析

# 基于您提供的研究idea，我分析出以下创新点：

# 1. **方法创新**：您提出的现金转移支付与社会保障网络结合的方法在现有研究中较为少见，创新度：**高**

# 2. **应用场景创新**：将此方法应用于老年人群体是对已有研究的扩展，创新度：**中**

# 3. **理论框架创新**：您整合的多维贫困评估框架有一定新意，但类似框架已有先例，创新度：**中低**

# ### 总体评估

# 该研究idea的整体创新度为 **中高**，建议您重点发展方法创新部分，并加强与现有文献的对比分析。右侧为您展示了按创新点相似度排序的相关研究，您可以参考这些文献进一步完善您的研究idea.
# """, flush=True)

if __name__ == "__main__":
    main()