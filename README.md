# 天气ing

一个液态玻璃风格的天气查询网页，支持自动定位、区县搜索、逐时预报、7天预报和空气质量展示。

## 特性

- Canvas 天气动态背景 + 全屏循环动效（高性能实现）
- 液态玻璃风格 UI（毛玻璃 + 半透明）
- 浏览器自动定位，推送当地天气
- 区县级天气搜索
- 24 小时逐时预报
- 7 天天气预报
- 空气质量、紫外线、湿度、风速、气压、能见度、日出日落
- 生活建议
- 悬停/长按天气动效加速

## 技术栈

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Canvas 2D 粒子系统（替代 framer-motion，零 DOM 动画开销）

## 数据

- 当前：Mock 数据（模拟中国气象局格式）
- 后续：和风天气 API（需申请 API Key）

## 环境变量

复制 `.env.example` 为 `.env`：

```bash
VITE_DATA_MODE=mock
# VITE_QWEATHER_KEY=your_key_here
```

切换到真实天气数据时：

```bash
VITE_DATA_MODE=api
VITE_QWEATHER_KEY=your_key_here
```

## 本地运行

```bash
npm install
npm run dev
```

## 部署

已配置 GitHub Actions 自动部署到 GitHub Pages。推送代码到 `main` 分支后自动触发。

---

© 2026 天气ing
