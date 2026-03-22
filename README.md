# Image Background Remover

基于 Next.js + Tailwind CSS 构建的在线图片背景去除工具。

## 功能特点

- 🚀 3秒去除图片背景
- 🎨 支持 PNG、JPG、JPEG 格式
- 💻 纯前端实现，图片不上传到第三方服务器
- 📱 响应式设计，支持移动端
- 🔒 API Key 仅存储在浏览器本地

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Remove.bg API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 3. 构建生产版本

```bash
npm run build
```

静态文件将输出到 `dist` 目录。

## 部署

### Cloudflare Pages

1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 连接 GitHub 仓库
3. 构建设置：
   - 构建命令：`npm run build`
   - 输出目录：`dist`

### Vercel

```bash
npm i -g vercel
vercel
```

## 使用方法

1. 在页面输入框中填入 Remove.bg API Key
2. 拖拽或点击上传图片
3. 等待自动处理
4. 下载去除背景后的 PNG 图片

## 获取 API Key

访问 [Remove.bg](https://www.remove.bg/) 注册账号，每月免费 50 次调用。

## 许可证

MIT License
