import os
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
from search_links import SearchLinks
import json

class PatentDownloader:
    def __init__(self, ip='127.0.0.1:7890'):
        self.searchlinks = SearchLinks(ip=ip)

    def _get_pdf_link(self, patent_url):
        resp = requests.get(patent_url)
        soup = BeautifulSoup(resp.text, 'html.parser')

        try:
            pdf_link = soup.select_one('head > meta[name=citation_pdf_url]')['content']
            return pdf_link
        except Exception as e:
            print(f"无法找到 PDF 下载链接: {patent_url}")
            print(e)
            return None

    def _download_pdf(self, link, dst):
        if os.path.isfile(dst):
            print(f"文件已存在: {dst}")
            return

        response = requests.get(link, stream=True)
        try:
            data_length = int(response.headers.get('content-length'))
        except:
            data_length = 0

        print(f"开始下载: {link}")
        with open(dst, 'wb') as file:
            for data in tqdm(response.iter_content(chunk_size=1024),
                             total=int(data_length / 1024) + 1,
                             unit='KB',
                             unit_scale=True):
                if data:
                    file.write(data)
                    file.flush()

        print(f"文件保存成功: {dst}")

    def _batch_download_pdfs(self, links, output_dir='./download'):
        os.makedirs(output_dir, exist_ok=True)

        failed = []

        for idx, link in enumerate(links, start=1):
            print(link)
            patent_id = link.strip('/').split('/')[-2]
            print(f"[{idx}/{len(links)}] 正在处理专利 ID: {patent_id}")

            pdf_url = self._get_pdf_link(link)
            if not pdf_url:
                failed.append(patent_id)
                continue

            dst = os.path.join(output_dir, f"{patent_id}.pdf")
            self._download_pdf(pdf_url, dst)

        print("\n下载完成！")
        if failed:
            print("以下专利未找到 PDF：")
            print('\n'.join(failed))
        else:
            print("全部专利 PDF 下载成功！")
    def get(self, keywords, after_date, before_date, output_json='patents_info.json'):
        """
        执行搜索并下载专利 PDF，同时将专利信息保存为 JSON 文件
        :param keywords: 关键词列表，使用 AND 连接
        :param after_date: 开始时间，格式为 YYYYMMDD
        :param before_date: 结束时间，格式为 YYYYMMDD
        :param output_json: 输出的 JSON 文件路径
        """
        # 构造查询字符串
        keyword_str = " AND ".join([f"({kw})" for kw in keywords])
        query = f"{keyword_str} after:priority:{after_date} before:priority:{before_date}"

        # 搜索专利链接
        self.searchlinks.search(query)
        numbers, titles, abstracts = self.searchlinks.collect_links()

        if not numbers:
            print("未找到匹配的专利信息。")
            return

        # 构造专利页面链接
        links = [f'https://patents.google.com/patent/{s}/en' for s in numbers]

        # 保存为 JSON 文件
        patent_data = []
        for number, title, abstract in zip(numbers, titles, abstracts):
            patent_data.append({
                'number': number,
                'title': title,
                'abstract': abstract
            })

        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(patent_data, f, ensure_ascii=False, indent=4)

        print(f"专利信息已保存至 {os.path.abspath(output_json)}")

        # 批量下载 PDF
        self._batch_download_pdfs(links, output_dir='./download_patents')

if __name__ == '__main__':
    downloader = PatentDownloader(ip='127.0.0.1:7890')
    downloader.get(
        keywords=["南京大学", "CPU"],
        after_date="20240101",
        before_date="20250301"
    )