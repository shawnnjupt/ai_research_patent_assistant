"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Calendar, Award, ArrowLeft, Send, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

// 定义专利数据类型
interface Patent {
  id: string
  title: string
  inventors: string[]
  abstract: string
  patentNumber: string
  applicationDate: string
  publicationDate: string
  patentType: string
  url: string
  keywords: string[]
}

// 模拟专利数据
const mockPatents: Patent[] = [
  {
    id: "1",
    title: "一种基于深度学习的图像识别方法及系统",
    inventors: ["张三", "李四"],
    abstract:
      "本发明公开了一种基于深度学习的图像识别方法及系统，属于人工智能技术领域。该方法包括：获取待识别图像；对所述待识别图像进行预处理；将预处理后的图像输入预先训练好的深度神经网络模型中进行特征提取；基于提取的特征对图像进行分类识别；输出识别结果。本发明通过改进的卷积神经网络结构，提高了图像识别的准确率和速度，适用于各种复杂环境下的图像识别任务。",
    patentNumber: "CN123456789A",
    applicationDate: "2022-01-15",
    publicationDate: "2022-07-20",
    patentType: "发明专利",
    url: "https://example.com/patent1",
    keywords: ["深度学习", "图像识别", "卷积神经网络"],
  },
  {
    id: "2",
    title: "一种智能家居控制系统及方法",
    inventors: ["王五", "赵六"],
    abstract:
      "本实用新型提供了一种智能家居控制系统及方法，包括中央控制单元、多个智能终端设备和用户交互界面。该系统通过物联网技术实现家居设备的互联互通，用户可通过移动应用或语音指令控制家中的灯光、温度、安防等设备。本实用新型还提供了场景模式功能，可根据用户习惯自动调整家居环境，提高了居住舒适度和能源利用效率。",
    patentNumber: "CN987654321U",
    applicationDate: "2021-11-05",
    publicationDate: "2022-05-10",
    patentType: "实用新型",
    url: "https://example.com/patent2",
    keywords: ["智能家居", "物联网", "场景控制"],
  },
  {
    id: "3",
    title: "一种新型可降解塑料包装材料及其制备方法",
    inventors: ["钱七", "孙八", "周九"],
    abstract:
      "本发明涉及一种新型可降解塑料包装材料及其制备方法，属于环保材料技术领域。该材料以淀粉和聚乳酸为主要原料，通过特殊的共混改性工艺，解决了传统可降解材料强度低、阻隔性差的问题。本发明制备的包装材料具有良好的机械性能和气体阻隔性，在自然环境中可在3-6个月内完全降解，不产生有害物质，对环境友好。",
    patentNumber: "CN135792468A",
    applicationDate: "2022-03-20",
    publicationDate: "2022-09-25",
    patentType: "发明专利",
    url: "https://example.com/patent3",
    keywords: ["可降解塑料", "包装材料", "环保材料"],
  },
  {
    id: "4",
    title: "一种基于深度学习的语音识别系统",
    inventors: ["刘一", "陈二"],
    abstract:
      "本发明提供了一种基于深度学习的语音识别系统，该系统采用改进的循环神经网络和注意力机制，能够在嘈杂环境下准确识别多种语言和方言的语音内容。系统包括语音信号预处理模块、特征提取模块、声学模型模块和语言模型模块。本发明通过端到端的训练方式，显著提高了语音识别的准确率和鲁棒性，适用于智能助手、会议记录、字幕生成等多种应用场景。",
    patentNumber: "CN246813579A",
    applicationDate: "2022-05-18",
    publicationDate: "2022-11-30",
    patentType: "发明专利",
    url: "https://example.com/patent4",
    keywords: ["深度学习", "语音识别", "循环神经网络", "注意力机制"],
  },
  {
    id: "5",
    title: "一种新能源汽车电池管理系统",
    inventors: ["张三", "李四", "王五"],
    abstract:
      "本实用新型公开了一种新能源汽车电池管理系统，包括电池状态监测模块、温度控制模块、均衡充电模块和安全保护模块。该系统通过实时监测电池组的电压、电流、温度等参数，精确估算电池剩余电量和健康状态，并实现智能温度控制和均衡充电，有效延长电池使用寿命。本实用新型还设计了多重安全保护机制，能够及时发现并处理过充、过放、过热等异常情况，提高了新能源汽车的安全性和可靠性。",
    patentNumber: "CN369258147U",
    applicationDate: "2022-02-10",
    publicationDate: "2022-08-15",
    patentType: "实用新型",
    url: "https://example.com/patent5",
    keywords: ["新能源汽车", "电池管理", "温度控制", "安全保护"],
  },
]

export default function PatentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchResults, setSearchResults] = useState<Patent[]>([])
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
      const results = mockPatents.filter(
        (patent) =>
          patent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patent.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patent.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setSearchResults(results)
      setIsSearching(false)

      // 初始化AI回答
      if (results.length > 0) {
        setAiResponses([
          {
            question: `关于"${searchQuery}"的专利主要集中在哪些方向？`,
            answer: `关于"${searchQuery}"的专利主要集中在以下几个方向：\n\n1. 核心技术专利：保护${searchQuery}的基础技术和关键实现方法\n\n2. 应用场景专利：针对${searchQuery}在特定场景下的应用方案\n\n3. 制造工艺专利：关于${searchQuery}生产和制造过程的技术创新\n\n4. 系统集成专利：${searchQuery}与其他技术系统的集成方案`,
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
      answer: `关于"${question}"，根据现有专利文献分析：\n\n1. 近年来${question}相关专利申请数量呈上升趋势\n\n2. 主要技术路线包括X技术、Y技术和Z技术\n\n3. 专利布局主要集中在制造工艺、应用场景和系统集成方面\n\n4. 未来专利发展可能更关注环保性、成本效益和用户体验`,
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
            <h2 className="text-3xl font-bold">专利创新点查询</h2>
            <p className="text-muted-foreground">输入专利名称或关键词，快速查询相关专利的创新点</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="输入专利名称或关键词..."
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
                    <Award className="h-4 w-4" />
                    专利类型
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择专利类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="invention">发明专利</SelectItem>
                      <SelectItem value="utility">实用新型</SelectItem>
                      <SelectItem value="design">外观设计</SelectItem>
                      <SelectItem value="international">国际专利</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    申请时间范围
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
                    <div className="text-sm text-muted-foreground">找到 {searchResults.length} 项相关专利</div>
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
                          <h3 className="text-xl font-medium">未找到相关专利</h3>
                          <p className="text-muted-foreground mt-1">请尝试其他关键词或调整筛选条件</p>
                        </div>
                      ) : (
                        searchResults.map((patent) => (
                          <Card key={patent.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <h3 className="text-lg font-bold leading-tight">{patent.title}</h3>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>发明人：</span>
                                  <span>{patent.inventors.join(", ")}</span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>专利号：{patent.patentNumber}</span>
                                  <span>类型：{patent.patentType}</span>
                                  <span>公开日：{patent.publicationDate}</span>
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                  {patent.abstract}
                                </p>

                                <div className="flex items-center justify-between pt-2">
                                  <div className="flex flex-wrap gap-1">
                                    {patent.keywords.slice(0, 3).map((keyword, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                    {patent.keywords.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{patent.keywords.length - 3}
                                      </Badge>
                                    )}
                                  </div>

                                  <Button variant="outline" size="sm" className="gap-1" asChild>
                                    <a href={patent.url} target="_blank" rel="noopener noreferrer">
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
