import Link from "next/link"
import { Search, Bell, FileText, Network, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/shared/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="芯智领航者" backUrl="/" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/patents/search">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-48 flex flex-col items-center justify-center">
              <CardContent className="pt-6 text-center">
                <div className="bg-blue-100 p-4 rounded-full inline-flex mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">查新检索</h2>
                <p className="text-sm text-gray-500 mt-2">检索专利新颖性和创新性</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/patents/risk-warning">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-48 flex flex-col items-center justify-center">
              <CardContent className="pt-6 text-center">
                <div className="bg-red-100 p-4 rounded-full inline-flex mb-4">
                  <Bell className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold">侵权风险预警</h2>
                <p className="text-sm text-gray-500 mt-2">评估专利侵权风险</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/patents/specification">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-48 flex flex-col items-center justify-center">
              <CardContent className="pt-6 text-center">
                <div className="bg-green-100 p-4 rounded-full inline-flex mb-4">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">专利说明书撰写</h2>
                <p className="text-sm text-gray-500 mt-2">辅助撰写专利说明书</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/patents/layout-map">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-48 flex flex-col items-center justify-center">
              <CardContent className="pt-6 text-center">
                <div className="bg-purple-100 p-4 rounded-full inline-flex mb-4">
                  <Network className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">专利布局图谱</h2>
                <p className="text-sm text-gray-500 mt-2">可视化专利布局分析</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">最近搜索</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSearches.map((search, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{search.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {search.field} · {search.date}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs ${search.type === "查新检索" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
                    >
                      {search.type}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

const recentSearches = [
  {
    title: "基于人工智能的图像识别方法",
    field: "计算机视觉",
    date: "2025-05-22",
    type: "查新检索",
  },
  {
    title: "一种新型电动汽车电池管理系统",
    field: "新能源汽车",
    date: "2025-05-20",
    type: "侵权风险预警",
  },
  {
    title: "智能家居控制系统及方法",
    field: "物联网",
    date: "2025-05-18",
    type: "查新检索",
  },
]
