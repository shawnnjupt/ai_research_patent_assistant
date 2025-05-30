"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ArrowLeft,
  Filter,
  Calendar,
  User,
  Building,
  ChevronRight,
  ChevronLeft,
  Send,
  Bot,
  Lightbulb,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Header } from "@/components/shared/header"

// 按首字母分组的机构数据
const institutionsByLetter = {
  A: [
    "安徽大学",
    "安徽工业大学",
    "安徽理工大学",
    "安徽师范大学",
    "安徽医科大学",
    "安徽农业大学",
    "安徽财经大学",
    "安徽建筑大学",
    "安徽工程大学",
  ],
  B: [
    "北京大学",
    "北京理工大学",
    "北京航空航天大学",
    "北京师范大学",
    "北京邮电大学",
    "北京交通大学",
    "北京科技大学",
    "北京化工大学",
    "北京林业大学",
    "北京中医药大学",
    "北京外国语大学",
    "北京语言大学",
    "北京工业大学",
    "北京建筑大学",
    "北京信息科技大学",
    "北京联合大学",
    "北京工商大学",
    "北京服装学院",
    "北京印刷学院",
    "北京石油化工学院",
    "北京农学院",
    "北京物资学院",
    "北京舞蹈学院",
    "北京电影学院",
    "北京第二外国语学院",
    "北京体育大学",
    "北京音乐学院",
  ],
  C: [
    "重庆大学",
    "重庆邮电大学",
    "重庆交通大学",
    "重庆理工大学",
    "重庆工商大学",
    "重庆师范大学",
    "重庆文理学院",
    "重庆三峡学院",
    "重庆科技学院",
    "长安大学",
    "长春理工大学",
    "长春工业大学",
    "长沙理工大学",
    "长江大学",
    "常州大学",
    "成都理工大学",
    "成都信息工程大学",
    "承德医学院",
    "沧州师范学院",
  ],
  // 其他字母组数据...
}

// 研究所数据
const researchInstitutes = [
  "中国科学院计算技术研究所",
  "中国科学院微电子研究所",
  "中国科学院上海微系统与信息技术研究所",
  "中国科学院光电技术研究所",
  "中国科学院半导体研究所",
  "中国电子科技集团",
  "中国电子信息产业集团",
  "华为技术有限公司",
  "中兴通讯股份有限公司",
  "紫光集团有限公司",
]

// 海外高校
const overseasUniversities = [
  "麻省理工学院 (MIT)",
  "斯坦福大学 (Stanford)",
  "加州大学伯克利分校 (UC Berkeley)",
  "卡内基梅隆大学 (CMU)",
  "加州理工学院 (Caltech)",
  "佐治亚理工学院 (Georgia Tech)",
  "伊利诺伊大学厄巴纳-香槟分校 (UIUC)",
  "密歇根大学安娜堡分校 (UMich)",
  "普渡大学 (Purdue)",
  "德克萨斯大学奥斯汀分校 (UT Austin)",
  "剑桥大学 (Cambridge)",
  "牛津大学 (Oxford)",
  "帝国理工学院 (Imperial College)",
  "苏黎世联邦理工学院 (ETH Zurich)",
  "东京大学 (University of Tokyo)",
  "京都大学 (Kyoto University)",
  "首尔国立大学 (Seoul National University)",
  "新加坡国立大学 (NUS)",
  "南洋理工大学 (NTU)",
]

// 所有类别
const categories = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "F", label: "F" },
  { value: "G", label: "G" },
  { value: "H", label: "H" },
  { value: "J", label: "J" },
  { value: "K", label: "K" },
  { value: "L", label: "L" },
  { value: "N", label: "N" },
  { value: "Q", label: "Q" },
  { value: "S", label: "S" },
  { value: "T", label: "T" },
  { value: "W", label: "W" },
  { value: "X", label: "X" },
  { value: "Y", label: "Y" },
  { value: "Z", label: "Z" },
  { value: "研究所", label: "研究所" },
  { value: "海外高校", label: "海外高校" },
]

// 聊天消息类型
type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

// 初始聊天消息
const initialMessages: Message[] = [
  {
    id: "1",
    content: "您好，我是AI专利助手。请描述您的专利创意或技术方案，我将帮助您进行查新检索。",
    sender: "assistant",
    timestamp: new Date(),
  },
]

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedInstitution, setSelectedInstitution] = useState<string>("")
  const [displayValue, setDisplayValue] = useState("")
  const [selectedField, setSelectedField] = useState("")
  const [selectedTimeRange, setSelectedTimeRange] = useState("")
  const [inventor, setInventor] = useState("")
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [currentMessage, setCurrentMessage] = useState("")
  const [patentDescription, setPatentDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // 构建搜索参数
    const searchParams = new URLSearchParams()
    if (searchQuery) searchParams.set("query", searchQuery)
    if (selectedField) searchParams.set("field", selectedField)
    if (selectedInstitution) searchParams.set("institution", selectedInstitution)
    if (inventor) searchParams.set("inventor", inventor)
    if (selectedTimeRange) searchParams.set("timeRange", selectedTimeRange)
    if (patentDescription) searchParams.set("description", patentDescription)

    // 跳转到结果页面
    router.push(`/dashboard/patents/search/results?${searchParams.toString()}`)
  }

  const getInstitutionsByCategory = (category: string) => {
    if (category === "研究所") {
      return researchInstitutes
    } else if (category === "海外高校") {
      return overseasUniversities
    } else {
      return institutionsByLetter[category as keyof typeof institutionsByLetter] || []
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSelectedInstitution("")
    setDisplayValue("")
  }

  const handleInstitutionSelect = (institution: string) => {
    setSelectedInstitution(institution)
    setDisplayValue(institution)
    setOpen(false)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setSelectedInstitution("")
    setDisplayValue("")
  }

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")

    // 模拟分析过程
    setIsAnalyzing(true)
    setTimeout(() => {
      // 添加助手回复
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "感谢您的描述！我已经分析了您的专利创意。这看起来是一个关于芯片缺陷检测的创新方法。我已将您的描述添加到查新检索中，您可以在右侧搜索框中添加更多筛选条件，或直接点击搜索按钮查看相似专利。",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setPatentDescription(currentMessage)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="芯智领航者 - 查新检索" backUrl="/dashboard/patents" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧 - AI专利助手聊天框 */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                AI专利助手
              </CardTitle>
              <CardDescription>描述您的专利详情，AI助手将帮助您进行查新检索</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 flex items-start gap-2"
                      }`}
                    >
                      {message.sender === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">正在分析您的专利创意...</p>
                        <div className="mt-2 flex gap-1">
                          <span className="animate-bounce delay-0 h-2 w-2 bg-blue-600 rounded-full"></span>
                          <span className="animate-bounce delay-150 h-2 w-2 bg-blue-600 rounded-full"></span>
                          <span className="animate-bounce delay-300 h-2 w-2 bg-blue-600 rounded-full"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full items-center gap-2">
                <Textarea
                  placeholder="描述您的专利创意或技术方案..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[80px] flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black hover:bg-gray-800"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black hover:bg-gray-800"
                  title="增强提示词"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* 右侧 - 搜索表单 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                专利查新搜索
              </CardTitle>
              <CardDescription>输入关键词或使用筛选条件进行专利查新</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch}>
                <div className="relative mb-6">
                  <Input
                    type="text"
                    placeholder="输入专利标题、关键词或摘要"
                    className="pl-10 py-6 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={selectedField} onValueChange={setSelectedField}>
                      <SelectTrigger>
                        <SelectValue placeholder="技术领域" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chip-design">芯片设计</SelectItem>
                        <SelectItem value="manufacturing">制造与工艺</SelectItem>
                        <SelectItem value="testing">测试与可靠性</SelectItem>
                        <SelectItem value="upstream">上游支撑技术</SelectItem>
                        <SelectItem value="application">应用驱动领域</SelectItem>
                        <SelectItem value="opensource">开源与生态</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {displayValue || "归属单位 (可选)"}
                          <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="搜索机构..." />
                          <CommandList>
                            <CommandEmpty>未找到结果</CommandEmpty>
                            {selectedCategory ? (
                              <>
                                <CommandGroup>
                                  <CommandItem onSelect={() => handleBackToCategories()} className="flex items-center">
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    返回类别
                                  </CommandItem>
                                </CommandGroup>
                                <CommandGroup heading={selectedCategory}>
                                  {getInstitutionsByCategory(selectedCategory).map((institution) => (
                                    <CommandItem
                                      key={institution}
                                      onSelect={() => handleInstitutionSelect(institution)}
                                      className="cursor-pointer"
                                    >
                                      {institution}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </>
                            ) : (
                              <CommandGroup heading="选择类别">
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category.value}
                                    onSelect={() => handleCategorySelect(category.value)}
                                    className="cursor-pointer"
                                  >
                                    {category.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <Input placeholder="发明人 (可选)" value={inventor} onChange={(e) => setInventor(e.target.value)} />
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="时间范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">最近1个月</SelectItem>
                        <SelectItem value="3months">最近3个月</SelectItem>
                        <SelectItem value="6months">最近6个月</SelectItem>
                        <SelectItem value="1year">最近1年</SelectItem>
                        <SelectItem value="3years">最近3年</SelectItem>
                        <SelectItem value="5years">最近5年</SelectItem>
                        <SelectItem value="10years">最近10年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {patentDescription && (
                  <Card className="mb-4 bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium">您描述的专利创意</h3>
                          <p className="text-sm text-gray-700 mt-1">{patentDescription}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="text-sm text-gray-500 mt-2 text-center">
                  注：技术领域、归属单位、发明人为可选的补充搜索条件，可提高搜索精确度
                </div>

                <Button type="submit" className="w-full py-6 text-lg mt-4">
                  搜索
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
