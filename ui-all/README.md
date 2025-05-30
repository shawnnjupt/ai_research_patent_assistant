# 专利与论文分析系统

这是一个基于 Next.js 15.2.4 构建的现代化专利与论文分析系统，提供了丰富的用户界面和交互功能。

## 技术栈

- **前端框架**: Next.js 15.2.4
- **UI 组件**: Radix UI
- **样式**: Tailwind CSS
- **数据可视化**: D3.js, Recharts
- **表单处理**: React Hook Form
- **类型检查**: TypeScript

## 主要功能

- 专利分析
  - 专利搜索
  - 专利规范分析
  - 专利布局图
  - 风险预警
- 论文管理
  - 论文列表
  - 论文详情
  - 论文分析
- 用户配置
  - 个人资料管理
  - 系统设置

## 开始使用

### 环境要求

- Node.js (推荐最新 LTS 版本)
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
cd ui-all
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 访问应用
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
ui-all/
├── app/                    # 应用主目录
│   ├── dashboard/         # 仪表板相关页面
│   │   ├── papers/       # 论文管理模块
│   │   │   ├── [paperId]/    # 动态路由：论文详情
│   │   │   │   ├── detail/   # 论文详细信息页面
│   │   │   │   └── components/  # 论文详情相关组件
│   │   │   │       ├── paper-details.tsx    # 论文详情展示组件
│   │   │   │       └── chat-interface.tsx   # 论文分析对话界面
│   │   │   └── page.tsx      # 论文列表页面
│   │   │
│   │   └── patents/      # 专利管理模块
│   │       ├── search/   # 专利搜索功能
│   │       │   ├── results/  # 搜索结果页面
│   │       │   └── page.tsx  # 搜索主页面
│   │       ├── specification/  # 专利规范分析
│   │       │   ├── results/   # 分析结果页面
│   │       │   └── page.tsx   # 规范分析主页面
│   │       ├── layout-map/    # 专利布局图
│   │       │   └── page.tsx   # 布局图展示页面
│   │       ├── risk-warning/  # 风险预警
│   │       │   └── page.tsx   # 风险预警页面
│   │       └── page.tsx       # 专利管理主页面
│   │
│   ├── profile/          # 用户配置模块
│   │   └── page.tsx      # 个人资料页面
│   │
│   └── page.tsx          # 应用首页
│
├── components/           # 可复用组件
│   ├── ui/              # 基础UI组件
│   └── shared/          # 共享业务组件
│
├── lib/                 # 工具函数和配置
│   ├── utils.ts         # 通用工具函数
│   └── constants.ts     # 常量定义
│
├── public/              # 静态资源
│   ├── images/         # 图片资源
│   └── fonts/          # 字体文件
│
└── styles/             # 全局样式
    └── globals.css     # 全局CSS样式
```

## 开发指南

- 使用 `npm run dev` 启动开发服务器
- 使用 `npm run lint` 运行代码检查
- 使用 `npm run build` 构建生产版本

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[添加许可证信息] 