"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProfilePage() {
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
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">研究员信息</h2>
          {/* 这里添加研究员信息的具体内容 */}
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