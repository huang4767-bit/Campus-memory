# Campus Memory

## 项目简介
Campus Memory（校园记忆）是一个面向初高中毕业生的校友社交平台，采用贴吧式话题互动模式，支持校级、年级、班级三级话题圈，帮助校友重建联系、分享校园回忆。这是一个大学生练手项目，主打简单易开发、核心流程完整。

## MVP 核心闭环
```
注册登录 → 完善校友信息 → 自动/申请入圈 → 发帖 → 评论/点赞/收藏 → 个人主页
```

**P0 必做：** 用户注册登录、话题圈、帖子互动、个人主页、敏感词过滤
**P2 延后：** 站内转发、群聊、班级云相册、举报后台

## 技术栈
- 前端：React 18 + Vite + Ant Design 5.x + Zustand + Axios
- 后端：Django 4.x + Django REST Framework + PostgreSQL 15+
- 认证：JWT (Access Token 2h + Refresh Token 7d)
- 实时通信：短轮询（前端每 5 秒轮询）
- 文件存储：本地存储

## 开发服务器
- 后端开发端口：8001（Swagger 文档：`/swagger/`，管理后台：`/admin/`）
- 前端开发端口：3000
- 启动脚本：
  - `start_dev_environment.ps1`：一键启动前后端开发环境
  - `start_backend_dev.ps1`：仅启动后端
  - `start_frontend_dev.ps1`：仅启动前端
  - `stop_dev_environment.ps1`：停止所有开发服务

## 目录结构
- frontend/src/components/：通用组件（Layout、PostCard、UserAvatar 等）
- frontend/src/pages/：页面组件（Home、Login、Register、Circle、Post、Profile、Album、Message、Admin）
- frontend/src/services/：API 请求封装
- frontend/src/stores/：Zustand 状态管理
- frontend/src/hooks/：自定义 Hooks
- frontend/src/utils/：工具函数
- backend/config/：Django 项目配置（settings、urls、wsgi）
- backend/apps/users/：用户模块
- backend/apps/schools/：学校模块
- backend/apps/circles/：话题圈模块
- backend/apps/posts/：帖子模块
- backend/apps/albums/：相册模块
- backend/apps/messages/：消息模块
- backend/apps/reports/：举报模块
- docs/：项目文档

## 代码规范
- 命名风格：React 组件用 PascalCase，函数和变量用 camelCase，Django 模型用 PascalCase，字段用 snake_case
- 文件组织：前端一个组件一个文件夹，后端按 Django app 标准结构
- 注释要求：复杂业务逻辑必须写注释，简单代码不用
- 注释语言：所有代码注释必须使用中英双语，格式为「中文 / English」
- **公共模块复用**：开发前必须检查 `backend/common/` 和 `frontend/src/utils/` 目录，优先复用现有模块（如分页、异常处理、响应格式等），避免重复造轮子，便于后期运维

## 前端样式规范
- **统一使用 Ant Design 的 `useToken` 获取主题变量，禁止使用独立的 CSS 变量文件**
- 主题配置文件：`frontend/src/styles/theme.js`（唯一的样式配置来源）
- 样式写法：使用内联 style 对象，通过 `theme.useToken()` 获取 token
- 示例：
```jsx
import { theme } from 'antd';

const MyComponent = () => {
  const { token } = theme.useToken();

  return (
    <div style={{
      color: token.colorPrimary,
      padding: token.padding,
      borderRadius: token.borderRadiusLG,
    }}>
      内容
    </div>
  );
};
```
- 修改主题只需修改 `theme.js` 一个文件，便于后期支持深色模式

## API 规范
- 基础路径：`/api/v1/`
- 响应格式：`{code, message, data}`
- 分页参数：`page`、`page_size`（默认20，最大100）
- 排序参数：`ordering`（前缀 `-` 表示降序）
- 幂等设计：点赞/收藏重复请求返回当前状态；入圈/好友申请重复返回 409

## 开发命令
- 命令必须兼容 Windows/PowerShell（不使用 `&&` 连接命令）
- 后端启动：
  ```powershell
  cd backend
  python manage.py makemigrations   # 仅当模型变更时 / only when schema changes
  python manage.py migrate
  python manage.py runserver 0.0.0.0:8001
  ```
- 前端启动：
  ```powershell
  cd frontend
  npm install        # 首次运行 / first time only
  npm run dev        # Vite 开发服务器 / Vite dev server
  npm run build      # 打包前端 / Vite build
  ```
- 测试命令：
  - 后端：`cd backend` 然后 `pytest`
  - 前端：`cd frontend` 然后 `npm test`

## 工作流程
1. **执行任务前，先阅读 `.memories/modules/` 目录**（从 `project-overview` 开始），了解项目背景和历史决策
2. 修改代码前，先阅读相关文件，理解上下文
3. 涉及接口变更时，同步更新 docs/api.md
4. 新增功能参考 PRD.md 中的功能定义和数据库设计
5. 新增模块或功能时，在 `.memories/modules/` 下创建对应文件夹，按现有模式添加 README/PRD/技术文档

## 注意事项
- 不要随意修改 backend/config/ 目录下的配置文件，除非明确要求
- 数据库操作要谨慎，先说明打算怎么做
- 密码必须使用 bcrypt 加密存储
- 图片上传限制：单张 ≤ 5MB，帖子最多 9 张，支持 jpg/png/gif
- 帖子内容最多 5000 字，标签最多 5 个
- 发布内容需进行敏感词过滤
- 学校支持用户自主添加，无需审核
- 校友信息仅作展示与匹配用，无需学籍核验
- 文件编码统一使用 UTF-8
- 命令必须兼容 Windows/PowerShell（不使用 `&&` 连接命令）
- 项目使用原生 Python/Node/PowerShell 脚本，不使用 Docker

## 隐私与可见性
- 真实姓名/学校/班级：本人、好友、同圈成员可见，陌生人不可见
- 手机号：仅本人可见
- 搜索功能：仅登录用户可用

## 删除与注销处理
- 用户删除帖子/评论：软删除，显示"已删除"
- 管理员删除：显示"因违规已被删除"
- 用户注销：账号禁用，信息脱敏，显示"已注销用户"
