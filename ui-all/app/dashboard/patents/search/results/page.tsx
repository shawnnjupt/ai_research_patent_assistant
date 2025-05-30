"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Download, BookmarkPlus, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Header } from "@/components/shared/header"

// 模拟专利数据
const mockPatents = [
  {
    id: "CN123456789A",
    title: "一种基于深度学习的芯片缺陷检测方法",
    authors: ["张三", "李四", "王五"],
    institution: "清华大学",
    date: "2024-03-15",
    abstract:
      "本发明提出了一种基于深度学习的芯片缺陷检测方法，通过卷积神经网络对芯片表面图像进行分析，能够自动识别微小缺陷，检测准确率达到99.2%，大幅提高了芯片生产良率。该方法采用改进的YOLOv5模型，结合注意力机制，对不同类型的缺陷具有较强的识别能力。",
    field: "芯片设计",
    type: "发明专利",
    status: "已授权",
    similarity: 92,
  },
  {
    id: "CN987654321B",
    title: "一种低功耗高性能模拟数字转换器设计方法",
    authors: ["赵六", "钱七"],
    institution: "复旦大学",
    date: "2024-02-28",
    abstract:
      "本发明涉及一种低功耗高性能模拟数字转换器设计方法，采用创新的电路拓扑结构和时钟分配策略，在14nm工艺下实现了16位精度、1GS/s采样率的ADC，功耗仅为10mW，比现有技术降低30%。该设计特别适用于移动设备和物联网应用场景。",
    field: "芯片设计",
    type: "发明专利",
    status: "已授权",
    similarity: 87,
  },
  {
    id: "CN112233445C",
    title: "一种用于芯片制造的新型光刻胶材料及其制备方法",
    authors: ["孙八", "周九", "吴十"],
    institution: "中国科学院微电子研究所",
    date: "2024-01-10",
    abstract:
      "本发明公开了一种用于芯片制造的新型光刻胶材料及其制备方法，该材料在极紫外光刻(EUV)工艺中表现出优异的分辨率和灵敏度，能够支持3nm及以下节点的芯片制造。通过引入特定的化学基团，提高了材料的抗蚀刻性和热稳定性，同时降低了缺陷率。",
    field: "制造与工艺",
    type: "发明专利",
    status: "已授权",
    similarity: 78,
  },
  {
    id: "CN556677889D",
    title: "一种芯片封装用高导热低应力复合材料",
    authors: ["郑十一", "王十二"],
    institution: "华中科技大学",
    date: "2023-12-05",
    abstract:
      "本发明提供了一种芯片封装用高导热低应力复合材料，通过纳米颗粒改性和特殊的界面处理工艺，实现了导热系数>20W/(m·K)和热膨胀系数<10ppm/℃的优异性能组合。该材料可有效解决高性能芯片散热问题，延长芯片使用寿命，特别适用于高功率密度场景。",
    field: "制造与工艺",
    type: "发明专利",
    status: "已授权",
    similarity: 65,
  },
  {
    id: "CN998877665E",
    title: "一种面向异构计算的芯片互连架构",
    authors: ["刘十三", "陈十四", "杨十五"],
    institution: "中国科学院计算技术研究所",
    date: "2023-11-20",
    abstract:
      "本发明提出了一种面向异构计算的芯片互连架构，采用创新的网络拓扑和路由算法，支持CPU、GPU、NPU等异构计算单元的高效通信。相比传统总线架构，该方案提高了带宽利用率40%，降低了通信延迟35%，特别适合AI加速和高性能计算应用场景。",
    field: "芯片设计",
    type: "发明专利",
    status: "实质审查",
    similarity: 58,
  },
  {
    id: "CN332211009F",
    title: "一种基于机器学习的芯片功耗优化方法",
    authors: ["张十六", "李十七"],
    institution: "北京大学",
    date: "2023-10-15",
    abstract:
      "本发明公开了一种基于机器学习的芯片功耗优化方法，通过建立芯片功耗模型并结合强化学习算法，实现了对芯片动态功耗的智能管理。该方法可根据工作负载特性自动调整电压和频率，在保证性能的前提下平均降低功耗25%，延长电池使用时间。",
    field: "芯片设计",
    type: "发明专利",
    status: "实质审查",
    similarity: 52,
  },
  {
    id: "CN665544332G",
    title: "一种用于芯片测试的自适应故障诊断系统",
    authors: ["赵十八", "钱十九", "孙二十"],
    institution: "上海交通大学",
    date: "2023-09-08",
    abstract:
      "本发明提出了一种用于芯片测试的自适应故障诊断系统，结合贝叶斯网络和专家系统，能够根据测试结果自动推断芯片内部故障位置和类型。该系统将故障定位时间缩短60%，定位准确率提高到95%以上，显著提高了芯片测试效率和良率。",
    field: "测试与可靠性",
    type: "发明专利",
    status: "实质审查",
    similarity: 45,
  },
  {
    id: "CN112233445H",
    title: "一种三维堆叠芯片的散热结构及其制造方法",
    authors: ["周二十一", "吴二十二"],
    institution: "浙江大学",
    date: "2023-08-12",
    abstract:
      "本发明涉及一种三维堆叠芯片的散热结构及其制造方法，通过在芯片层间引入微流道结构和相变材料，实现了高效的热量传递和分散。测试表明，该结构可将芯片热点温度降低20℃以上，有效解决了3D芯片堆叠中的热管理难题，为高性能计算提供了可靠保障。",
    field: "上游支撑技术",
    type: "发明专利",
    status: "实质审查",
    similarity: 38,
  },
]

export default function SearchResultsPage() {
  const searchParams = useSearchParams()

  // 获取搜索参数
  const query = searchParams.get("query") || ""
  const field = searchParams.get("field") || ""
  const institution = searchParams.get("institution") || ""
  const inventor = searchParams.get("inventor") || ""
  const timeRange = searchParams.get("timeRange") || ""
  const description = searchParams.get("description") || ""

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="芯智领航者 - 查新检索结果" backUrl="/dashboard/patents/search" />

      <main className="container mx-auto px-4 py-8">
        {/* 搜索条件摘要 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-bold mb-4">搜索条件</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {query && (
                <div>
                  <span className="font-medium">关键词：</span>
                  <span className="text-gray-700">{query}</span>
                </div>
              )}
              {field && (
                <div>
                  <span className="font-medium">技术领域：</span>
                  <span className="text-gray-700">{field}</span>
                </div>
              )}
              {institution && (
                <div>
                  <span className="font-medium">归属单位：</span>
                  <span className="text-gray-700">{institution}</span>
                </div>
              )}
              {inventor && (
                <div>
                  <span className="font-medium">发明人：</span>
                  <span className="text-gray-700">{inventor}</span>
                </div>
              )}
              {timeRange && (
                <div>
                  <span className="font-medium">时间范围：</span>
                  <span className="text-gray-700">{timeRange}</span>
                </div>
              )}
              {description && (
                <div className="md:col-span-2 lg:col-span-3">
                  <span className="font-medium">专利描述：</span>
                  <span className="text-gray-700">{description}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">搜索结果 (共找到 {mockPatents.length} 条)</h2>
            <div className="flex gap-2">
              <Select defaultValue="similarity">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="similarity">相似度</SelectItem>
                  <SelectItem value="date-desc">时间降序</SelectItem>
                  <SelectItem value="date-asc">时间升序</SelectItem>
                  <SelectItem value="citations">引用次数</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {mockPatents.map((patent) => (
              <Card key={patent.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-blue-700 hover:underline">
                            <Link href={`/dashboard/patents/patent/${patent.id}`}>{patent.title}</Link>
                          </h3>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                              <BarChart className="h-3 w-3" />
                              相似度: {patent.similarity}%
                            </div>
                            <Progress
                              value={patent.similarity}
                              className="h-2 w-24 ml-2"
                              indicatorClassName={
                                patent.similarity > 80
                                  ? "bg-red-500"
                                  : patent.similarity > 60
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="ghost" size="icon" title="收藏">
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="下载">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <span>专利号: {patent.id}</span>
                        <span>•</span>
                        <span>申请日期: {patent.date}</span>
                        <span>•</span>
                        <span>
                          <Badge variant={patent.status === "已授权" ? "success" : "secondary"}>{patent.status}</Badge>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="font-medium">发明人:</span>
                        {patent.authors.map((author, index) => (
                          <span key={index} className="text-gray-700">
                            {author}
                            {index < patent.authors.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">归属单位:</span>
                        <span className="text-gray-700 ml-1">{patent.institution}</span>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-gray-700 line-clamp-3">{patent.abstract}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="bg-blue-50">
                          {patent.field}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50">
                          {patent.type}
                        </Badge>
                        <Link
                          href={`/patent/${patent.id}`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1 ml-auto"
                        >
                          查看原文 <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  )
}
