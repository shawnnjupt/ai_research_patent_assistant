"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, Calendar, BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PapersPage() {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSearch = async () => {
    if (search.trim()) {
      const encodedSearch = encodeURIComponent(search.trim());
      try {
        // 调用 runarxiv_crawler.js 的 API
        const response = await fetch('/api/runarxiv_crawler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: encodedSearch }),
        });

        if (!response.ok) {
          throw new Error('Failed to run arxiv crawler');
        }

        const data = await response.json();
        console.log('Arxiv crawler output:', data.output);

        // 执行页面跳转
        const searchPath = `/dashboard/papers/${encodedSearch}`;
        console.log('Navigating to:', searchPath);
        router.push(searchPath);
      } catch (error) {
        console.error('Error during arxiv crawler execution:', error);
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-black text-white border-b border-gray-800">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
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
                <Button className="gap-2" onClick={() => console.log("筛选查询")}>
                  <Filter className="h-4 w-4" />
                  筛选查询
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* 确保这里没有 AI 对话框和搜索结果的代码 */}
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