"use client"

import type React from "react"

import { useState } from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ChatInterface() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle message submission
    setMessage("")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 p-4 bg-gray-50">
        <Card className="p-4 mb-4 bg-white">
          <p className="text-gray-800">
            您好！我是您的论文创新度分析助手。请输入您的研究idea或论文摘要，我将帮您分析其创新点和在学术领域的创新程度。
          </p>
        </Card>
        {/* More messages would appear here */}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <Input
              placeholder="输入您的研究idea或论文摘要..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" type="button" className="shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>增强提示词</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </div>
    </div>
  )
} 