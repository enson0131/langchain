# 项目 4：并行探索 (Parallel Explore)

## 场景说明

这是"可并行的研究任务"场景。当你需要同时了解一个项目的多个模块时：

- 传统方式：串行查看 auth → db → api，耗时长
- 子代理方式：三个子代理**同时**探索，主对话负责综合

## 子代理配置

本项目包含**三个专门的探索子代理**：

```
.claude/agents/
├── auth-explorer.md     # 认证模块专家
├── db-explorer.md       # 数据库模块专家
└── api-explorer.md      # API 模块专家
```

### 配置特点

- **tools**: 全部只读 (`Read, Grep, Glob`)
- **model**: 使用 `haiku`（探索任务追求速度）
- **description**: 明确各自的职责范围

## 如何使用

### 并行探索（推荐）

```
同时让 auth-explorer、db-explorer、api-explorer 探索各自模块，
然后汇总给我一个整体架构理解
```

Claude 会：
1. 并行启动三个子代理
2. 各自独立探索
3. 收集三份报告后综合

### 单独探索

```
让 auth-explorer 分析一下认证流程是怎么实现的
```

### 技术选型场景

```
让三个 explorer 分别评估在各自模块引入 TypeScript 的影响
```

## 项目结构

```
04-parallel-explore/
├── src/
│   ├── auth/           # 认证模块
│   │   ├── index.js
│   │   ├── jwt.js
│   │   └── session.js
│   ├── database/       # 数据库模块
│   │   ├── index.js
│   │   ├── models.js
│   │   └── migrations.js
│   └── api/            # API 模块
│       ├── index.js
│       ├── routes.js
│       └── middleware.js
└── .claude/agents/
    ├── auth-explorer.md
    ├── db-explorer.md
    └── api-explorer.md
```

## 学习要点

1. **并行加速**：多个子代理同时工作
2. **职责划分**：每个子代理专注一个领域
3. **主对话综合**：你负责整合各方报告
4. **模型选择**：探索任务用 haiku 更高效

## 何时使用并行探索

| 适合 | 不适合 |
|------|--------|
| 新接手大型项目 | 简单的单文件查询 |
| 技术选型评估 | 需要跨模块串联理解 |
| 重构前的调研 | 已经熟悉的代码 |
| 多方案比较 | 简单的 grep 搜索 |


