# AiToEarn 项目 AI 协作指南

## 项目概述

AiToEarn 是一个 AI 内容营销智能体平台，帮助创作者通过自动化实现内容变现。

**核心功能**：
- 💰 Monetize - 内容赚钱（CPS/CPE/CPM 结算）
- 📢 Publish - 多平台内容发布
- 💬 Engage - 自动化互动运营
- 🎨 Create - AI 内容创作

**技术栈**：
- 后端：Node.js + NestJS
- 前端：Vue.js
- 数据库：MongoDB + Redis
- 部署：Docker

---

## 分岗位协作规则

### 产品经理
- 使用 `/office-hours` 验证新功能需求
- 使用 `/plan-ceo-review` 找到 10 星产品方案
- 所有需求评审决策记录到 `.learnings/product-decisions.md`
- 用户反馈和功能优先级记录到知识图谱

### 前端/UI 开发
- 组件库、设计规范通过知识图谱管理
- 样式错误通过 self-improving-agent 自动沉淀
- 使用 `/design-review` 进行视觉审查
- 使用 `/qa` 进行自动化测试

### 内容运营
- 写作风格、禁用词、标题公式录入 self-improving-agent
- 活动→渠道→用户群关系通过知识图谱管理
- 历史投放数据结构化存储

### 客服/技术支持
- 高频问题标准答案自动积累
- 错误解决方案纠正后写入 `ERRORS.md`
- 平台操作流程沉淀到知识库

---

## Skill 路由规则

当用户请求匹配以下场景时，优先调用对应的 Skill：

- 产品想法、需求验证 → `/office-hours`
- 找 10 星产品方案 → `/plan-ceo-review`
- 架构设计 → `/plan-eng-review`
- 设计审查 → `/plan-design-review`
- Bug 调试 → `/investigate`
- 代码审查 → `/review`
- QA 测试 → `/qa`
- 发布部署 → `/ship`
- 性能监控 → `/canary`
- 工程复盘 → `/retro`

---

## 开发规范

### 代码风格
- 使用 ESLint + Prettier
- 提交前自动格式化
- 遵循 Git Commit 规范

### 测试要求
- 新功能必须包含单元测试
- 关键流程需要集成测试
- 使用 `/qa` 进行自动化测试

### 部署流程
1. 本地测试通过
2. 使用 `/review` 代码审查
3. 使用 `/ship` 创建 PR
4. CI/CD 自动部署
5. 使用 `/canary` 监控

---

## 知识沉淀

### 自动学习（self-improving-agent）
- 每次错误修正自动记录
- 高频问题自动提炼标准答案
- 团队共享 `.learnings/` 目录

### 知识图谱（推荐安装 Ontology Skill）
- 功能→需求→用户故事关系图
- 组件→页面→设计规范关系图
- 活动→渠道→用户群关系网

---

## 安全规范

### 敏感信息
- API Key 使用环境变量
- 不提交 `.env` 文件
- 使用 `/cso` 进行安全审查

### 数据处理
- 用户数据加密存储
- 遵循 GDPR 规范
- 定期安全审计

---

## 联系方式

- Telegram: https://t.me/harryyyy2025
- 微信：见 README
