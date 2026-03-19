# 项目 5：Bug 修复流水线 (Bugfix Pipeline)

## 场景说明

这是"可流水线分段的任务"场景。修复一个 bug 通常需要多个阶段：

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Locate  │ -> │  Analyze │ -> │   Fix    │ -> │  Verify  │
│  问题定位 │    │  原因分析 │    │  修复    │    │  验证    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

每个阶段由专门的子代理负责，主对话负责串联。

## 子代理配置

本项目包含**四个流水线子代理**：

```
.claude/agents/
├── bug-locator.md      # 定位：找到问题在哪
├── bug-analyzer.md     # 分析：理解为什么出问题
├── bug-fixer.md        # 修复：实施修复
└── bug-verifier.md     # 验证：确认修复有效
```

### 配置特点

| 子代理 | 工具 | 说明 |
|--------|------|------|
| bug-locator | Read, Grep, Glob | 只读，负责搜索定位 |
| bug-analyzer | Read, Grep, Glob | 只读，负责深入分析 |
| bug-fixer | Read, Edit, Write | **有写权限**，负责修改代码 |
| bug-verifier | Read, Bash, Grep | 运行测试，验证结果 |

## 如何使用

### 完整流水线

```
我有一个 bug：用户登录后偶尔会 token 验证失败。
帮我用流水线方式修复：
1. 先让 bug-locator 找到相关代码
2. 让 bug-analyzer 分析原因
3. 让 bug-fixer 修复
4. 让 bug-verifier 跑测试验证
```

### 单独使用某个阶段

```
让 bug-analyzer 分析一下 src/auth.js:45 这个 null pointer 是怎么产生的
```

```
让 bug-verifier 跑一下测试，看看之前的修复是否生效
```

## 项目结构

```
05-bugfix-pipeline/
├── src/
│   ├── user-service.js    # 用户服务（有 bug）
│   ├── cart-service.js    # 购物车服务（有 bug）
│   ├── order-service.js   # 订单服务（有 bug）
│   └── utils.js           # 工具函数
├── tests/
│   └── services.test.js   # 测试文件
└── .claude/agents/
    ├── bug-locator.md
    ├── bug-analyzer.md
    ├── bug-fixer.md
    └── bug-verifier.md
```

## 学习要点

1. **职责分离**：每个阶段专人负责
2. **权限递进**：只有 fixer 有写权限
3. **流程清晰**：先定位→分析→修复→验证
4. **可中断**：任何阶段发现问题可以停下来讨论

## 示例 Bug

项目中故意留了几个 bug：

| 位置 | Bug 类型 | 症状 |
|------|----------|------|
| user-service.js | 竞态条件 | 并发更新时数据不一致 |
| cart-service.js | 边界条件 | 空购物车时报错 |
| order-service.js | 类型错误 | 字符串和数字混用 |

## 流水线 vs 让主对话直接修

| 方式 | 适合场景 |
|------|----------|
| 流水线 | 复杂 bug、需要系统性排查 |
| 主对话直接修 | 简单 bug、位置已知 |

流水线的价值在于：**每个阶段的输出只是摘要**，不会污染主对话上下文。
