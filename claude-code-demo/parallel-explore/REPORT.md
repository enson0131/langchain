# 项目架构分析报告

> 由 auth-explorer、db-explorer、api-explorer 三个代理并行探索生成

---

## 技术栈概览

| 层级 | 技术选型 |
|------|----------|
| **运行时** | Node.js |
| **数据库** | PostgreSQL |
| **认证** | JWT + 会话管理 |
| **API风格** | RESTful |
| **ORM** | 无（自定义模型层） |

---

## 目录结构

```
src/
├── api/                    # API 层
│   ├── index.js           # 路由定义
│   ├── middleware.js      # 中间件（认证、授权、CORS等）
│   └── handlers/          # 请求处理器
├── auth/                   # 认证层
│   ├── index.js           # 认证服务
│   ├── jwt.js             # JWT 工具
│   └── session.js         # 会话管理
└── database/               # 数据层
    ├── index.js           # 连接管理
    ├── models.js          # 数据模型
    └── migrations.js      # 迁移系统
```

---

## 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端请求                            │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     中间件链                                 │
│  requestLogger → errorHandler → cors → bodyParser           │
│           → rateLimit → authenticate → authorize            │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     路由层 (API Router)                      │
│  /health, /api/auth/*, /api/users/*, /api/products/*,       │
│  /api/orders/*                                              │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌──────────────────────┬──────────────────────┬───────────────┐
│    认证服务 (Auth)    │     数据模型 (DB)     │  会话管理     │
│  - JWT 签发/验证     │  - User              │  - 会话存储    │
│  - 权限检查          │  - Product           │  - 有效性验证  │
│  - 角色管理          │  - Order             │  - 会话失效    │
│                      │  - OrderItem         │               │
└──────────────────────┴──────────┬───────────┴───────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 数据库连接层 (Database)                      │
│              PostgreSQL 连接池 + 事务管理                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 认证模块

### 核心组件

| 组件 | 文件 | 职责 |
|------|------|------|
| AuthService | `src/auth/index.js` | 登录验证、权限检查 |
| JWT模块 | `src/auth/jwt.js` | Token签名、验证、解码 |
| 会话管理 | `src/auth/session.js` | 会话CRUD、有效性管理 |

### 认证流程

```
登录请求 → 验证凭据 → 生成JWT → 创建会话 → 返回Token
    ↓
后续请求 → 验证Token → 检查会话 → 解析用户 → 继续处理
```

### 角色权限 (RBAC)

| 角色 | 权限 |
|------|------|
| `admin` | 读取、写入、删除、管理 |
| `editor` | 读取、写入 |
| `viewer` | 仅读取 |

### Token策略

- **类型**: JWT (JSON Web Token)
- **签名算法**: HS256 (HMAC-SHA256)
- **有效期**: 默认24小时（可配置）
- **存储位置**: 内存存储（当前实现）
- **包含信息**: 用户ID、角色、签发时间(iat)、过期时间(exp)

### 安全措施

1. **密码安全**
   - 密码哈希存储（模型中有passwordHash字段）
   - 登录凭据验证（需实现）

2. **Token安全**
   - JWT签名验证
   - 过期时间检查
   - 会话有效性验证
   - Base64URL编码避免字符转义问题

3. **会话管理**
   - 单用户最多5个活跃会话
   - 30天不活跃会话自动失效
   - 支持单个会话失效和全部会话失效

4. **HTTP安全**
   - CORS配置允许必要头部
   - 请求速率限制（100请求/分钟）
   - 请求日志记录
   - 错误处理和状态码管理

---

## 数据库模块

### 数据模型关系

```
┌──────────┐       ┌──────────┐       ┌─────────────┐
│   User   │──1:N──│  Order   │──1:N──│  OrderItem  │
└──────────┘       └──────────┘       └──────┬──────┘
                                              │
                                         N:1  │
                                              ▼
                                       ┌──────────┐
                                       │ Product  │
                                       └──────────┘
```

### 数据模型

| 模型 | 表名 | 关键字段 |
|------|------|----------|
| User | users | id, email, password_hash, name, role, created_at, updated_at, deleted_at |
| Product | products | id, name, description, price, category, inventory, created_at, updated_at, deleted_at |
| Order | orders | id, user_id, total, status, created_at, updated_at |
| OrderItem | order_items | id, order_id, product_id, quantity, price |

### 关键索引

- `users(email)` - 唯一索引
- `products(category, name)` - 分类和名称索引
- `orders(user_id, status)` - 用户订单和状态索引
- `order_items(order_id)` - 订单项索引

### 特性

- ✅ 事务支持 (beginTransaction, commit, rollback)
- ✅ 软删除 (User, Product 支持 deleted_at)
- ✅ 版本化迁移 (支持 up/down 操作)
- ⚠️ 模拟连接池（需改进）

### 数据库配置

```javascript
{
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  poolSize: process.env.POOL_SIZE || 10
}
```

---

## API模块

### 端点列表

| 方法 | 路径 | 处理器 | 需要认证 |
|------|------|--------|----------|
| GET | /health | 匿名 | 否 |
| POST | /api/auth/login | handleLogin | 否 |
| POST | /api/auth/logout | handleLogout | 是 |
| POST | /api/auth/refresh | handleRefresh | 是 |
| GET | /api/users/:id | getUser | 是 |
| PUT | /api/users/:id | updateUser | 是 |
| DELETE | /api/users/:id | deleteUser | 是 |
| GET | /api/products | listProducts | 否 |
| GET | /api/products/:id | getProduct | 否 |
| GET | /api/products/search | searchProducts | 否 |
| GET | /api/orders | listOrders | 是 |
| GET | /api/orders/:id | getOrder | 是 |
| POST | /api/orders | createOrder | 是 |
| PUT | /api/orders/:id/status | updateOrderStatus | 是 |

### 中间件栈

```
requestLogger → errorHandler → cors → bodyParser
    → [rateLimit] → [authenticate] → [authorize] → handler
```

| 中间件 | 功能 |
|--------|------|
| requestLogger | 记录请求日志，包含方法、路径、响应状态和处理时间 |
| errorHandler | 集中式错误处理，统一错误响应格式 |
| cors | 跨域资源共享设置 |
| bodyParser | 请求体 JSON 解析 |
| rateLimit | 速率限制（可选） |
| authenticate | JWT 认证 |
| authorize | 权限验证 |

### 请求流程

```
请求 → requestLogger → errorHandler → cors → bodyParser →
[可选：rateLimit] → [可选：authenticate] → [可选：authorize] → 路由处理器 → 响应
```

### 响应格式

```javascript
// 成功
{ data: {...}, message: "操作成功" }

// 错误
{ error: "错误类型", message: "详细描述" }
```

### 错误类型

- `UNAUTHORIZED` - 未授权
- `FORBIDDEN` - 禁止访问
- `INVALID_TOKEN` - 无效Token
- `RATE_LIMITED` - 请求过于频繁
- `INTERNAL_ERROR` - 内部错误

---

## 架构改进建议

| 优先级 | 建议 | 模块 |
|--------|------|------|
| 🔴 高 | 实现真正的数据库连接池 | 数据库 |
| 🔴 高 | 实现密码哈希函数（当前为TODO） | 认证 |
| 🟡 中 | 添加Redis作为会话存储 | 认证 |
| 🟡 中 | 实现预加载机制解决N+1查询 | 数据库 |
| 🟡 中 | 添加完整的Schema输入校验 | API |
| 🟡 中 | 添加数据库连接重试机制 | 数据库 |
| 🟢 低 | 添加API文档（Swagger/OpenAPI） | API |
| 🟢 低 | 添加单元测试和集成测试 | 全局 |
| 🟢 低 | 添加双因素认证支持 | 认证 |
| 🟢 低 | 添加查询日志和性能监控 | 数据库 |

---

## 架构优点

1. **模块化设计** - 各层职责清晰，API、认证、数据库完全分离
2. **安全多层防护** - JWT + 会话双重验证机制
3. **完整的中间件链** - 日志、错误处理、限流、认证、授权
4. **软删除支持** - User 和 Product 支持数据可恢复
5. **版本化迁移** - 数据库 schema 变更可追溯、可回滚
6. **RESTful 规范** - 使用合适的 HTTP 方法和状态码
7. **统一响应格式** - 错误处理和响应结构一致

---

## 待完善事项

- [ ] 实现密码哈希函数
- [ ] 实现真正的数据库连接池
- [ ] 添加 Redis 会话存储
- [ ] 完善 Schema 输入校验
- [ ] 添加 API 文档
- [ ] 添加测试覆盖
- [ ] 添加性能监控

---

*报告生成时间: 2026-03-19*
