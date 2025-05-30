"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/shared/header"

// 模拟专利数据
const patentData = {
  2010: { applications: 126, grants: 20 },
  2011: { applications: 195, grants: 212 },
  2012: { applications: 270, grants: 257 },
  2013: { applications: 394, grants: 370 },
  2014: { applications: 474, grants: 440 },
  2015: { applications: 698, grants: 649 },
  2016: { applications: 1113, grants: 929 },
  2017: { applications: 1735, grants: 1141 },
  2018: { applications: 2743, grants: 1444 },
  2019: { applications: 3267, grants: 1387 },
  2020: { applications: 3326, grants: 2996 },
  2021: { applications: 625, grants: 1042 },
  2022: { applications: 2856, grants: 2234 },
  2023: { applications: 3124, grants: 2567 },
  2024: { applications: 3456, grants: 2890 },
  2025: { applications: 2890, grants: 2345 },
}

// 模拟企业专利数据
const companyPatentData = [
  {
    name: "台积电",
    invention: 3043,
    utility: 371,
    design: 0,
    total: 3414,
  },
  {
    name: "北京华峰测控技术股份有限公司上海技术开发公司",
    invention: 1986,
    utility: 1371,
    design: 0,
    total: 3357,
  },
  {
    name: "英特尔公司",
    invention: 3000,
    utility: 309,
    design: 0,
    total: 3309,
  },
  {
    name: "中国科学院微电子研究所",
    invention: 1829,
    utility: 417,
    design: 0,
    total: 2246,
  },
  {
    name: "三星半导体株式会社",
    invention: 1890,
    utility: 355,
    design: 0,
    total: 2245,
  },
  {
    name: "西安紫光国芯半导体有限公司",
    invention: 897,
    utility: 1325,
    design: 0,
    total: 2222,
  },
  {
    name: "三菱电机株式会社",
    invention: 1897,
    utility: 318,
    design: 0,
    total: 2215,
  },
  {
    name: "中国科学院半导体研究所技术开发公司",
    invention: 1680,
    utility: 534,
    design: 0,
    total: 2214,
  },
  {
    name: "中芯国际集成电路制造有限公司上海分公司",
    invention: 1113,
    utility: 1098,
    design: 0,
    total: 2211,
  },
  {
    name: "科大国盾量子技术股份有限公司技术开发分公司",
    invention: 568,
    utility: 1000,
    design: 0,
    total: 1568,
  },
]

export default function LayoutMapPage() {
  const [selectedRegion, setSelectedRegion] = useState("global")
  const [startYear, setStartYear] = useState("2020")
  const [startMonth, setStartMonth] = useState("1")
  const [endYear, setEndYear] = useState("2025")
  const [endMonth, setEndMonth] = useState("12")

  // 生成年份选项
  const years = Array.from({ length: 16 }, (_, i) => 2010 + i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  // 根据选择的时间范围过滤数据
  const getFilteredData = () => {
    const startDate = new Date(Number.parseInt(startYear), Number.parseInt(startMonth) - 1)
    const endDate = new Date(Number.parseInt(endYear), Number.parseInt(endMonth) - 1)

    return Object.entries(patentData).filter(([year]) => {
      const yearNum = Number.parseInt(year)
      return yearNum >= Number.parseInt(startYear) && yearNum <= Number.parseInt(endYear)
    })
  }

  const filteredData = getFilteredData()
  const maxValue = Math.max(...filteredData.map(([_, data]) => Math.max(data.applications, data.grants)))
  const chartMaxHeight = Math.ceil(maxValue / 1000) * 1000

  // 获取最大专利数量用于计算条形图宽度
  const maxPatentCount = Math.max(...companyPatentData.map((company) => company.total))
  const chartMaxWidth = Math.ceil(maxPatentCount / 1000) * 1000

  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="芯智领航者 - 专利布局图谱" backUrl="/dashboard/patents" />

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold">集成电路领域专利布局</h2>

              <div className="flex items-center gap-2 flex-wrap">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="区域选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">全球</SelectItem>
                    <SelectItem value="china">中国</SelectItem>
                    <SelectItem value="us">美国</SelectItem>
                    <SelectItem value="eu">欧洲</SelectItem>
                    <SelectItem value="japan">日本</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1 text-sm">
                  <span>起始时间:</span>
                  <Select value={startYear} onValueChange={setStartYear}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}年
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={startMonth} onValueChange={setStartMonth}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month}月
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <span>终止时间:</span>
                  <Select value={endYear} onValueChange={setEndYear}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}年
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={endMonth} onValueChange={setEndMonth}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month}月
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="technology">
              <TabsList className="mb-6">
                <TabsTrigger value="technology">技术分布</TabsTrigger>
                <TabsTrigger value="company">企业分布</TabsTrigger>
                <TabsTrigger value="trend">发展趋势</TabsTrigger>
              </TabsList>

              <TabsContent value="technology">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                  {/* 左栏 - 技术构成图 */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium mb-4 text-center">集成电路技术构成分布</h3>
                      <div className="h-[400px] relative">
                        {/* 模拟树状图结构 */}
                        <div className="grid grid-cols-12 grid-rows-8 gap-1 h-full">
                          {/* 芯片设计 - 最大块 */}
                          <div className="col-span-6 row-span-4 bg-blue-500 rounded p-2 flex flex-col justify-center items-center text-white text-sm">
                            <div className="font-bold">芯片设计</div>
                            <div className="text-xs mt-1">专利数量: 12,458</div>
                            <div className="text-xs">占比: 35.2%</div>
                          </div>

                          {/* 制造工艺 */}
                          <div className="col-span-4 row-span-3 bg-blue-600 rounded p-2 flex flex-col justify-center items-center text-white text-sm">
                            <div className="font-bold">制造工艺</div>
                            <div className="text-xs mt-1">专利数量: 8,932</div>
                            <div className="text-xs">占比: 25.3%</div>
                          </div>

                          {/* 封装测试 */}
                          <div className="col-span-3 row-span-3 bg-cyan-500 rounded p-2 flex flex-col justify-center items-center text-white text-sm">
                            <div className="font-bold">封装测试</div>
                            <div className="text-xs mt-1">专利数量: 7,645</div>
                            <div className="text-xs">占比: 21.6%</div>
                          </div>

                          {/* EDA工具 */}
                          <div className="col-span-3 row-span-2 bg-blue-400 rounded p-2 flex flex-col justify-center items-center text-white text-xs">
                            <div className="font-bold">EDA工具</div>
                            <div className="text-xs mt-1">3,245</div>
                            <div className="text-xs">9.2%</div>
                          </div>

                          {/* 材料技术 */}
                          <div className="col-span-3 row-span-2 bg-teal-500 rounded p-2 flex flex-col justify-center items-center text-white text-xs">
                            <div className="font-bold">材料技术</div>
                            <div className="text-xs mt-1">2,987</div>
                            <div className="text-xs">8.4%</div>
                          </div>

                          {/* 其他小分类 */}
                          <div className="col-span-2 row-span-1 bg-slate-500 rounded p-1 flex flex-col justify-center items-center text-white text-xs">
                            <div className="font-bold text-xs">光刻技术</div>
                            <div className="text-xs">1,234</div>
                          </div>

                          <div className="col-span-2 row-span-1 bg-slate-600 rounded p-1 flex flex-col justify-center items-center text-white text-xs">
                            <div className="font-bold text-xs">刻蚀技术</div>
                            <div className="text-xs">987</div>
                          </div>

                          <div className="col-span-2 row-span-1 bg-gray-500 rounded p-1 flex flex-col justify-center items-center text-white text-xs">
                            <div className="font-bold text-xs">薄膜技术</div>
                            <div className="text-xs">756</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 右栏 - 行业热门词图谱 */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium mb-4 text-center">集成电路热门技术词汇</h3>
                      <div className="h-[400px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 relative overflow-hidden">
                        {/* 模拟词云效果 - 冷色调 */}
                        <div className="absolute inset-0 p-4">
                          {/* 大字体核心词汇 */}
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-blue-700">
                            集成电路
                          </div>
                          <div className="absolute top-16 left-1/4 text-2xl font-bold text-cyan-600">芯片设计</div>
                          <div className="absolute top-20 right-1/4 text-2xl font-bold text-blue-600">制造工艺</div>

                          {/* 中等字体词汇 */}
                          <div className="absolute top-32 left-8 text-xl font-semibold text-slate-600">晶圆制造</div>
                          <div className="absolute top-36 right-8 text-xl font-semibold text-blue-500">封装测试</div>
                          <div className="absolute top-48 left-1/3 text-xl font-semibold text-cyan-700">光刻技术</div>
                          <div className="absolute top-52 right-1/3 text-xl font-semibold text-teal-600">刻蚀工艺</div>

                          {/* 小字体词汇 */}
                          <div className="absolute top-64 left-4 text-lg text-blue-400">EDA工具</div>
                          <div className="absolute top-68 left-20 text-lg text-slate-500">版图设计</div>
                          <div className="absolute top-72 left-36 text-lg text-cyan-500">逻辑综合</div>
                          <div className="absolute top-76 right-4 text-lg text-blue-400">物理设计</div>
                          <div className="absolute top-80 right-20 text-lg text-teal-500">时序分析</div>
                          <div className="absolute top-84 right-36 text-lg text-slate-400">功耗优化</div>

                          {/* 更小的词汇 */}
                          <div className="absolute bottom-20 left-8 text-base text-blue-300">硅片加工</div>
                          <div className="absolute bottom-16 left-24 text-base text-cyan-400">掺杂工艺</div>
                          <div className="absolute bottom-12 left-40 text-base text-slate-400">薄膜沉积</div>
                          <div className="absolute bottom-8 right-8 text-base text-blue-300">化学机械抛光</div>
                          <div className="absolute bottom-4 right-32 text-base text-teal-400">离子注入</div>

                          {/* 最小的词汇 */}
                          <div className="absolute top-28 left-2 text-sm text-gray-400">CMOS</div>
                          <div className="absolute top-40 left-48 text-sm text-blue-300">FinFET</div>
                          <div className="absolute top-56 right-2 text-sm text-cyan-300">SOI</div>
                          <div className="absolute bottom-32 left-16 text-sm text-slate-300">MEMS</div>
                          <div className="absolute bottom-24 right-16 text-sm text-teal-300">SiP</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">芯片设计</h3>
                      <div className="text-3xl font-bold mb-1">12,458</div>
                      <div className="text-sm text-green-600">▲ 24.5%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">制造工艺</h3>
                      <div className="text-3xl font-bold mb-1">8,932</div>
                      <div className="text-sm text-green-600">▲ 18.7%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">封装测试</h3>
                      <div className="text-3xl font-bold mb-1">7,645</div>
                      <div className="text-sm text-green-600">▲ 32.1%</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="company">
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2 text-center">
                      {startYear}年{startMonth}月-{endYear}年{endMonth}月集成电路领域企业专利申请分布
                    </h3>
                    <p className="text-sm text-gray-600 text-center mb-6">
                      企业选择方式：按专利申请总量排序，显示前十名企业
                    </p>

                    {/* 水平条形图容器 */}
                    <div className="h-[600px] relative bg-white rounded-lg p-4">
                      {/* X轴标签 */}
                      <div className="absolute bottom-8 left-16 right-4 flex justify-between text-xs text-gray-600">
                        {Array.from({ length: 6 }, (_, i) => (
                          <div key={i} className="text-center">
                            {Math.round((chartMaxWidth * i) / 5)}
                          </div>
                        ))}
                      </div>

                      {/* 图表区域 */}
                      <div className="ml-4 mr-4 mb-16 h-full relative">
                        {/* 网格线 */}
                        <div className="absolute inset-0 flex justify-between">
                          {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="border-l border-gray-200 h-full"></div>
                          ))}
                        </div>

                        {/* 条形图 */}
                        <div className="absolute top-4 bottom-0 left-0 right-0 flex flex-col justify-around">
                          {companyPatentData.map((company, index) => {
                            const inventionWidth = (company.invention / chartMaxWidth) * 100
                            const utilityWidth = (company.utility / chartMaxWidth) * 100

                            return (
                              <div key={index} className="flex items-center h-12">
                                {/* 企业名称 */}
                                <div className="w-80 text-xs text-gray-700 pr-4 text-right">{company.name}</div>

                                {/* 条形图容器 */}
                                <div className="flex-1 flex items-center relative">
                                  {/* 发明专利条 */}
                                  <div
                                    className="bg-blue-600 h-6 flex items-center justify-start pl-2"
                                    style={{ width: `${inventionWidth}%` }}
                                  >
                                    {company.invention > 0 && (
                                      <span className="text-xs text-white font-medium">{company.invention}</span>
                                    )}
                                  </div>

                                  {/* 实用新型条 */}
                                  <div
                                    className="bg-cyan-400 h-6 flex items-center justify-start pl-2"
                                    style={{ width: `${utilityWidth}%` }}
                                  >
                                    {company.utility > 0 && (
                                      <span className="text-xs text-gray-700 font-medium">{company.utility}</span>
                                    )}
                                  </div>

                                  {/* 总数标签 */}
                                  <div className="absolute right-0 transform translate-x-full pl-2">
                                    <span className="text-xs text-gray-700 font-medium">{company.total}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* X轴标题 */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
                        专利申请数量（件）
                      </div>

                      {/* 图例 */}
                      <div className="absolute top-4 right-4 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <span>发明</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                          <span>实用新型</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <span>外观设计</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">台积电</h3>
                      <div className="text-3xl font-bold mb-1">3,414</div>
                      <div className="text-sm text-green-600">▲ 15.3%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">华峰测控</h3>
                      <div className="text-3xl font-bold mb-1">3,357</div>
                      <div className="text-sm text-green-600">▲ 12.8%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">英特尔</h3>
                      <div className="text-3xl font-bold mb-1">3,309</div>
                      <div className="text-sm text-green-600">▲ 8.5%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">中科院微电子所</h3>
                      <div className="text-3xl font-bold mb-1">2,246</div>
                      <div className="text-sm text-green-600">▲ 22.4%</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trend">
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4 text-center">
                      {startYear}年{startMonth}月-{endYear}年{endMonth}月集成电路领域专利申请量及授权量情况
                    </h3>

                    {/* 柱状图容器 */}
                    <div className="h-[500px] relative bg-white rounded-lg p-4">
                      {/* Y轴标签 */}
                      <div className="absolute left-0 top-4 bottom-16 flex flex-col justify-between text-xs text-gray-600">
                        {Array.from({ length: 6 }, (_, i) => (
                          <div key={i} className="text-right pr-2">
                            {Math.round((chartMaxHeight * (5 - i)) / 5)}
                          </div>
                        ))}
                        <div className="text-right pr-2">0</div>
                      </div>

                      {/* 图表区域 */}
                      <div className="ml-12 mr-4 h-full relative">
                        {/* 网格线 */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                          {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="border-t border-gray-200"></div>
                          ))}
                        </div>

                        {/* 柱状图 */}
                        <div className="absolute bottom-12 left-0 right-0 h-[400px] flex items-end justify-around">
                          {filteredData.map(([year, data]) => {
                            const appHeight = (data.applications / chartMaxHeight) * 400
                            const grantHeight = (data.grants / chartMaxHeight) * 400

                            return (
                              <div key={year} className="flex flex-col items-center">
                                {/* 柱子容器 */}
                                <div className="flex items-end gap-1 mb-2">
                                  {/* 申请量柱子 */}
                                  <div className="relative">
                                    <div
                                      className="bg-blue-500 rounded-t w-8 flex items-start justify-center pt-1"
                                      style={{ height: `${appHeight}px` }}
                                    >
                                      <span className="text-xs text-white font-medium transform -rotate-0">
                                        {data.applications}
                                      </span>
                                    </div>
                                  </div>

                                  {/* 授权量柱子 */}
                                  <div className="relative">
                                    <div
                                      className="bg-blue-300 rounded-t w-8 flex items-start justify-center pt-1"
                                      style={{ height: `${grantHeight}px` }}
                                    >
                                      <span className="text-xs text-gray-700 font-medium">{data.grants}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* 年份标签 */}
                                <div className="text-xs text-gray-600 font-medium">{year}</div>
                              </div>
                            )
                          })}
                        </div>

                        {/* X轴 */}
                        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-300"></div>
                      </div>

                      {/* 图例 */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span>申请（项）</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-300 rounded"></div>
                          <span>授权（项）</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">专利申请趋势</h3>
                      <div className="text-2xl font-bold mb-1">
                        {filteredData.reduce((sum, [_, data]) => sum + data.applications, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">总申请量</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">专利授权趋势</h3>
                      <div className="text-2xl font-bold mb-1">
                        {filteredData.reduce((sum, [_, data]) => sum + data.grants, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">总授权量</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>导出图谱</span>
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>分享图谱</span>
          </Button>

          <Button>生成分析报告</Button>
        </div>

        {/* 跳转到结果页面 */}
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            const searchParams = new URLSearchParams()
            searchParams.append("region", selectedRegion)
            searchParams.append("startYear", startYear)
            searchParams.append("startMonth", startMonth)
            searchParams.append("endYear", endYear)
            searchParams.append("endMonth", endMonth)
            router.push(`/dashboard/patents/layout-map/results?${searchParams.toString()}`)
          }}
        >
          <Download className="h-4 w-4" />
          <span>导出图谱</span>
        </Button>
      </main>
    </div>
  )
}
