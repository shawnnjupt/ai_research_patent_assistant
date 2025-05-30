
export interface ResearchPaper {
  id: number;
  title: string;
  abstract: string;
  authors: string;
  journal: string[];
  year: string;
}


export async function fetchPapers(): Promise<ResearchPaper[]> {
  const response = await fetch('/api/output_llms'); // 假设有一个 API 路由来提供 JSON 数据
  const papersData = await response.json();
  return papersData.map((paper: any, index: number) => ({
    id: index,
    title: paper.title,
    abstract: paper.abstract,
    authors: paper.authors.join(', '),
    journal: paper.categories,
    year: paper.first_announced_date,
  }));
}
