"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  Download,
  BookmarkPlus,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  DollarSign,
  Shield,
  LineChart,
  PieChart,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/shared/header"
import {
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// 模拟风险专利数据
const riskPatents = [
  {
    id: "US20230123456",
    title: "用于芯片缺陷检测的深度学习系统及方法",
    company: "英特尔公司",
    date: "2023-06-15",
    abstract:
      "本发明提供了一种用于芯片缺陷检测的深度学习系统及方法，通过多层卷积神经网络对芯片表面图像进行分析，能够自动识别微小缺陷，检测准确率达到99.5%。该方法采用改进的YOLOv5模型，结合注意力机制，对不同类型的缺陷具有较强的识别能力。",
    riskLevel: "高",
    riskScore: 85,
    filingTrend: "上升",
    marketValue: 1250000,
    valueRatio: 0.08,
    valueChange: 12.5,
    technicalOverlap: 78,
    claimScope: "广泛",
    enforcementHistory: "活跃",
    litigationRisk: "高",
  },
  {
    id: "EP3987654321",
    title: "半导体器件缺陷检测装置及方法",
    company: "三星电子",
    date: "2023-04-22",
    abstract:
      "本发明涉及一种半导体器件缺陷检测装置及方法，通过结合光学成像和机器学习算法，实现了对纳米级缺陷的高精度检测。该方法特别适用于7nm及以下工艺节点的芯片制造过程，可显著提高良率和产品质量。",
    riskLevel: "中高",
    riskScore: 72,
    filingTrend: "稳定",
    marketValue: 980000,
    valueRatio: 0.05,
    valueChange: 8.3,
    technicalOverlap: 65,
    claimScope: "中等",
    enforcementHistory: "适中",
    litigationRisk: "中",
  },
  {
    id: "CN112233445566",
    title: "一种基于计算机视觉的芯片表面缺陷自动检测方法",
    company: "华为技术有限公司",
    date: "2023-02-10",
    abstract:
      "本发明公开了一种基于计算机视觉的芯片表面缺陷自动检测方法，采用多尺度特征融合网络对芯片图像进行分析，能够同时检测多种类型的表面缺陷，包括划痕、污点、缺失等。该方法在实际生产环境中测试，检出率达到98.7%，误报率低于0.5%。",
    riskLevel: "中",
    riskScore: 58,
    filingTrend: "上升",
    marketValue: 850000,
    valueRatio: 0.04,
    valueChange: 15.2,
    technicalOverlap: 52,
    claimScope: "中等",
    enforcementHistory: "较少",
    litigationRisk: "中低",
  },
  {
    id: "JP2023987654",
    title: "半导体检查装置及检查方法",
    company: "东京电子株式会社",
    date: "2022-11-30",
    abstract:
      "本发明提供了一种半导体检查装置及检查方法，通过组合使用多种光源和传感器，结合专有的图像处理算法，能够在高速生产线上实时检测芯片缺陷。该方法特别适用于高密度封装的芯片检测，可识别传统方法难以发现的隐藏缺陷。",
    riskLevel: "中低",
    riskScore: 45,
    filingTrend: "稳定",
    marketValue: 620000,
    valueRatio: 0.03,
    valueChange: 5.8,
    technicalOverlap: 38,
    claimScope: "较窄",
    enforcementHistory: "较少",
    litigationRisk: "低",
  },
  {
    id: "US20220987654",
    title: "用于集成电路测试的机器学习系统",
    company: "应用材料公司",
    date: "2022-09-18",
    abstract:
      "本发明涉及一种用于集成电路测试的机器学习系统，通过分析测试数据的模式和趋势，预测可能的芯片故障和缺陷。该系统采用无监督学习算法，能够自动适应不同的芯片设计和制造工艺，显著提高了测试效率和准确性。",
    riskLevel: "低",
    riskScore: 32,
    filingTrend: "下降",
    marketValue: 450000,
    valueRatio: 0.02,
    valueChange: -3.5,
    technicalOverlap: 25,
    claimScope: "窄",
    enforcementHistory: "无",
    litigationRisk: "极低",
  },
]

// 技术演进路径数据
const techEvolutionData = [
  {
    year: 2018,
    technologies: ["传统光学检测", "基础图像处理算法", "人工辅助判断"],
  },
  {
    year: 2019,
    technologies: ["高分辨率成像系统", "传统机器学习分类", "半自动缺陷识别"],
  },
  {
    year: 2020,
    technologies: ["多传感器融合", "卷积神经网络应用", "自动缺陷分类"],
  },
  {
    year: 2021,
    technologies: ["深度学习模型优化", "注意力机制引入", "实时检测系统"],
  },
  {
    year: 2022,
    technologies: ["自监督学习", "小样本学习", "多模态数据融合"],
  },
  {
    year: 2023,
    technologies: ["生成对抗网络应用", "知识蒸馏技术", "边缘计算部署"],
  },
  {
    year: 2024,
    technologies: ["联邦学习协作", "自适应神经架构", "量子计算辅助检测"],
  },
]

export default function RiskWarningResultsPage() {
  const searchParams = useSearchParams()

  // 获取搜索参数
  const query = searchParams.get("query") || ""
  const field = searchParams.get("field") || ""
  const institution = searchParams.get("institution") || ""
  const inventor = searchParams.get("inventor") || ""
  const timeRange = searchParams.get("timeRange") || ""
  const description = searchParams.get("description") || ""

  // 风险等级对应的颜色
  const getRiskColor = (level: string) => {
    switch (level) {
      case "高":
        return "bg-red-500"
      case "中高":
        return "bg-orange-500"
      case "中":
        return "bg-yellow-500"
      case "中低":
        return "bg-blue-500"
      case "低":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // 趋势对应的图标和颜色
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "上升":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "稳定":
        return <BarChart3 className="h-4 w-4 text-yellow-500" />
      case "下降":
        return <TrendingUp className="h-4 w-4 text-green-500 transform rotate-180" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="芯智领航者 - 侵权风险预警结果" backUrl="/dashboard/patents/risk-warning" />

      <main className="container mx-auto px-4 py-8">
        {/* 搜索条件摘要 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-bold mb-4">风险评估条件</h2>
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

        <div className="space-y-8">
          {/* 风险评估总览 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                风险评估总览
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">综合风险指数</div>
                    <div className="text-5xl font-bold text-red-600">7.8</div>
                    <div className="flex items-center justify-center mt-2 text-red-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">较上季度上升 15.2%</span>
                    </div>
                  </div>
                  <Progress value={78} className="h-2" indicatorClassName="bg-red-600" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>低风险</span>
                    <span>中风险</span>
                    <span>高风险</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">风险分布</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>高风险专利</span>
                          <span>1</span>
                        </div>
                        <Progress value={20} className="h-1.5 mt-1" indicatorClassName="bg-red-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>中高风险专利</span>
                          <span>1</span>
                        </div>
                        <Progress value={20} className="h-1.5 mt-1" indicatorClassName="bg-orange-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>中风险专利</span>
                          <span>1</span>
                        </div>
                        <Progress value={20} className="h-1.5 mt-1" indicatorClassName="bg-yellow-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>中低风险专利</span>
                          <span>1</span>
                        </div>
                        <Progress value={20} className="h-1.5 mt-1" indicatorClassName="bg-blue-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>低风险专利</span>
                          <span>1</span>
                        </div>
                        <Progress value={20} className="h-1.5 mt-1" indicatorClassName="bg-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 技术演进路径 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-600" />
                技术演进路径
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-8">
                  {techEvolutionData.map((item, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="min-w-[80px] font-medium">{item.year}</div>
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2">
                            {item.technologies.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="outline"
                                className={`${
                                  item.year === 2023 || item.year === 2024
                                    ? "bg-red-50 border-red-200 text-red-700"
                                    : "bg-blue-50 border-blue-200 text-blue-700"
                                }`}
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          {item.year === 2023 && (
                            <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              <span>检测到与您的专利技术存在潜在冲突</span>
                            </div>
                          )}
                        </div>
                        {item.year === 2023 && (
                          <div className="md:text-right">
                            <div className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-sm">
                              <Zap className="h-3 w-3 mr-1" />
                              高风险区域
                            </div>
                          </div>
                        )}
                        {item.year === 2024 && (
                          <div className="md:text-right">
                            <div className="inline-flex items-center px-2 py-1 rounded bg-orange-100 text-orange-700 text-sm">
                              <Zap className="h-3 w-3 mr-1" />
                              预测风险区域
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 潜在侵权风险专利 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">潜在侵权风险专利</h2>
              <div className="flex gap-2">
                <Select defaultValue="risk">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risk">风险等级</SelectItem>
                    <SelectItem value="date-desc">时间降序</SelectItem>
                    <SelectItem value="date-asc">时间升序</SelectItem>
                    <SelectItem value="value">专利价值</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="list" className="mb-4">
              <TabsList>
                <TabsTrigger value="list">列表视图</TabsTrigger>
                <TabsTrigger value="matrix">风险矩阵</TabsTrigger>
                <TabsTrigger value="map">地域分布</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="space-y-4 mt-4">
                {riskPatents.map((patent) => (
                  <Card key={patent.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-blue-700 hover:underline">
                                <Link href={`/patent/${patent.id}`}>{patent.title}</Link>
                              </h3>
                              <div className="flex items-center mt-1 gap-2">
                                <div
                                  className={`flex items-center gap-1 ${
                                    patent.riskLevel === "高"
                                      ? "bg-red-100 text-red-800"
                                      : patent.riskLevel === "中高"
                                        ? "bg-orange-100 text-orange-800"
                                        : patent.riskLevel === "中"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : patent.riskLevel === "中低"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-green-100 text-green-800"
                                  } px-2 py-1 rounded-md text-xs font-medium`}
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  风险等级: {patent.riskLevel}
                                </div>
                                <Progress
                                  value={patent.riskScore}
                                  className="h-2 w-24"
                                  indicatorClassName={getRiskColor(patent.riskLevel)}
                                />
                                <div className="flex items-center gap-1 text-xs">
                                  <span>申请趋势:</span>
                                  {getTrendIcon(patent.filingTrend)}
                                  <span>{patent.filingTrend}</span>
                                </div>
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
                            <span>申请人: {patent.company}</span>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm text-gray-700 line-clamp-2">{patent.abstract}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                            <div>
                              <div className="text-xs text-gray-500">专利估值</div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-medium">¥ {patent.marketValue.toLocaleString()}</span>
                                <span className="text-xs text-green-600">+{patent.valueChange}%</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">技术重叠度</div>
                              <div className="flex items-center gap-1">
                                <PieChart className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{patent.technicalOverlap}%</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">诉讼风险</div>
                              <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4 text-red-600" />
                                <span className="font-medium">{patent.litigationRisk}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <Link
                              href={`/patent/${patent.id}`}
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1 ml-auto"
                            >
                              查看详情 <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="matrix" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-medium mb-2">风险矩阵视图</div>
                        <div className="text-sm text-gray-500">显示专利风险与影响的二维矩阵</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="map" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-medium mb-2">地域分布视图</div>
                        <div className="text-sm text-gray-500">显示专利风险在不同地域的分布情况</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
