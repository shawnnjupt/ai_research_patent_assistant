"use client"
import React, { useEffect, useState } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { ChatInterface } from "./components/chat-interface"
import { PaperDetails } from "./components/paper-details"
import { Header } from "@/components/shared/header"

export default function PaperDetailsPage() {
  const [paperId, setPaperId] = useState<string>("") // 初始化 paperId 状态

  useEffect(() => {
    // 在客户端渲染时获取 paperId
    const pathname = window.location.pathname
    const extractedPaperId = pathname.split("/")[3]
    setPaperId(extractedPaperId) // 更新 paperId 状态
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <Header title="芯智领航者-论文详情" backUrl={`/dashboard/papers/${paperId}`} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - AI Chat - Fixed, no scroll */}
        <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col h-full">
          <ChatInterface />
        </div>

        {/* Right Column - Paper Details - Scrollable */}
        <div className="hidden md:block md:w-2/3 overflow-y-auto">
          {paperId && <PaperDetails paperId={paperId} />} {/* 仅在 paperId 存在时渲染 PaperDetails */}
        </div>
      </div>
    </div>
  )
}