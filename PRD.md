# Campus Memory - 校友社交平台 产品需求文档（PRD）

> 版本：v1.0
> 更新日期：2025-12-28
> 项目类型：练手项目 / 个人项目

---

## 一、项目概述

### 1.1 项目背景

Campus Memory（校园记忆）是一个面向初高中毕业生的校友社交平台，旨在帮助校友重建联系、分享校园回忆、沉淀青春记忆。平台采用贴吧式话题互动模式，支持校级、年级、班级三级话题圈，让校友能够精准找到同窗好友。

### 1.2 项目定位

- **核心定位**：轻量级校友社交平台（网页端）
- **目标场景**：校友寻找、回忆分享、班级社群交流
- **项目性质**：大学生练手项目，主打"简单易开发、核心流程完整"
- **设计原则**：省略复杂核验与风控逻辑，预留扩展接口

### 1.3 目标用户

| 角色 | 描述 | 核心需求 |
|------|------|----------|
| **普通校友** | 初/高中毕业生 | 注册完善校友信息、发布校园回忆帖、参与话题讨论、共享老照片、添加校友好友 |
| **班级管理员** | 班级圈创建者/管理者 | 创建班级话题圈、审核成员加入申请、管理圈内内容（置顶/删除） |
| **平台管理员** | 系统管理员 | 基础用户管理、简单内容审核、系统基础配置 |

---

## 二、技术架构

### 2.1 技术栈选型

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **前端框架** | React 18 | 主流前端框架，生态成熟 |
| **UI 组件库** | Ant Design 5.x | 企业级组件库，开箱即用 |
| **状态管理** | Zustand / Redux Toolkit | 轻量级状态管理 |
| **HTTP 请求** | Axios | 请求拦截、响应处理 |
| **后端框架** | Django 4.x + DRF | Python Web 框架，自带 Admin 后台 |
| **数据库** | PostgreSQL 15+ | 功能强大，支持数组、全文搜索 |
| **缓存** | Redis（可选） | 热点数据缓存、消息队列 |
| **文件存储** | 本地存储 | 练手阶段使用，后续可迁移云存储 |
| **认证方式** | JWT | 无状态认证，前后端分离标配 |
| **实时通信** | 短轮询 | 简化实现，降低开发难度 |
| **前端样式** | useToken | 统一使用 Ant Design 主题系统 |

### 2.1.1 前端样式规范

**统一使用 Ant Design 的 `useToken` 获取主题变量，禁止使用独立的 CSS 变量文件。**

- 主题配置文件：`frontend/src/styles/theme.js`
- 样式写法：内联 style 对象 + `theme.useToken()`
- 优势：修改主题只需改一个文件，便于支持深色模式

### 2.2 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                          │
│                   React + Ant Design                    │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/HTTPS
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Nginx 反向代理                        │
│              静态资源服务 + API 转发                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Django + DRF                           │
│    ┌─────────┬─────────┬─────────┬─────────┬────────┐   │
│    │  Users  │  Posts  │ Circles │ Albums  │Messages│   │
│    └─────────┴─────────┴─────────┴─────────┴────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL     │    │   文件存储        │
│   数据持久化      │    │   图片/附件       │
└──────────────────┘    └──────────────────┘
```

### 2.3 项目目录结构

```
campus-memory/
├── frontend/                    # React 前端项目
│   ├── public/
│   ├── src/
│   │   ├── components/          # 通用组件
│   │   │   ├── Layout/          # 布局组件
│   │   │   ├── PostCard/        # 帖子卡片
│   │   │   └── UserAvatar/      # 用户头像
│   │   ├── pages/               # 页面组件
│   │   │   ├── Home/            # 首页
│   │   │   ├── Login/           # 登录页
│   │   │   ├── Register/        # 注册页
│   │   │   ├── Circle/          # 话题圈页
│   │   │   ├── Post/            # 帖子详情页
│   │   │   ├── Profile/         # 个人主页
│   │   │   ├── Album/           # 相册页
│   │   │   ├── Message/         # 消息页
│   │   │   └── Admin/           # 管理页面
│   │   ├── services/            # API 请求封装
│   │   ├── stores/              # 状态管理
│   │   ├── hooks/               # 自定义 Hooks
│   │   ├── utils/               # 工具函数
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Django 后端项目
│   ├── config/                  # 项目配置
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/                    # 应用模块
│   │   ├── users/               # 用户模块
│   │   ├── schools/             # 学校模块
│   │   ├── circles/             # 话题圈模块
│   │   ├── posts/               # 帖子模块
│   │   ├── albums/              # 相册模块
│   │   ├── messages/            # 消息模块
│   │   └── reports/             # 举报模块
│   ├── media/                   # 上传文件存储
│   ├── static/                  # 静态文件
│   ├── requirements.txt
│   └── manage.py
│
├── docs/                        # 项目文档
│   └── api.md                   # API 文档
│
├── docker-compose.yml           # Docker 编排（可选）
└── README.md
```

---

## 三、功能需求

### 3.1 功能优先级说明

| 优先级 | 说明 | 开发策略 |
|--------|------|----------|
| **P0** | 核心必备功能，决定产品基础价值 | 必须完成 |
| **P1** | 重要增值功能，提升用户粘性 | 尽量完成 |
| **P2** | 扩展功能，预留接口 | 后续迭代 |

### 3.1.1 MVP 核心闭环

MVP 阶段聚焦以下核心流程：

```
注册登录 → 完善校友信息 → 自动/申请入圈 → 发帖 → 评论/点赞/收藏 → 个人主页
```

**P0 功能清单：**
- 用户注册、登录、完善信息
- 话题圈（校级/年级自动入圈，班级圈申请审核）
- 帖子发布、评论、点赞、收藏
- 个人主页（查看/编辑）
- 敏感词过滤

**P2 延后功能：**
- 站内转发
- 群聊
- 班级云相册
- 举报后台管理

### 3.2 P0 功能：用户与身份管理

#### 3.2.1 用户注册

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 用户名 | String | 是 | 4-20位，字母数字下划线 |
| 密码 | String | 是 | 6-20位，需加密存储 |
| 确认密码 | String | 是 | 与密码一致 |
| 手机号 | String | 否 | 用于密码找回（可选） |

**业务规则：**
- 用户名不可重复
- 密码使用 bcrypt 加密存储
- 注册成功后自动登录并跳转完善信息页

**验收标准：**
| 场景 | 预期结果 |
|------|----------|
| 用户名已存在 | 提示"用户名已被占用" |
| 用户名格式不符 | 提示"用户名需4-20位，仅支持字母数字下划线" |
| 两次密码不一致 | 提示"两次密码输入不一致" |
| 注册成功 | 自动登录，跳转完善信息页 |

#### 3.2.2 完善校友信息

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 真实姓名 | String | 是 | 2-20位中文或英文 |
| 学校 | Select | 是 | 从学校库选择或新增 |
| 毕业年份 | Select | 是 | 如 2020 |
| 班级 | String | 是 | 如 "高三1班" |
| 头像 | Image | 否 | 支持上传，默认系统头像 |
| 个人简介 | Text | 否 | 最多 200 字 |

**业务规则：**
- 校友信息仅作展示与匹配用，无需学籍核验
- 学校支持用户自主添加
- 预留学籍核验接口、实名认证接口

#### 3.2.3 用户登录

**登录方式：**
- 用户名 + 密码登录
- 预留手机号 + 验证码登录接口

**业务规则：**
- 登录成功返回 JWT Token（Access Token + Refresh Token）
- Access Token 有效期 2 小时，Refresh Token 有效期 7 天
- 连续登录失败 5 次，锁定账号 15 分钟

**验收标准：**
| 场景 | 预期结果 |
|------|----------|
| 用户名不存在 | 提示"用户名或密码错误" |
| 密码错误 | 提示"用户名或密码错误"，失败计数+1 |
| 连续失败5次 | 提示"账号已锁定，请15分钟后重试" |
| 锁定期间登录 | 拒绝登录，显示剩余锁定时间 |
| 登录成功 | 返回 Token，清除失败计数 |

#### 3.2.4 权限体系

| 角色 | 权限范围 |
|------|----------|
| **普通用户** | 发帖、评论、点赞、收藏、加好友、私聊 |
| **班级管理员** | 普通用户权限 + 创建班级圈、审核入圈申请、置顶/删除圈内内容 |
| **平台管理员** | 所有权限 + 删除违规内容、管理用户账号、系统配置 |

**角色获取方式：**
- 普通用户：注册即获得
- 班级管理员：创建班级圈自动成为该圈管理员
- 平台管理员：后台指定

### 3.3 P0 功能：贴吧式话题互动

#### 3.3.1 话题圈分级

| 圈子类型 | 说明 | 创建方式 | 加入方式 |
|----------|------|----------|----------|
| **校级圈** | 全校校友交流，发布母校动态 | 系统自动创建（学校创建时） | 同校校友自动加入 |
| **年级圈** | 同届校友回忆分享 | 系统自动创建 | 同校同届自动加入 |
| **班级圈** | 专属私密交流空间 | 班级管理员手动创建 | 申请加入，管理员审核 |

**自动入圈规则：**
- 用户完善校友信息后，系统自动将其加入对应的校级圈和年级圈
- 若校级圈/年级圈不存在，系统自动创建

**班级圈验收标准：**
| 场景 | 预期结果 |
|------|----------|
| 创建班级圈 | 创建者自动成为管理员 |
| 申请加入 | 状态变为 pending，通知管理员 |
| 管理员审核通过 | 状态变为 approved，用户可见圈内内容 |
| 管理员审核拒绝 | 状态变为 rejected，可重新申请 |
| 重复申请 | 提示"已有待审核申请" |

#### 3.3.2 帖子发布

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 所属圈子 | Select | 是 | 选择发布到哪个圈子 |
| 内容 | Text | 是 | 帖子正文，最多 5000 字 |
| 图片 | Image[] | 否 | 最多 9 张，单张≤5MB |
| 标签 | String[] | 否 | 回忆标签，如 #2020届毕业照 |

**业务规则：**
- 发布前进行敏感词过滤
- 图片支持 jpg/png/gif 格式
- 标签最多添加 5 个

#### 3.3.3 互动功能

| 功能 | 说明 |
|------|------|
| **点赞** | 对帖子/评论点赞，可取消 |
| **评论** | 对帖子发表评论 |
| **楼中楼回复** | 对评论进行回复，支持 @指定用户 |
| **收藏** | 收藏帖子到个人收藏夹 |

> 站内转发功能移至 P2

#### 3.3.4 内容管理

**排序方式：**
- 最新发布（默认）
- 最新回复
- 热度排序（点赞+评论数加权）

**管理员操作：**
- 置顶帖子（公告/重要回忆帖）
- 设为精华帖
- 删除违规内容
- 批量管理

### 3.4 P0 功能：基础安全保障

#### 3.4.1 内容安全

| 功能 | 说明 |
|------|------|
| **敏感词过滤** | 使用开源敏感词库，发布时自动检测 |
| **用户举报** | 支持举报帖子、评论、用户（P1 实现举报后台处理）|

**预留接口：**
- AI 内容审核接口
- 未成年人保护接口

#### 3.4.2 数据安全

- 用户密码 bcrypt 加密存储
- 支持用户主动注销账号
- 数据每日本地自动备份

**删除与注销处理规则：**
| 操作 | 处理方式 |
|------|----------|
| 用户删除帖子 | 软删除，内容不可见，评论保留显示"原帖已删除" |
| 用户删除评论 | 软删除，显示"该评论已删除" |
| 管理员删除内容 | 软删除，显示"该内容因违规已被删除" |
| 用户注销账号 | 账号禁用，个人信息脱敏，帖子/评论显示"已注销用户" |

#### 3.4.3 隐私与可见性规则

**字段可见性：**
| 字段 | 本人 | 好友 | 同圈成员 | 陌生人 |
|------|------|------|----------|--------|
| 头像 | ✓ | ✓ | ✓ | ✓ |
| 昵称/用户名 | ✓ | ✓ | ✓ | ✓ |
| 真实姓名 | ✓ | ✓ | ✓ | ✗ |
| 学校 | ✓ | ✓ | ✓ | ✗ |
| 毕业年份 | ✓ | ✓ | ✓ | ✗ |
| 班级 | ✓ | ✓ | ✓ | ✗ |
| 个人简介 | ✓ | ✓ | ✓ | ✗ |
| 手机号 | ✓ | ✗ | ✗ | ✗ |

**搜索结果可见性：**
- 仅登录用户可使用校友搜索
- 搜索结果展示：头像、昵称、学校、毕业年份、班级
- 未登录用户无法访问搜索功能

### 3.5 P1 功能：校园回忆沉淀

#### 3.5.1 班级云相册

| 功能 | 说明 |
|------|------|
| 上传照片 | 班级成员可上传老照片，单张≤5MB |
| 照片备注 | 标注人物、时间、地点 |
| 查看浏览 | 按时间线展示，支持大图预览 |

**预留接口：** 相册分类接口、批量下载接口

### 3.6 P1 功能：校友连接与沟通

#### 3.6.1 校友检索

**搜索条件：**
- 学校（必选）
- 毕业年份（可选）
- 班级（可选）
- 姓名（可选，支持模糊搜索）

**业务规则：**
- 搜索结果仅对注册用户开放
- 结果按匹配度排序

#### 3.6.2 好友系统

| 功能 | 说明 |
|------|------|
| 发送好友请求 | 向校友发送添加请求 |
| 处理请求 | 接受/拒绝好友请求 |
| 好友列表 | 查看所有好友 |
| 删除好友 | 双向解除好友关系 |

#### 3.6.3 消息系统（短轮询实现）

**私聊功能：**
- 互为好友即可发起私聊
- 支持发送文字和图片
- 前端每 5 秒轮询获取新消息

> 群聊功能移至 P2

### 3.7 P1 功能：个人主页与动态

#### 3.7.1 个人主页

**展示信息：**
- 头像、昵称、个人简介
- 校友身份（学校/毕业年份/班级）
- 发布的帖子列表
- 加入的班级圈

**操作：**
- 编辑个人资料
- 查看他人主页

#### 3.7.2 首页动态推送

**内容来源：**
- 已加入圈子的最新帖子
- 关注好友的动态

**刷新方式：**
- 手动下拉刷新
- 分页加载更多

---

## 四、数据库设计

### 4.1 ER 关系图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   School    │────<│ UserProfile │>────│    User     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Circle    │────<│CircleMember │     │ Friendship  │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Post     │    │ AlbumPhoto  │    │GroupMessage │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       ▼
┌─────────────┐
│   Comment   │
└─────────────┘
```

### 4.2 数据表结构

#### 4.2.1 用户相关表

**schools - 学校表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| name | VARCHAR(200) | NOT NULL | 学校名称 |
| province | VARCHAR(50) | | 省份 |
| city | VARCHAR(50) | | 城市 |
| type | VARCHAR(20) | | junior_high/senior_high |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**user_profiles - 用户资料表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| user_id | INTEGER | UNIQUE, FK → auth_user | 关联 Django User |
| phone | VARCHAR(20) | | 手机号 |
| avatar | VARCHAR(500) | | 头像 URL |
| bio | TEXT | | 个人简介 |
| school_id | INTEGER | FK → schools | 学校 |
| graduation_year | INTEGER | | 毕业年份 |
| class_name | VARCHAR(50) | | 班级名称 |
| real_name | VARCHAR(50) | | 真实姓名 |
| role | VARCHAR(20) | DEFAULT 'user' | user/class_admin/platform_admin |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**friendships - 好友关系表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| user_id | INTEGER | FK → auth_user | 发起方 |
| friend_id | INTEGER | FK → auth_user | 接收方 |
| status | VARCHAR(20) | DEFAULT 'pending' | pending/accepted/rejected |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**约束：** UNIQUE(user_id, friend_id)

**双向关系处理：**
- 好友关系为单向存储，查询时需双向查询
- 接受请求后，仅更新 status 为 accepted，不创建反向记录
- 删除好友时直接删除该记录，双方关系同时解除
- 状态流转：pending → accepted/rejected，rejected 可重新发起请求

#### 4.2.2 话题圈相关表

**circles - 话题圈表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| name | VARCHAR(200) | NOT NULL | 圈子名称 |
| type | VARCHAR(20) | NOT NULL | school/grade/class |
| school_id | INTEGER | FK → schools | 所属学校 |
| graduation_year | INTEGER | | 年级圈用 |
| class_name | VARCHAR(50) | | 班级圈用 |
| creator_id | INTEGER | FK → auth_user | 创建者 |
| description | TEXT | | 圈子描述 |
| member_count | INTEGER | DEFAULT 0 | 成员数量 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**circle_members - 圈子成员表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| circle_id | INTEGER | FK → circles | 圈子 |
| user_id | INTEGER | FK → auth_user | 用户 |
| role | VARCHAR(20) | DEFAULT 'member' | member/admin |
| status | VARCHAR(20) | DEFAULT 'pending' | pending/approved/rejected |
| joined_at | TIMESTAMP | DEFAULT NOW() | 加入时间 |

**约束：** UNIQUE(circle_id, user_id)

#### 4.2.3 帖子相关表

**posts - 帖子表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| circle_id | INTEGER | FK → circles | 所属圈子 |
| author_id | INTEGER | FK → auth_user | 作者 |
| content | TEXT | NOT NULL | 帖子内容 |
| images | TEXT[] | | 图片 URL 数组 |
| tags | VARCHAR(100)[] | | 标签数组 |
| is_pinned | BOOLEAN | DEFAULT FALSE | 是否置顶 |
| is_featured | BOOLEAN | DEFAULT FALSE | 是否精华 |
| view_count | INTEGER | DEFAULT 0 | 浏览数 |
| like_count | INTEGER | DEFAULT 0 | 点赞数 |
| comment_count | INTEGER | DEFAULT 0 | 评论数 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**comments - 评论表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| post_id | INTEGER | FK → posts | 所属帖子 |
| author_id | INTEGER | FK → auth_user | 评论者 |
| parent_id | INTEGER | FK → comments | 父评论（楼中楼） |
| reply_to_user_id | INTEGER | FK → auth_user | @的用户 |
| content | TEXT | NOT NULL | 评论内容 |
| like_count | INTEGER | DEFAULT 0 | 点赞数 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**likes - 点赞表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| user_id | INTEGER | FK → auth_user | 点赞用户 |
| post_id | INTEGER | FK → posts | 帖子（二选一） |
| comment_id | INTEGER | FK → comments | 评论（二选一） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**约束：**
- UNIQUE(user_id, post_id), UNIQUE(user_id, comment_id)
- CHECK: (post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)

**favorites - 收藏表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| user_id | INTEGER | FK → auth_user | 用户 |
| post_id | INTEGER | FK → posts | 帖子 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**约束：** UNIQUE(user_id, post_id)

### 4.3 计数字段一致性维护

| 计数字段 | 所在表 | 维护策略 |
|----------|--------|----------|
| member_count | circles | 成员加入/退出时同步更新 |
| like_count | posts, comments | 点赞/取消时同步更新 |
| comment_count | posts | 评论创建/删除时同步更新 |
| view_count | posts | 异步更新，允许短暂不一致 |

**实现方式：**
- 使用 Django 信号（signals）或在业务层同步更新
- view_count 可使用 Redis 计数，定期同步到数据库

### 4.4 索引设计

| 表 | 索引字段 | 说明 |
|----|----------|------|
| posts | circle_id, created_at | 圈内帖子按时间排序 |
| posts | author_id | 用户帖子列表 |
| comments | post_id, created_at | 帖子评论列表 |
| likes | user_id, post_id | 判断是否已点赞 |
| circle_members | circle_id, status | 圈子成员列表 |
| friendships | user_id, status | 好友列表查询 |
| friendships | friend_id, status | 收到的好友请求 |

#### 4.2.4 相册表

**album_photos - 相册照片表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| circle_id | INTEGER | FK → circles | 所属班级圈 |
| uploader_id | INTEGER | FK → auth_user | 上传者 |
| image_url | VARCHAR(500) | NOT NULL | 图片 URL |
| description | TEXT | | 照片备注 |
| taken_at | DATE | | 拍摄时间 |
| created_at | TIMESTAMP | DEFAULT NOW() | 上传时间 |

#### 4.2.5 消息相关表

**private_messages - 私信表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| sender_id | INTEGER | FK → auth_user | 发送者 |
| receiver_id | INTEGER | FK → auth_user | 接收者 |
| content | TEXT | NOT NULL | 消息内容 |
| image_url | VARCHAR(500) | | 图片 |
| is_read | BOOLEAN | DEFAULT FALSE | 是否已读 |
| created_at | TIMESTAMP | DEFAULT NOW() | 发送时间 |

**group_messages - 群聊消息表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| circle_id | INTEGER | FK → circles | 所属圈子 |
| sender_id | INTEGER | FK → auth_user | 发送者 |
| content | TEXT | NOT NULL | 消息内容 |
| image_url | VARCHAR(500) | | 图片 |
| created_at | TIMESTAMP | DEFAULT NOW() | 发送时间 |

**reports - 举报表**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 主键 |
| reporter_id | INTEGER | FK → auth_user | 举报人 |
| target_type | VARCHAR(20) | | post/comment/user |
| target_id | INTEGER | | 目标 ID |
| reason | TEXT | | 举报原因 |
| status | VARCHAR(20) | DEFAULT 'pending' | pending/processed/rejected |
| handler_id | INTEGER | FK → auth_user | 处理人 |
| handled_at | TIMESTAMP | | 处理时间 |
| created_at | TIMESTAMP | DEFAULT NOW() | 举报时间 |

---

## 五、API 接口设计

### 5.1 接口规范

- **基础路径：** `/api/v1/`
- **认证方式：** JWT Bearer Token
- **请求格式：** JSON
- **响应格式：** JSON

**统一响应结构：**

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

**错误响应：**

```json
{
  "code": 400,
  "message": "错误描述",
  "errors": { ... }
}
```

**分页约定：**
- 请求参数：`page`（页码，默认1）、`page_size`（每页数量，默认20，最大100）
- 响应结构：
```json
{
  "code": 200,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

**排序约定：**
- 请求参数：`ordering`（字段名，前缀 `-` 表示降序）
- 示例：`ordering=-created_at`（按创建时间降序）

**错误码表：**
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证/Token 过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如重复操作） |
| 422 | 业务校验失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

**幂等性设计：**
| 操作 | 幂等处理 |
|------|----------|
| 点赞/取消点赞 | 重复请求返回当前状态，不报错 |
| 收藏/取消收藏 | 重复请求返回当前状态，不报错 |
| 入圈申请 | 已有 pending 状态时返回 409 |
| 好友请求 | 已有 pending 状态时返回 409 |

### 5.2 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/auth/register/` | 用户注册 | 否 |
| POST | `/auth/login/` | 用户登录 | 否 |
| POST | `/auth/refresh/` | 刷新 Token | 否 |
| POST | `/auth/logout/` | 退出登录 | 是 |

### 5.3 用户接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/users/me/` | 获取当前用户信息 | 是 |
| PUT | `/users/me/` | 更新个人信息 | 是 |
| GET | `/users/{id}/` | 查看他人主页 | 是 |
| POST | `/users/search/` | 搜索校友 | 是 |
| DELETE | `/users/me/` | 注销账号 | 是 |

### 5.4 好友接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/friends/` | 好友列表 | 是 |
| POST | `/friends/request/` | 发送好友请求 | 是 |
| GET | `/friends/requests/` | 收到的好友请求 | 是 |
| POST | `/friends/accept/{id}/` | 接受好友请求 | 是 |
| POST | `/friends/reject/{id}/` | 拒绝好友请求 | 是 |
| DELETE | `/friends/{id}/` | 删除好友 | 是 |

### 5.5 学校接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/schools/` | 学校列表（支持搜索） | 是 |
| POST | `/schools/` | 添加学校 | 是 |
| GET | `/schools/{id}/` | 学校详情 | 是 |

### 5.6 圈子接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/circles/` | 圈子列表 | 是 |
| POST | `/circles/` | 创建班级圈 | 是 |
| GET | `/circles/{id}/` | 圈子详情 | 是 |
| POST | `/circles/{id}/join/` | 申请加入 | 是 |
| GET | `/circles/{id}/members/` | 成员列表 | 是 |
| POST | `/circles/{id}/approve/{user_id}/` | 审核通过 | 是 |
| POST | `/circles/{id}/reject/{user_id}/` | 审核拒绝 | 是 |

### 5.7 帖子接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/posts/` | 帖子列表（支持筛选排序） | 是 |
| POST | `/posts/` | 发布帖子 | 是 |
| GET | `/posts/{id}/` | 帖子详情 | 是 |
| PUT | `/posts/{id}/` | 编辑帖子 | 是 |
| DELETE | `/posts/{id}/` | 删除帖子 | 是 |
| POST | `/posts/{id}/like/` | 点赞/取消点赞 | 是 |
| POST | `/posts/{id}/favorite/` | 收藏/取消收藏 | 是 |
| POST | `/posts/{id}/pin/` | 置顶（管理员） | 是 |
| POST | `/posts/{id}/feature/` | 设为精华（管理员） | 是 |

### 5.8 评论接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/posts/{id}/comments/` | 评论列表 | 是 |
| POST | `/posts/{id}/comments/` | 发表评论 | 是 |
| DELETE | `/comments/{id}/` | 删除评论 | 是 |
| POST | `/comments/{id}/like/` | 点赞评论 | 是 |

### 5.9 相册接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/circles/{id}/album/` | 相册照片列表 | 是 |
| POST | `/circles/{id}/album/` | 上传照片 | 是 |
| DELETE | `/album/{id}/` | 删除照片 | 是 |

### 5.10 消息接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/messages/private/` | 私信会话列表 | 是 |
| GET | `/messages/private/{user_id}/` | 与某人的私信记录 | 是 |
| POST | `/messages/private/{user_id}/` | 发送私信 | 是 |
| GET | `/messages/group/{circle_id}/` | 群聊消息（短轮询） | 是 |
| POST | `/messages/group/{circle_id}/` | 发送群聊消息 | 是 |

### 5.11 举报接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/reports/` | 提交举报 | 是 |
| GET | `/reports/` | 举报列表（管理员） | 是 |
| POST | `/reports/{id}/process/` | 处理举报（管理员） | 是 |

### 5.12 文件上传接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/upload/image/` | 上传图片 | 是 |

**上传响应结构：**
```json
{
  "code": 200,
  "data": {
    "url": "/media/uploads/2025/01/xxx.jpg",
    "filename": "xxx.jpg",
    "size": 102400
  }
}
```

### 5.13 短轮询性能说明

**当前方案：** 前端每 5 秒轮询消息接口

**并发评估（1000 用户在线）：**
- 私信轮询：1000 × (60/5) = 12000 请求/分钟
- 建议：消息接口使用 Redis 缓存，减少数据库压力

**后续优化方向：**
- 长轮询（Long Polling）：减少无效请求
- WebSocket：实时推送，彻底消除轮询

---

## 六、开发计划

### 6.1 阶段划分

#### 第一阶段：基础框架搭建

**后端任务：**
- 初始化 Django 项目，配置 PostgreSQL
- 集成 Django REST Framework
- 配置 JWT 认证
- 实现用户注册、登录接口

**前端任务：**
- 初始化 React 项目（Vite）
- 配置 Ant Design、React Router
- 封装 Axios 请求
- 实现登录、注册页面

#### 第二阶段：核心社交功能

**后端任务：**
- 学校、圈子模块 CRUD
- 帖子发布、编辑、删除
- 评论（含楼中楼）功能
- 点赞、收藏功能
- 图片上传接口

**前端任务：**
- 首页动态流
- 圈子列表与详情页
- 帖子发布与详情页
- 评论组件

#### 第三阶段：校友连接

**后端任务：**
- 校友搜索接口
- 好友系统（请求、接受、删除）
- 个人主页接口

**前端任务：**
- 校友搜索页
- 好友列表与请求管理
- 个人主页

#### 第四阶段：增值功能

**后端任务：**
- 班级相册上传、查看
- 私信、群聊接口（短轮询）
- 举报功能

**前端任务：**
- 班级相册页面
- 消息中心（私信 + 群聊）
- 举报弹窗

#### 第五阶段：完善与部署

**后端任务：**
- 敏感词过滤集成
- Django Admin 后台配置
- 接口测试与优化

**前端任务：**
- 整体 UI 优化
- 响应式适配
- 打包部署

**运维任务：**
- Docker 容器化
- Nginx 配置
- 数据库备份脚本

---

## 七、非功能需求

### 7.1 性能要求

| 指标 | 要求 |
|------|------|
| 并发支持 | 1000 级并发访问 |
| 页面加载 | 首次加载 ≤ 3 秒 |
| 图片上传 | 单张 ≤ 5MB，响应 ≤ 8 秒 |
| 搜索响应 | ≤ 2 秒 |

### 7.2 兼容性要求

**浏览器支持：**
- Chrome 90+
- Edge 90+
- Safari 14+
- Firefox 90+

**屏幕分辨率：**
- 最小支持 1366×768
- 推荐 1920×1080

### 7.3 可靠性要求

| 指标 | 要求 |
|------|------|
| 数据备份 | 每日自动备份 |
| 故障恢复 | ≤ 3 小时 |
| 数据安全 | 密码加密存储，支持账号注销 |

### 7.4 易用性要求

- 核心功能操作路径 ≤ 3 步
- 页面导航简洁清晰
- 提供简单新手引导文字

### 7.5 可扩展性要求

**架构设计：**
- 采用前后端分离架构
- RESTful API 设计规范
- 代码模块化，便于后期维护

**预留接口：**
- 学籍核验接口
- 实名认证接口
- AI 内容审核接口
- 小程序联动接口
- 相册分类接口

---

## 八、附录

### 8.1 术语说明

| 术语 | 说明 |
|------|------|
| 话题圈 | 用户交流的社区空间，分校级/年级/班级三级 |
| 楼中楼 | 对评论的回复，形成嵌套结构 |
| 短轮询 | 前端定时请求服务器获取新消息的方式 |

### 8.2 参考资料

- [Django REST Framework 文档](https://www.django-rest-framework.org/)
- [Ant Design 组件库](https://ant.design/)
- [React 官方文档](https://react.dev/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
