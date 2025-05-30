"use client"

import { useState } from "react"
import { ArrowLeft, Upload, User, Mail, Phone, Building, GraduationCap, FileText, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/components/shared/header"

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=120&width=120")
  const [isVerified, setIsVerified] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    department: "",
    position: "",
    researchField: "",
    education: "",
    bio: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarUpload = () => {
    // 模拟头像上传
    const newAvatarUrl = "/placeholder.svg?height=120&width=120&text=New+Avatar"
    setAvatarUrl(newAvatarUrl)
  }

  const handleSubmit = () => {
    // 模拟提交认证
    setIsVerified(true)
    alert("身份认证信息已提交，等待审核中...")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="芯智领航者" backUrl="/" />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">个人资料与身份认证</h2>
            <p className="text-muted-foreground">完善您的个人信息，获得更好的研究服务体验</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧头像和基本信息 */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">个人头像</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="用户头像" />
                      <AvatarFallback className="text-2xl">
                        <User className="w-16 h-16" />
                      </AvatarFallback>
                    </Avatar>
                    <Button onClick={handleAvatarUpload} className="gap-2">
                      <Camera className="w-4 h-4" />
                      更换头像
                    </Button>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">认证状态</span>
                      <Badge variant={isVerified ? "default" : "secondary"}>{isVerified ? "已认证" : "未认证"}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">用户类型</span>
                      <Badge variant="outline">研究员</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">注册时间</span>
                      <span className="text-sm text-muted-foreground">2024-01-15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧身份认证表单 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    身份认证信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        真实姓名 *
                      </Label>
                      <Input
                        id="name"
                        placeholder="请输入真实姓名"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        邮箱地址 *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="请输入邮箱地址"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        联系电话
                      </Label>
                      <Input
                        id="phone"
                        placeholder="请输入联系电话"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institution" className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        所属机构 *
                      </Label>
                      <Input
                        id="institution"
                        placeholder="请输入所属机构"
                        value={formData.institution}
                        onChange={(e) => handleInputChange("institution", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">所属部门</Label>
                      <Input
                        id="department"
                        placeholder="请输入所属部门"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">职位/职称</Label>
                      <Select onValueChange={(value) => handleInputChange("position", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择职位" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professor">教授</SelectItem>
                          <SelectItem value="associate_professor">副教授</SelectItem>
                          <SelectItem value="lecturer">讲师</SelectItem>
                          <SelectItem value="researcher">研究员</SelectItem>
                          <SelectItem value="associate_researcher">副研究员</SelectItem>
                          <SelectItem value="assistant_researcher">助理研究员</SelectItem>
                          <SelectItem value="phd">博士研究生</SelectItem>
                          <SelectItem value="master">硕士研究生</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="researchField">研究领域 *</Label>
                      <Select onValueChange={(value) => handleInputChange("researchField", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择研究领域" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">计算机科学</SelectItem>
                          <SelectItem value="ai">人工智能</SelectItem>
                          <SelectItem value="physics">物理学</SelectItem>
                          <SelectItem value="chemistry">化学</SelectItem>
                          <SelectItem value="biology">生物学</SelectItem>
                          <SelectItem value="medicine">医学</SelectItem>
                          <SelectItem value="engineering">工程学</SelectItem>
                          <SelectItem value="materials">材料科学</SelectItem>
                          <SelectItem value="economics">经济学</SelectItem>
                          <SelectItem value="management">管理学</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education" className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        最高学历
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("education", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择最高学历" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phd">博士</SelectItem>
                          <SelectItem value="master">硕士</SelectItem>
                          <SelectItem value="bachelor">学士</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">个人简介</Label>
                    <Textarea
                      id="bio"
                      placeholder="请简要介绍您的研究背景、专业领域和学术成就..."
                      className="min-h-[100px]"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button variant="outline">保存草稿</Button>
                    <Button onClick={handleSubmit} className="gap-2">
                      <Upload className="w-4 h-4" />
                      提交认证
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
