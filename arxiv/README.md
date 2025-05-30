First, make sure you have conda tools

## environment

```bash
pip install -r requirements.txt
```


## run

```py 
python arxiv_crawler.py
```

## 用法说明

要修改爬取的时间范围，领域，关键字，请参考`arxiv_crawler.py`中`ArxivScraper`类的注释：
一个文件被爬取到的条件是：首次提交时间在`date_from`和`date_until`之间，并且包含至少一个关键词。
一个文章被详细展示（不被过滤）的条件是：至少有一个领域在白名单中，并且没有任何一个领域在黑名单中。
Args:

- date_from (str): 开始日期(含当天)
- date_until (str): 结束日期(含当天)
- category_blacklist (list, optional): 黑名单. Defaults to [].
- category_whitelist (list, optional): 白名单. Defaults to ["cs.CV", "cs.AI", "cs.LG", "cs.CL", "cs.IR", "cs.MA"].
- optional_keywords (list, optional): 关键词, 各词之间关系为OR, 在标题/摘要中至少要出现一个关键词才会被爬取.
      Defaults to [ "LLM", "LLMs", "language model", "language models", "multimodal", "finetuning", "GPT"]
- trans_to: 翻译的目标语言, 若设为可转换为False的值则不会翻译
- proxy (str | None, optional): 用于翻译和爬取arxiv时要使用的代理, 通常是http://127.0.0.1:7890. Defaults to None

- 输出文件名是根据日期生成的，可以使用`output`方法的`filename_format`参数修改日期格式，默认为`%Y-%m-%d`即形如`2024-08-08.md`。

支持输入markdown 格式或者csv格式或者json格式

```py
scraper.to_json(meta=True)
```
