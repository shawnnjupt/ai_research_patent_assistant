"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText, Send, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/shared/header"

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
    content:
      "您好，我是AI专利撰写助手。请描述您的发明创意或技术方案，我将帮助您撰写专业的专利说明书。您可以告诉我发明名称、技术领域、背景技术、发明内容等信息。",
    sender: "assistant",
    timestamp: new Date(),
  },
]

// 技术领域选项
const technicalFields = [
  "人工智能",
  "计算机视觉",
  "自然语言处理",
  "机器学习",
  "集成电路",
  "半导体制造",
  "通信技术",
  "物联网",
  "云计算",
  "区块链",
  "生物技术",
  "医疗设备",
  "新能源",
  "材料科学",
  "机械工程",
]

export default function SpecificationPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [patentTitle, setPatentTitle] = useState("")
  const [technicalField, setTechnicalField] = useState("")
  const [background, setBackground] = useState("")
  const [inventionContent, setInventionContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

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
          "感谢您的描述！我已经理解了您的发明创意。这看起来是一个关于图像识别技术的创新方法。我已经提取了关键信息，您可以在右侧表单中补充更多细节，然后点击生成专利说明书按钮。",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      // 从用户消息中提取可能的标题
      if (!patentTitle) {
        const possibleTitle = extractTitle(currentMessage)
        if (possibleTitle) setPatentTitle(possibleTitle)
      }

      // 从用户消息中提取可能的技术领域
      if (!technicalField) {
        const possibleField = extractTechnicalField(currentMessage)
        if (possibleField) setTechnicalField(possibleField)
      }

      setIsAnalyzing(false)
    }, 2000)
  }

  // 从文本中提取可能的标题
  const extractTitle = (text: string): string => {
    // 简单实现：取第一行或第一个句号前的内容作为可能的标题
    const firstLine = text.split("\n")[0]
    if (firstLine.length < 50) return firstLine

    const firstSentence = text.split("。")[0]
    if (firstSentence.length < 50) return firstSentence

    return ""
  }

  // 从文本中提取可能的技术领域
  const extractTechnicalField = (text: string): string => {
    // 简单实现：检查文本中是否包含技术领域列表中的词
    for (const field of technicalFields) {
      if (text.includes(field)) return field
    }
    return ""
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleGenerateSpec = () => {
    // 构建参数
    const searchParams = new URLSearchParams()
    if (patentTitle) searchParams.set("title", patentTitle)
    if (technicalField) searchParams.set("field", technicalField)
    if (background) searchParams.set("background", background)
    if (inventionContent) searchParams.set("content", inventionContent)

    // 添加聊天记录中的描述
    const userMessages = messages
      .filter((msg) => msg.sender === "user")
      .map((msg) => msg.content)
      .join(" ")
    if (userMessages) searchParams.set("description", userMessages)

    // 跳转到结果页面
    router.push(`/dashboard/patents/specification/results?${searchParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="芯智领航者 - 专利说明书撰写" backUrl="/dashboard/patents" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧 - AI专利助手聊天框 */}
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-600" />
                AI专利撰写助手
              </CardTitle>
              <CardDescription>描述您的发明创意，AI助手将帮助您撰写专业的专利说明书</CardDescription>
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
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-800 flex items-start gap-2"
                      }`}
                    >
                      {message.sender === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-green-100 text-green-600">AI</AvatarFallback>
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
                        <AvatarFallback className="bg-green-100 text-green-600">AI</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">正在分析您的发明创意...</p>
                        <div className="mt-2 flex gap-1">
                          <span className="animate-bounce delay-0 h-2 w-2 bg-green-600 rounded-full"></span>
                          <span className="animate-bounce delay-150 h-2 w-2 bg-green-600 rounded-full"></span>
                          <span className="animate-bounce delay-300 h-2 w-2 bg-green-600 rounded-full"></span>
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
                  placeholder="描述您的发明创意或技术方案..."
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

          {/* 右侧 - 专利说明书表单 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                专利说明书生成
              </CardTitle>
              <CardDescription>补充专利详细信息，生成专业说明书</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">专利名称</label>
                  <Input
                    placeholder="输入专利名称"
                    value={patentTitle}
                    onChange={(e) => setPatentTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">技术领域</label>
                  <Select value={technicalField} onValueChange={setTechnicalField}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择技术领域" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicalFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">技术背景</label>
                  <Textarea
                    placeholder="描述技术背景"
                    className="resize-none h-24"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">发明内容</label>
                  <Textarea
                    placeholder="描述发明内容"
                    className="resize-none h-24"
                    value={inventionContent}
                    onChange={(e) => setInventionContent(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={handleGenerateSpec}>
                  生成专利说明书
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
