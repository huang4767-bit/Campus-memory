# Campus Memory 记忆文件系统

## 简介

本目录用于沉淀 Campus Memory 项目的业务背景、产品决策与代码实现细节，帮助 AI 在接手任务时快速理解项目上下文。

## 目录结构

```
.memories/
├── README.md              # 本文件
├── modules/               # 记忆模块目录
│   ├── INDEX.md           # 模块索引
│   └── <业务-主题>/       # 具体模块
├── templates/             # 模块模板
│   └── module/
└── scripts/               # 速查脚本
```

## 使用方式

1. 查看 `modules/INDEX.md` 了解现有模块
2. 进入相关模块目录，阅读 README.md 获取导航
3. 完成任务后，更新相关文档并同步 INDEX.md

## 命名规范

- 模块目录：`业务-主题` 形式，小写加连字符（如 `backend-init`）
- 功能文档：`FUNCTION-功能名.md`，大写加连字符
