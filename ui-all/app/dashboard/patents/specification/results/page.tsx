"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, CheckCircle2, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Header } from "@/components/shared/header"

export default function SpecificationResultsPage() {
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")

  // 获取搜索参数
  const title = searchParams.get("title") || "一种基于深度学习的图像识别方法"
  const field = searchParams.get("field") || "人工智能"
  const background = searchParams.get("background") || ""
  const content = searchParams.get("content") || ""
  const description = searchParams.get("description") || ""

  // 生成专利说明书
  const generatePatentSpecification = (): string => {
    const defaultBackground =
      background ||
      "随着计算机视觉技术的发展，图像识别已经广泛应用于各个领域。传统的图像识别方法主要依赖于手工设计的特征提取算法，如SIFT、HOG等，这些方法在复杂场景下识别准确率较低，且泛化能力有限。近年来，深度学习技术的兴起为图像识别带来了新的解决方案，但现有的深度学习模型仍存在计算复杂度高、训练数据需求大等问题。"

    const defaultContent =
      content ||
      "本发明的目的是提供一种基于深度学习的图像识别方法，旨在解决现有技术中存在的计算复杂度高、训练数据需求大的问题。本发明采用改进的卷积神经网络结构，引入注意力机制和知识蒸馏技术，显著降低了模型的计算复杂度，同时提高了模型在小样本数据集上的训练效果。"

    return `# ${title}
申请号：CN${new Date().getFullYear()}XXXXXXXX.X

## 技术领域
本发明涉及${field}技术领域，特别是涉及${title}。

## 背景技术
${defaultBackground}

## 发明内容
${defaultContent}

## 附图说明
图1为本发明方法的流程示意图；
图2为本发明所述深度学习模型的结构示意图；
图3为本发明实施例中的实验结果对比图。

## 具体实施方式
下面结合附图和实施例对本发明作进一步的详细说明。

### 实施例1
在一个实施例中，如图1所示，本发明提供的图像识别方法包括以下步骤：
1. 图像预处理：对输入图像进行归一化、裁剪和数据增强；
2. 特征提取：使用改进的卷积神经网络提取图像特征；
3. 特征融合：结合注意力机制对多层特征进行加权融合；
4. 分类识别：基于融合特征进行目标分类和识别。

### 实施例2
在另一个实施例中，如图2所示，本发明所述的改进卷积神经网络包括：
1. 轻量化卷积模块，采用深度可分离卷积替代标准卷积，减少计算量；
2. 通道注意力机制，自适应调整各通道特征的权重；
3. 空间注意力机制，关注图像中的关键区域；
4. 知识蒸馏模块，从预训练大模型中提取知识指导小模型训练。

## 权利要求
1. 一种基于深度学习的图像识别方法，其特征在于，包括以下步骤：
   a) 对输入图像进行预处理；
   b) 使用改进的卷积神经网络提取图像特征；
   c) 结合注意力机制对多层特征进行加权融合；
   d) 基于融合特征进行目标分类和识别。

2. 根据权利要求1所述的方法，其特征在于，所述改进的卷积神经网络包括轻量化卷积模块、通道注意力机制、空间注意力机制和知识蒸馏模块。

3. 根据权利要求1所述的方法，其特征在于，所述预处理步骤包括图像归一化、裁剪和数据增强。

4. 根据权利要求2所述的方法，其特征在于，所述轻量化卷积模块采用深度可分离卷积替代标准卷积，以减少计算量。

5. 根据权利要求2所述的方法，其特征在于，所述注意力机制包括通道注意力机制和空间注意力机制，用于自适应调整特征权重。`
  }

  const [generatedSpec, setGeneratedSpec] = useState(generatePatentSpecification())

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSpec).then(() => {
      setCopied(true)
      toast({
        title: "复制成功",
        description: "专利说明书内容已复制到剪贴板",
      })
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const downloadSpec = () => {
    const blob = new Blob([generatedSpec], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "下载成功",
      description: "专利说明书已下载到本地",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="芯智领航者 - 专利说明书生成结果" backUrl="/dashboard/patents/specification" />

      <main className="container mx-auto px-4 py-8">
        {/* 生成参数摘要 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-bold mb-4">生成参数</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">专利名称：</span>
                <span className="text-gray-700">{title}</span>
              </div>
              <div>
                <span className="font-medium">技术领域：</span>
                <span className="text-gray-700">{field}</span>
              </div>
              {background && (
                <div className="md:col-span-2 lg:col-span-3">
                  <span className="font-medium">技术背景：</span>
                  <span className="text-gray-700">{background}</span>
                </div>
              )}
              {content && (
                <div className="md:col-span-2 lg:col-span-3">
                  <span className="font-medium">发明内容：</span>
                  <span className="text-gray-700">{content}</span>
                </div>
              )}
              {description && (
                <div className="md:col-span-2 lg:col-span-3">
                  <span className="font-medium">AI分析描述：</span>
                  <span className="text-gray-700">{description}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 专利说明书内容 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>专利说明书</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>复制全文</span>
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={downloadSpec}>
                  <Download className="h-4 w-4" />
                  <span>下载</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  <span>分享</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="preview">预览</TabsTrigger>
                <TabsTrigger value="edit">编辑</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="border rounded-lg p-6 bg-white">
                <div className="space-y-6 whitespace-pre-wrap font-mono text-sm">{generatedSpec}</div>
              </TabsContent>

              <TabsContent value="edit">
                <Textarea
                  className="min-h-[600px] font-mono text-sm"
                  value={generatedSpec}
                  onChange={(e) => setGeneratedSpec(e.target.value)}
                  placeholder="编辑专利说明书内容..."
                />
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setActiveTab("preview")}>预览更改</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
