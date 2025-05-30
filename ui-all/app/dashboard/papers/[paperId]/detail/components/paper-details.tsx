"use client"

import { Download, BookmarkPlus, Share, ThumbsUp, ChevronLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { url } from "inspector"

interface PaperDetailsProps {
  paperId: string
}

export function PaperDetails({ paperId }: PaperDetailsProps) {
  const [paperData, setPaperData] = useState<{
    title: string
    abstract: string
    year: string
    authors: string
    journal: string
  } | null>(null)
  // 新增：用于跟踪下载按钮的禁用状态
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(false)
  // 新增：用于跟踪下载按钮的文字
  const [downloadButtonText, setDownloadButtonText] = useState("下载全文")

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch('/api/getPapers')
        const data = await response.json()

        // Flatten the data and map fields according to the rules
        let globalIndex = 1 // 初始化全局索引
        const flattenedData = data.flatMap((file: any) => {
          return file.chosen.map((paper: any) => ({
            id: globalIndex++, // 使用全局索引
            title: paper.title,
            abstract: paper.abstract,
            year: paper.first_announced_date,
            authors: paper.authors,
            journal: paper.categories.join(', '), // Map categories to journal
            url: paper.url,
          }))
        })

        // 找到 id 为 paperId 的数据
        const targetPaper = flattenedData.find((paper) => paper.id === parseInt(paperId))
        if (targetPaper) {
          setPaperData(targetPaper)
        }
      } catch (error) {
        console.error('Error fetching papers:', error)
      }
    }

    fetchPapers()
  }, [paperId])

  if (!paperData) {
    return <div>Loading...</div>
  }

  // 新增：下载按钮点击事件处理函数
  const handleDownload = async () => {
    setIsDownloadDisabled(true)
    setDownloadButtonText("下载中...")

    try {
      const response = await fetch('/api/runarxiv_downloader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: paperData.title,
          date: paperData.year,
        }),
      })

      const result = await response.json()
      if (response.ok) {
        setDownloadButtonText("下载完毕")
      } else {
        console.error('Error downloading paper:', result.error)
        setDownloadButtonText("下载失败")
      }
    } catch (error) {
      console.error('Error calling downloader API:', error)
      setDownloadButtonText("下载失败")
    }

    setIsDownloadDisabled(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Paper Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-lg font-medium">Paper</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Cite
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            ID: {paperId}
          </Button>
        </div>
      </div>

      {/* Paper Title */}
      <h1 className="text-2xl font-bold mb-2">{paperData.title}</h1>

      {/* Publication Info */}
      <div className="text-sm text-gray-500 mb-4">Published {paperData.year} · {paperData.authors}</div>

      {/* Journal Info */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
        <div className="text-sm">
          <div className="font-medium">{paperData.journal}</div>
          <div className="text-gray-500">UNKNOWN SJR score</div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mb-6">
        <Button 
          className="gap-2" 
          disabled={isDownloadDisabled}
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          {downloadButtonText}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="space-y-6">
            {/* Abstract */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Abstract</h2>
              <p className="text-gray-700 leading-relaxed">{paperData.abstract}</p>
            </div>

            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Highly Cited</span>
            </div>

            {/* Innovation Assessment Report */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">创新性评估报告</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">研究创新点</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>比较分析了三种不同类型的现金转移支付项目对儿童贫困的影响</li>
                    <li>提出了针对不同国家和地区的现金转移支付项目设计差异的见解</li>
                    <li>评估了现金转移支付项目在减少儿童贫困方面的有效性</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">学术影响力评估</h3>
                  <p className="text-gray-700">
                    该论文在发展政策领域具有显著影响力，被引用244次，其中15次为高影响力引用。论文为儿童贫困干预政策提供了实证依据，对后续研究和政策制定产生了积极影响。
                  </p>
                </div>

                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  下载完整报告
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="references">
          <div className="py-4 text-center text-gray-500">References content would appear here</div>
        </TabsContent>

        <TabsContent value="citations">
          <div className="py-4 text-center text-gray-500">Citations content would appear here</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}