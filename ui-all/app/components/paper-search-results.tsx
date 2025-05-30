import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// 定义论文数据类型
export interface Paper {
  id: string
  title: string
  authors: string[]
  abstract: string
  journal: string
  year: number
  url: string
  keywords: string[]
}

interface PaperSearchResultsProps {
  papers: Paper[]
  isLoading?: boolean
}

export default function PaperSearchResults({ papers, isLoading = false }: PaperSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (papers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">未找到相关论文</h3>
        <p className="text-muted-foreground mt-1">请尝试其他关键词或调整筛选条件</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">找到 {papers.length} 篇相关论文</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            相关性排序
          </Button>
          <Button variant="outline" size="sm">
            时间排序
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {papers.map((paper) => (
          <Card key={paper.id} className="w-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">{paper.title}</CardTitle>
              <div className="flex flex-wrap gap-1 mt-1">
                {paper.authors.map((author, index) => (
                  <span key={index} className="text-sm text-muted-foreground">
                    {author}
                    {index < paper.authors.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {paper.journal} ({paper.year})
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{paper.abstract}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {paper.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button variant="ghost" size="sm">
                查看创新点
              </Button>
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <a href={paper.url} target="_blank" rel="noopener noreferrer">
                  原文链接
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
