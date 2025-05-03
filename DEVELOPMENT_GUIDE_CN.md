# 📖 高级计算器项目开发文档（全面版）

## 🗂️ 目录
- [项目简介](#项目简介)
- [开发环境搭建](#开发环境搭建)
- [开发理念与构思](#开发理念与构思)
- [项目结构说明](#项目结构说明)
- [主要技术栈](#主要技术栈)
- [核心功能设计](#核心功能设计)
- [开发与调试流程](#开发与调试流程)
- [打包与发布](#打包与发布)
- [常见问题与建议](#常见问题与建议)

---

## 🚀 项目简介
本项目是一个基于 React + Tauri 的高级科学计算器桌面应用，支持基本和科学计算、内存操作、历史记录等功能。界面现代、响应式，适配 Windows 32/64 位系统，支持绿色版与多种安装包输出。

---

## 🛠️ 开发环境搭建
### 1. 基础环境
- Node.js >= 16.x
- Yarn >= 1.x
- Rust（建议使用 rustup 安装）
  - Windows 开发：需添加 32/64 位目标
  - macOS 开发：支持 Intel 和 Apple Silicon (M1+)
- 支持的操作系统：
  - Windows 7/8/10/11
  - macOS 11.0+ (Big Sur 及更新版本)

### 2. 安装依赖
```bash
yarn install
```

### 3. 启动前端开发环境
```bash
yarn dev
```

### 4. 启动桌面端开发环境
```bash
yarn tauri dev
```

---

## 💡 开发理念与构思
- 🖥️🌐 **现代桌面与 Web 融合**：采用 Tauri 框架，结合 React 前端，获得近原生体验与跨平台能力。
- ✨🧮 **极简与实用并重**：界面极简，突出核心计算功能，兼顾科学函数与操作便捷性。
- 🛠️🔧 **高可维护性与扩展性**：前后端解耦，代码结构清晰，便于后续扩展和维护。
- 🔒💾 **数据本地化与隐私保护**：所有数据均本地存储，无需联网，保障用户隐私。
- ⚙️📦 **自动化打包与多版本支持**：支持一键生成 32/64 位安装包、绿色版、压缩包，方便分发。

---

## 🗃️ 项目结构说明
```
├── assets/               # 图片与资源文件
├── build-win.js          # Windows 一键打包脚本（Node.js）
├── build-windows.bat     # Windows 批处理打包脚本
├── create-portable.bat   # 生成绿色便携版脚本
├── dist/                 # 前端打包输出
├── node_modules/         # 依赖包
├── public/               # 公共静态资源
├── releases/             # 打包输出目录
├── src/                  # 前端 React 源码
│   ├── App.tsx           # 主界面与核心逻辑
│   ├── App.css           # 主样式文件
│   ├── main.tsx          # 应用入口
│   └── ...
├── src-tauri/            # Tauri 后端（Rust）
│   ├── src/              # Rust 源码
│   ├── tauri.conf.json   # Tauri 配置
│   └── ...
├── package.json          # 依赖与脚本
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
├── README.md             # 项目说明
└── DEVELOPMENT_GUIDE_CN.md           # 中文开发文档
```

---

## 🏗️ 主要技术栈
- 💻 **前端**：React 18, TypeScript, Vite 6
- 🖥️ **桌面端**：Tauri 2.x (Rust)
- 🎨 **样式**：CSS Modules
- 🛠️ **打包工具**：Vite, Tauri, Node.js 脚本, Bat 脚本

---

## ✨ 核心功能设计
- ➕➖✖️➗ **基础计算**：加、减、乘、除、百分比、小数点、正负号。
- 📐📏 **科学计算**：三角函数、开方、幂运算等。
- 🧠 **内存操作**：存储、调用、加减内存。
- 📜 **历史记录**：自动保存最近操作历史，支持弹窗查看。
- 🔄 **模式切换**：支持角度/弧度切换。
- ⌨️ **键盘支持**：支持常用键盘快捷操作。
- 📱🖥️ **响应式布局**：适配不同屏幕尺寸。

---

## 🧑‍💻 开发与调试流程
### 1. 前端开发
- 组件化开发，主逻辑集中在 `src/App.tsx`。
- 使用 React Hooks 管理状态（如 display、memory、history、angleMode 等）。
- 样式集中在 `src/App.css`，支持主题变量和响应式。
- 入口文件 `src/main.tsx`，支持热更新和内存优化。

### 2. 后端（Tauri）开发
- Rust 端负责窗口管理、系统交互等。
- 配置文件 `src-tauri/tauri.conf.json` 控制窗口属性、打包参数、权限等。
- 可扩展 Rust 插件以增强系统能力。

### 3. 本地调试
- 先运行 `yarn dev` 启动前端，再运行 `yarn tauri dev` 启动桌面端。
- 支持热更新，便于快速迭代。

---

## 📦 打包与发布
### 1. 生产环境打包
```bash
yarn build
```
- 前端代码输出到 `dist/`。

### 2. 桌面端打包
```bash
yarn tauri build
```
- 生成可执行文件和安装包，输出在 `src-tauri/target/`。

### 3. Windows 打包
```bash
yarn build:all
```
或运行批处理脚本：
```bash
./build-windows.bat
```
- 自动生成 32/64 位安装包、绿色版(zip)等，输出在 `releases/` 目录。

### 4. Windows 绿色便携版
```bash
./create-portable.bat
```
- 生成免安装绿色版及压缩包。

### 5. macOS 打包 (Apple Silicon M1+)
```bash
yarn build:mac
```
- 为 Apple Silicon (M1, M2, M3+) Mac 构建应用
- 同时创建 .dmg (磁盘镜像) 和 .pkg (安装包) 文件
- 输出文件保存在 `releases/macos/` 目录

### 6. macOS 手动构建
```bash
# 构建 Apple Silicon (M1+) 版本
yarn tauri build --target aarch64-apple-darwin

# 构建 Intel Mac 版本（如需要）
yarn tauri build --target x86_64-apple-darwin
```

### 7. Linux 打包
```bash
yarn build:linux
```
- 为 Linux (x86_64) 构建应用
- 同时创建 .AppImage 和 .deb (Debian 安装包) 文件
- 输出文件保存在 `releases/linux/` 目录

### 8. Linux 手动构建
```bash
yarn build:linux-direct
```
或
```bash
yarn tauri build --target x86_64-unknown-linux-gnu
```

### 9. Linux 打包文件位置
Linux 打包文件存放在以下位置：
- AppImage 文件：`src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/appimage/`
- Debian 安装包：`src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/deb/`
- 复制后的文件：`releases/linux/`

---

## ❓ 常见问题与建议
- Windows 打包前请确保 Rust 工具链已安装并配置好 Windows 目标：
  ```bash
  rustup target add i686-pc-windows-msvc x86_64-pc-windows-msvc
  ```
- macOS 打包前请确保已添加 Apple Silicon 目标：
  ```bash
  rustup target add aarch64-apple-darwin
  ```
  如需支持 Intel Mac（可选）：
  ```bash
  rustup target add x86_64-apple-darwin
  ```
- 依赖安装建议使用 yarn，避免 npm 兼容性问题。
- 打包失败时可尝试删除 `dist/`、`src-tauri/target/`、`releases/` 后重新构建。
- 如需自定义应用图标、名称等，请修改 `src-tauri/tauri.conf.json`。
- macOS 打包脚本会同时创建 .dmg（磁盘镜像）和 .pkg（安装包）两种格式。
- 支持功能扩展，如科学函数、历史导出等。
- 代码结构清晰，便于团队协作和后续维护。

---

## 🚀 自动上传发布到 GitHub Release

你可以在本地通过 GitHub CLI 实现自动上传打包好的安装包到 GitHub Release。

### 步骤如下：

1. **安装 GitHub CLI**
   - 官网下载：https://cli.github.com/
   - Windows 可用 winget 安装：
     ```powershell
     winget install --id GitHub.cli
     ```

2. **登录 GitHub 账户**
   ```bash
   gh auth login
   ```
   按提示完成授权。

3. **整理 releases 文件夹**
   - 将需要发布的安装包（如 `AdvancedCalculator_1.0.0_x64_zh-CN.msi`、`AdvancedCalculator_1.0.0_x64-setup.exe`、`AdvancedCalculator_1.0.0_x64.zip`）放到项目根目录下的 `releases` 文件夹，并确保文件名为英文。

4. **上传到 GitHub Release**
   - 在项目根目录命令行输入（以 v1.0.0 为例，实际版本号请自行调整）：
     ```bash
     gh release create v1.0.0 releases\AdvancedCalculator_1.0.0_x64_zh-CN.msi releases\AdvancedCalculator_1.0.0_x64-setup.exe releases\AdvancedCalculator_1.0.0_x64.zip --title "Advanced Calculator v1.0.0" --notes "Windows 安装包与安装向导"
     ```
   - 如果已存在该版本 Release，可用：
     ```bash
     gh release upload v1.0.0 releases\AdvancedCalculator_1.0.0_x64_zh-CN.msi releases\AdvancedCalculator_1.0.0_x64-setup.exe releases\AdvancedCalculator_1.0.0_x64.zip
     ```

5. **在 README.md 添加下载链接**
   - 推荐在“下载 | Download”部分加入：
     ```markdown
     > [👉 点击下载最新版本 / Download Latest Release](https://github.com/HuQingyepersonalprojectsummary/tarui-vue-vile-20250418/releases/latest)
     ```

6. **注意事项**
   - 不要把大二进制包直接 push 到主分支，只上传到 Release。
   - 每次发布新版本只需更换版本号和文件名即可。

如需自动递增版本号、批量上传、Release 自动草稿等高级功能，或遇到报错，请联系开发者。

---

💬 如有问题欢迎提交 Issue 或联系开发者。
