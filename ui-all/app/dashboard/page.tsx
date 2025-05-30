import Link from "next/link"
import { Search, FileText, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-black text-white border-b border-gray-800">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-white text-lg font-bold">芯智领航者</h1>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-gray-700">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="用户头像" />
              <AvatarFallback>用户</AvatarFallback>
            </Avatar>
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="text-sm font-medium text-white hover:bg-gray-800 hover:text-white">
                研究员
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">欢迎使用科研创新点查询助手</h2>
            <p className="text-muted-foreground">快速查询论文和专利的创新点，助力您的研究工作</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-8">
            <Link href="/dashboard/papers" className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    论文查询
                  </CardTitle>
                  <CardDescription>查询学术论文的创新点和研究成果</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 bg-muted/50 rounded-md">
                    <Search className="h-12 w-12 text-muted-foreground/70" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">SCI</Badge>
                    <Badge variant="secondary">EI</Badge>
                    <Badge variant="secondary">CSSCI</Badge>
                    <Badge variant="secondary">SSCI</Badge>
                  </div>
                </CardFooter>
              </Card>
            </Link>

            <Link href="/dashboard/patents" className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    专利查询
                  </CardTitle>
                  <CardDescription>查询专利的创新点和技术特征</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 bg-muted/50 rounded-md">
                    <Search className="h-12 w-12 text-muted-foreground/70" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">发明专利</Badge>
                    <Badge variant="secondary">实用新型</Badge>
                    <Badge variant="secondary">外观设计</Badge>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </div>

          <div className="pt-8">
            <h3 className="text-lg font-medium mb-4">热门搜索</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["人工智能", "机器学习", "深度学习", "区块链", "量子计算", "新能源材料"].map((term) => (
                <Button key={term} variant="outline" className="justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  {term}
                </Button>
              ))}
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