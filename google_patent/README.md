First, make sure you have conda tools

## environment

```bash
pip install -r requirements.txt
```

## run

```py
python google_patent_search.py
```

## 用法说明

确保你安装了谷歌浏览器 和  chromedriver(137.0)

目前使用的是最新版的谷歌浏览器

https://www.google.com/intl/zh-CN/chrome/

会生成一个json文件和在./download_patents/文件夹下下载专利对应的pdf

注意：谷歌需要代理才能使用,需要在函数里面设置代理ip

```bash
downloader = PatentDownloader(ip='127.0.0.1:7890')
```