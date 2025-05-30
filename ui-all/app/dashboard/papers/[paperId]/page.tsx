"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import KnowledgeGraph from "@/app/components/knowledge-graph"
import type { ResearchPaper } from "@/app/types/research"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function ResearchInnovationSearch() {
  const params = useParams()
  const router = useRouter()
  const paperId = params.paperId as string
  const [searchKeyword, setSearchKeyword] = useState("")

  // 引入 KnowledgeGraph 组件的 reRender 函数
  const knowledgeGraphRef = useRef<{ reRender: () => void }>(null)

  useEffect(() => {
    console.log('Params:', params)
    console.log('PaperId:', paperId)
    if (paperId) {
      const decodedKeyword = decodeURIComponent(paperId)
      console.log('Decoded keyword:', decodedKeyword)
      setSearchKeyword(decodedKeyword)
    }
  }, [paperId, params])

  // Update the initial messages state to focus on innovation analysis
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "您好！我是您的论文创新度分析助手。请输入您的研究idea或论文摘要，我将帮您分析其创新点和在学术领域的创新程度。",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [papers, setPapers] = useState<ResearchPaper[]>([]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch('/api/getPapers');
        const data = await response.json();

        // Flatten the data and map fields according to the rules
        let globalIndex = 1; // 初始化全局索引
        const flattenedData = data.flatMap((file: any) => {
          return file.chosen.map((paper: any) => ({
            id: globalIndex++, // 使用全局索引
            title: paper.title,
            abstract: paper.abstract,
            year: paper.first_announced_date,
            authors: paper.authors,
            journal: paper.categories.join(', '), // Map categories to journal
          }));
        });

        setPapers(flattenedData);
      } catch (error) {
        console.error('Error fetching papers:', error);
      }
    };

    fetchPapers();
  }, []);

  // Update the handleSendMessage function to provide innovation analysis
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 发送用户输入到 runPython.js API
    try {
      const response = await fetch('/api/runPython', {
      //const response = await fetch('/api/runarxiv_crawler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to run Python script');
      }

      const data = await response.json();
      const newMessages = [
        ...messages,
        { role: "user", content: inputValue },
        { role: "assistant", content: data.output },
      ];
      // const newMessages = [
      //   ...messages,
      //   { role: "user", content: inputValue } as const satisfies typeof messages[number],
      //   { role: "assistant", content: data.output } as const satisfies typeof messages[number],
      // ] satisfies typeof messages;

      setMessages(newMessages);
      setInputValue("");
    } catch (error) {
      console.error('Error running Python script:', error);
      alert('Failed to process input. Please try again.');
    }
  };

  const handleEnhancePrompt = async () => {
    try {
      // 调用 runprompt_enhence.js API
      const response = await fetch('/api/runprompt_enhence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to run Python script');
      }

      const data = await response.json();
      // 直接使用 data.output，确保编码格式一致
      setInputValue(data.output);
    } catch (error) {
      console.error('Error running Python script:', error);
      alert('Failed to enhance prompt. Please try again.');
    }
  };

  const handleRecalculateGraph = async () => {
    try {
      const response = await fetch('/api/runcalculategraphjson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: searchKeyword }),
      });

      if (!response.ok) {
        throw new Error('Failed to recalculate graph');
      }

      const data = await response.json();
      console.log('Graph recalculated successfully:', data.output)

      // 调用 KnowledgeGraph 的 reRender 函数重新绘制图谱
      if (knowledgeGraphRef.current) {
        knowledgeGraphRef.current.reRender()
      }
    } catch (error) {
      console.error('Error recalculating graph:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/papers">
            <Button variant="link" className="text-white p-0 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Button>
          </Link>
          <h1 className="font-bold" style={{ color: "white", fontSize: "18px" }}>
            芯智领航者-相关论文
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - AI Chat */}
        <div className="w-1/4 border-r flex flex-col">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              {/* Update the input placeholder */}
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入您的研究idea或论文摘要..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 p-2 border rounded resize-y min-h-[40px] max-h-[120px] overflow-y-auto"
                style={{ resize: "vertical" }}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="增强提示词" onClick={handleEnhancePrompt}>
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Middle Panel - Knowledge Graph */}
        <div className="flex-1 overflow-hidden">
          <KnowledgeGraph ref={knowledgeGraphRef} />
        </div>

        {/* Right Panel - Research Results */}
        <div className="w-1/3 border-l overflow-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Results</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">排序方式:</span>
                <select className="text-sm border rounded p-1">
                  <option>发表日期</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {papers.map((paper) => (
                <Card key={paper.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className="mb-2">{paper.id}</Badge>
                    </div>
                    <CardTitle className="text-base font-medium hover:text-primary cursor-pointer">
                      {paper.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-2">{paper.abstract}</p>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <span>{paper.year}</span>
                      <span>•</span>
                      <span>{paper.authors}</span>
                      <span>•</span>
                      <span>{paper.journal}</span>
                    </div>
                    <div className="flex mt-2">
                      <Link href={`/dashboard/papers/${paper.id}/detail`}>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Search className="h-3 w-3 mr-1" />
                          查看详情
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add a button at the center bottom */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
        <Button onClick={handleRecalculateGraph}>
          重新计算图谱
        </Button>
      </div>
    </div>
  )
}
