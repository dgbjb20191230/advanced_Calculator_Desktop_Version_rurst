## ✨ 项目简介 | Project Overview

本项目是一个基于 React + Tauri 的高级科学计算器桌面应用，支持基本和科学计算、内存操作、历史记录等功能。界面现代、响应式，适配 Windows 32/64 位系统、macOS (包括 Apple Silicon M1+) 和 Linux 系统，支持绿色版与多种安装包输出。

This project is an advanced scientific calculator desktop application based on React + Tauri. It supports basic & scientific calculations, memory operations, history records, and more. The UI is modern and responsive, supporting Windows 32/64-bit systems, macOS (including Apple Silicon M1+), Linux systems, and portable/installer releases.

## 🚀 特性 | Features
- ➕➖✖️➗ 基础与科学计算（加减乘除、三角函数、开方、幂等）
- 🧠📜 内存操作与历史记录
- 🔄 角度/弧度切换
- 🖥️⌨️ 响应式极简界面，键盘支持
- 📦 一键打包，支持 Windows 32/64 位、macOS Apple Silicon (M1+) 和 Linux
- 💿 多种安装格式：Windows (MSI, EXE, ZIP), macOS (DMG, PKG), Linux (AppImage, DEB)
- 🔒 全本地运行，数据隐私安全

## 📦 下载 | Download
> <b>Windows、macOS 和 Linux 安装包请前往 Releases 页面：</b>
>
> [👉 点击下载最新版本 / Download Latest Release](https://github.com/your-username/your-repo/releases/latest)
>
> 支持的格式 | Supported formats:
> - Windows: MSI 安装包 (.msi), 安装向导 (.exe), 绿色版 (.zip)
> - macOS: 磁盘镜像 (.dmg), 安装包 (.pkg)
> - Linux: AppImage (.AppImage), Debian 安装包 (.deb)

## 🛠️ 快速开始 | Quick Start
```bash
# 安装依赖
yarn install

# 启动前端开发环境
yarn dev

# 启动桌面端开发环境
yarn tauri dev

# Windows 打包
yarn build:windows

# macOS 打包
yarn build:mac

# Linux 打包
yarn build:linux
```

更多开发、打包、常见问题请见开发文档。