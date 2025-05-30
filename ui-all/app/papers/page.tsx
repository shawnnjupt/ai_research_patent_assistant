"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Calendar, BookOpen, ArrowLeft, Send, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

// 定义论文数据类型
interface Paper {
  id: string
  title: string
  authors: string[]
  abstract: string
  journal: string
  year: number
  url: string
  keywords: string[]
}

// 模拟论文数据
const mockPapers: Paper[] = [
  {
    id: "1",
    title: "深度学习在自然语言处理中的应用研究进展",
    authors: ["张三", "李四", "王五"],
    abstract:
      "本文综述了深度学习在自然语言处理领域的最新研究进展。深度学习模型，特别是Transformer架构，已经在机器翻译、文本分类、命名实体识别等任务上取得了突破性进展。本文分析了这些模型的优势和局限性，并探讨了未来的研究方向。",
    journal: "计算机学报",
    year: 2023,
    url: "https://example.com/paper1",
    keywords: ["深度学习", "自然语言处理", "Transformer", "机器翻译"],
  },
  {
    id: "2",
    title: "基于图神经网络的社交网络用户行为分析",
    authors: ["赵六", "钱七"],
    abstract:
      "社交网络中的用户行为分析对于理解社会动态和预测趋势具有重要意义。本研究提出了一种基于图神经网络的方法，通过建模用户之间的交互关系，有效地捕捉用户行为模式。实验结果表明，该方法在用户兴趣预测和社区发现任务上优于传统方法。",
    journal: "数据挖掘学报",
    year: 2022,
    url: "https://example.com/paper2",
    keywords: ["图神经网络", "社交网络", "用户行为", "社区发现"],
  },
  {
    id: "3",
    title: "量子计算在密码学中的应用与挑战",
    authors: ["孙八", "周九", "吴十"],
    abstract:
      "量子计算的发展对现有密码系统构成了潜在威胁。本文分析了量子计算对RSA、ECC等经典密码算法的影响，并探讨了后量子密码学的研究现状。文章还提出了一种新的抗量子攻击的密码方案，并通过理论分析和实验验证了其安全性。",
    journal: "密码学研究",
    year: 2023,
    url: "https://example.com/paper3",
    keywords: ["量子计算", "密码学", "后量子密码", "安全性分析"],
  },
  {
    id: "4",
    title: "人工智能辅助医学影像诊断系统研究",
    authors: ["刘一", "陈二", "张三"],
    abstract:
      "本研究提出了一种基于深度学习的医学影像辅助诊断系统，该系统能够自动检测和分类CT、MRI等医学影像中的异常区域。通过在大规模医学影像数据集上的训练和验证，系统在肺结节检测、脑肿瘤分割等任务上达到了接近专业医生的诊断准确率。研究结果表明，人工智能技术有望成为医学影像诊断的有力辅助工具。",
    journal: "生物医学工程学报",
    year: 2023,
    url: "https://example.com/paper4",
    keywords: ["人工智能", "医学影像", "辅助诊断", "深度学习"],
  },
  {
    id: "5",
    title: "区块链技术在供应链管理中的应用研究",
    authors: ["王五", "赵六"],
    abstract:
      "本文探讨了区块链技术在供应链管理中的应用前景和实施策略。研究表明，区块链的去中心化、不可篡改和智能合约等特性可以有效解决传统供应链中的信任问题、信息不对称和流程效率低下等问题。文章通过案例分析，总结了区块链在产品溯源、供应链金融和智能合约执行等方面的应用模式和实施路径。",
    journal: "管理科学学报",
    year: 2022,
    url: "https://example.com/paper5",
    keywords: ["区块链", "供应链管理", "产品溯源", "智能合约"],
  },
]

export default function PapersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchResults, setSearchResults] = useState<Paper[]>([])
  const [question, setQuestion] = useState("")
  const [aiResponses, setAiResponses] = useState<{ question: string; answer: string }[]>([])

  // 模拟搜索功能
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowResults(true)

    // 模拟API请求延迟
    setTimeout(() => {
      // 简单的关键词匹配
      const results = mockPapers.filter(
        (paper) =>
          paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
          paper.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setSearchResults(results)
      setIsSearching(false)

      // 初始化AI回答
      if (results.length > 0) {
        setAiResponses([
          {
            question: `关于"${searchQuery}"的主要研究方向有哪些？`,
            answer: `关于"${searchQuery}"的研究主要集中在以下几个方向：\n\n1. 理论基础研究：探索${searchQuery}的基本原理和理论框架\n\n2. 应用技术研究：研究${searchQuery}在实际场景中的应用方法和技术实现\n\n3. 性能优化研究：探索提高${searchQuery}效率和性能的方法\n\n4. 跨领域融合研究：研究${searchQuery}与其他技术领域的结合应用`,
          },
        ])
      }
    }, 1000)
  }

  // 处理回车键搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // 模拟AI回答
  const handleAskQuestion = () => {
    if (!question.trim()) return

    // 简单的模拟回答
    const newResponse = {
      question,
      answer: `关于"${question}"，根据现有研究文献分析：\n\n1. 最新研究表明，${question}领域有显著进展\n\n2. 主流方法包括A方法、B方法和C方法\n\n3. 目前研究挑战主要集中在数据规模、计算效率和泛化能力方面\n\n4. 未来研究方向可能会更关注可解释性和低资源场景应用`,
    }

    setAiResponses([...aiResponses, newResponse])
    setQuestion("")
  }

  // 处理回车键提交问题
  const handleQuestionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAskQuestion()
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-black text-white border-b border-gray-800">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-white text-lg font-bold">芯智领航者</h1>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-bold">论文创新点查询</h2>
            <p className="text-muted-foreground">输入论文标题或关键词，快速查询相关论文的创新点</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="输入论文标题或关键词..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button className="absolute right-2 top-2" onClick={handleSearch}>
              搜索
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    研究领域
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择研究领域" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部领域</SelectItem>
                      <SelectItem value="cs">计算机科学</SelectItem>
                      <SelectItem value="physics">物理学</SelectItem>
                      <SelectItem value="chemistry">化学</SelectItem>
                      <SelectItem value="biology">生物学</SelectItem>
                      <SelectItem value="medicine">医学</SelectItem>
                      <SelectItem value="engineering">工程学</SelectItem>
                      <SelectItem value="economics">经济学</SelectItem>
                      <SelectItem value="management">管理学</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    发表时间范围
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">起始时间</div>
                      <div className="grid grid-cols-2 gap-1">
                        <Input type="number" placeholder="年" min="1900" max="2100" />
                        <Input type="number" placeholder="月" min="1" max="12" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">结束时间</div>
                      <div className="grid grid-cols-2 gap-1">
                        <Input type="number" placeholder="年" min="1900" max="2100" />
                        <Input type="number" placeholder="月" min="1" max="12" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button className="gap-2" onClick={handleSearch}>
                  <Filter className="h-4 w-4" />
                  筛选查询
                </Button>
              </div>
            </CardContent>
          </Card>

          {showResults ? (
            <div className="mt-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* 左侧AI问答板块 */}
                <div className="lg:w-1/3">
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">AI</span>
                        </div>
                        AI问答助手
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden flex flex-col">
                      <ScrollArea className="flex-grow pr-4 mb-4 max-h-[500px]">
                        {aiResponses.map((item, index) => (
                          <div key={index} className="mb-6">
                            <div className="font-medium text-sm mb-1">问：{item.question}</div>
                            <div className="bg-muted p-3 rounded-lg text-sm whitespace-pre-line">{item.answer}</div>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                      <div className="relative mt-auto">
                        <Textarea
                          placeholder="输入您的问题..."
                          className="resize-none pr-10"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onKeyDown={handleQuestionKeyDown}
                          rows={3}
                        />
                        <Button
                          size="icon"
                          className="absolute right-2 bottom-2 h-6 w-6"
                          onClick={handleAskQuestion}
                          disabled={!question.trim()}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 右侧搜索结果列表 */}
                <div className="lg:w-2/3">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">搜索结果：{searchQuery}</h2>
                    <div className="text-sm text-muted-foreground">找到 {searchResults.length} 篇相关论文</div>
                  </div>

                  {isSearching ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="w-full">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
                              <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                                <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.length === 0 ? (
                        <div className="text-center py-12">
                          <h3 className="text-xl font-medium">未找到相关论文</h3>
                          <p className="text-muted-foreground mt-1">请尝试其他关键词或调整筛选条件</p>
                        </div>
                      ) : (
                        searchResults.map((paper) => (
                          <Card key={paper.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <h3 className="text-lg font-bold leading-tight">{paper.title}</h3>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>作者：</span>
                                  <span>{paper.authors.join(", ")}</span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>期刊：{paper.journal}</span>
                                  <span>年份：{paper.year}</span>
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                  {paper.abstract}
                                </p>

                                <div className="flex items-center justify-between pt-2">
                                  <div className="flex flex-wrap gap-1">
                                    {paper.keywords.slice(0, 3).map((keyword, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                    {paper.keywords.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{paper.keywords.length - 3}
                                      </Badge>
                                    )}
                                  </div>

                                  <Button variant="outline" size="sm" className="gap-1" asChild>
                                    <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                      查看原文
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium">输入查询条件开始搜索</h3>
              <p className="text-muted-foreground mt-1">查询结果将在这里显示</p>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} 科研创新点查询助手 - 助力科研，发现创新
        </div>
      </footer>
    </div>
  )
}
