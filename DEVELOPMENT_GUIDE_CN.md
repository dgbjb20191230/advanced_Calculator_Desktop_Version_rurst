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
  - Linux 系统

### 2. 安装依赖
```bash
yarn install
```

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

### 3. Windows 一键多平台打包
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

### 10. Linux 安装包使用
```bash
# 安装 .deb 包（Debian/Ubuntu）
sudo apt install ./src-tauri/target/release/bundle/deb/jsqyyCalculator_1.0.0_amd64.deb

# 或者使用 dpkg 安装
sudo dpkg -i ./src-tauri/target/release/bundle/deb/jsqyyCalculator_1.0.0_amd64.deb
# 如果有依赖问题，运行
sudo apt-get install -f

# 安装 .rpm 包（Fedora/CentOS）
sudo rpm -i ./src-tauri/target/release/bundle/rpm/jsqyyCalculator-1.0.0-1.x86_64.rpm

# 运行 AppImage
chmod +x ./src-tauri/target/release/bundle/appimage/jsqyyCalculator_1.0.0_amd64.AppImage
./src-tauri/target/release/bundle/appimage/jsqyyCalculator_1.0.0_amd64.AppImage

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
- Linux 打包前请确保安装了必要的系统依赖：
  ```bash
  sudo apt update
  sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
  ```
- 依赖安装建议使用 yarn，避免 npm 兼容性问题。
- 打包失败时可尝试删除 `dist/`、`src-tauri/target/`、`releases/` 后重新构建。
- 如需自定义应用图标、名称等，请修改 `src-tauri/tauri.conf.json`。
- macOS 打包脚本会同时创建 .dmg（磁盘镜像）和 .pkg（安装包）两种格式。
- 支持功能扩展，如科学函数、历史导出等。
- 代码结构清晰，便于团队协作和后续维护。

```