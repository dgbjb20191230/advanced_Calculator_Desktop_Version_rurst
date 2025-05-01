# Advanced Calculator Project Development Guide

## Table of Contents
- [Project Overview](#project-overview)
- [Environment Setup](#environment-setup)
- [Development Philosophy & Concepts](#development-philosophy--concepts)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Development & Debugging Workflow](#development--debugging-workflow)
- [Build & Release](#build--release)
- [FAQ & Suggestions](#faq--suggestions)

---

## Project Overview
This project is an advanced scientific calculator desktop application based on React + Tauri. It supports basic and scientific calculations, memory operations, history records, and more. The UI is modern and responsive, supporting Windows 32/64-bit systems, Linux systems, portable versions, and multiple installer formats.

---

## Environment Setup
### 1. Prerequisites
- Node.js >= 16.x
- Yarn >= 1.x
- Rust (recommended: install via rustup)
- Windows 7/8/10/11 or Linux system

### 2. Install Dependencies
```bash
yarn install
```

### 3. Start Frontend Development Server
```bash
yarn dev
```

### 4. Start Desktop Development (Tauri)
```bash
yarn tauri dev
```

---

## Development Philosophy & Concepts
- **Modern Desktop & Web Integration**: Uses Tauri for native-like experience and cross-platform capability, with React for frontend.
- **Minimalism & Practicality**: Clean UI focused on core calculation features, with scientific functions and convenient operations.
- **Maintainability & Extensibility**: Decoupled frontend and backend, clear code structure for easy maintenance and expansion.
- **Local Data & Privacy**: All data is stored locally, no network required, ensuring user privacy.
- **Automated Multi-version Packaging**: Supports one-click generation of 32/64-bit installers, portable versions, and zip packages for easy distribution.

---

## Project Structure
```
├── assets/               # Images & resources
├── build-win.js          # Windows packaging script (Node.js)
├── build-windows.bat     # Windows batch packaging script
├── create-portable.bat   # Portable version script
├── dist/                 # Frontend build output
├── node_modules/         # Dependencies
├── public/               # Static resources
├── releases/             # Build output (installers)
├── src/                  # Frontend React source code
│   ├── App.tsx           # Main UI & logic
│   ├── App.css           # Main styles
│   ├── main.tsx          # Entry point
│   └── ...
├── src-tauri/            # Tauri backend (Rust)
│   ├── src/              # Rust source code
│   ├── tauri.conf.json   # Tauri config
│   └── ...
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
├── README.md             # Project introduction
└── DEVELOPMENT_GUIDE_EN.md           # English development guide
```

---

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite 6
- **Desktop**: Tauri 2.x (Rust)
- **Styling**: CSS Modules
- **Build Tools**: Vite, Tauri, Node.js scripts, Bat scripts

---

## Core Features
- **Basic Calculations**: Addition, subtraction, multiplication, division, percentage, decimal, sign.
- **Scientific Calculations**: Trigonometric functions, square root, power, etc.
- **Memory Operations**: Store, recall, add, subtract memory.
- **History Records**: Automatically saves recent operations, with modal view.
- **Mode Switching**: Supports degree/radian switching.
- **Keyboard Support**: Common keyboard shortcuts supported.
- **Responsive Layout**: Adapts to various screen sizes.

---

## Development & Debugging Workflow
### 1. Frontend Development
- Component-based, main logic in `src/App.tsx`.
- Uses React Hooks for state management (display, memory, history, angleMode, etc.).
- Styles in `src/App.css`, with theme variables and responsive design.
- Entry file `src/main.tsx`, supports hot reload and memory optimization.

### 2. Backend (Tauri) Development
- Rust part handles window management, system integration, etc.
- Config file `src-tauri/tauri.conf.json` controls window, packaging, permissions, etc.
- Can extend with Rust plugins for advanced system features.

### 3. Local Debugging
- Run `yarn dev` for frontend, then `yarn tauri dev` for desktop app.
- Hot reload supported for fast iteration.

---

## Build & Release
### 1. Production Build
```bash
yarn build
```
- Frontend code outputs to `dist/`.

### 2. Desktop Packaging
```bash
yarn tauri build
```
- Generates executables and installers, output in `src-tauri/target/`.

### 3. Windows Multi-platform Packaging
```bash
yarn build:all
```
Or run the batch script:
```bash
./build-windows.bat
```
- Automatically generates 32/64-bit installers, portable (zip), output in `releases/`.

### 4. Linux Packaging
```bash
# Install required dependencies
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev

# Build the application
yarn build
yarn tauri build
```
- Generates .deb (Debian/Ubuntu) and .rpm (Fedora/CentOS) packages, as well as AppImage executable.
- Output location: `src-tauri/target/release/bundle/`

### 5. Installing Linux Packages
```bash
# Install .deb package (Debian/Ubuntu)
sudo apt install ./src-tauri/target/release/bundle/deb/jsqyyCalculator_1.0.0_amd64.deb

# Or use dpkg to install
sudo dpkg -i ./src-tauri/target/release/bundle/deb/jsqyyCalculator_1.0.0_amd64.deb
# If there are dependency issues, run
sudo apt-get install -f

# Install .rpm package (Fedora/CentOS)
sudo rpm -i ./src-tauri/target/release/bundle/rpm/jsqyyCalculator-1.0.0-1.x86_64.rpm

# Run AppImage
chmod +x ./src-tauri/target/release/bundle/appimage/jsqyyCalculator_1.0.0_amd64.AppImage
./src-tauri/target/release/bundle/appimage/jsqyyCalculator_1.0.0_amd64.AppImage
```

### 6. Create Windows Portable Version
```bash
./create-portable.bat
```
- Generates portable (no-install) version and zip archive.

---

## FAQ & Suggestions
- For Windows packaging, ensure Rust toolchain is installed with Windows 32/64-bit targets:
  ```bash
  rustup target add i686-pc-windows-msvc x86_64-pc-windows-msvc
  ```

- For Linux packaging, ensure necessary system dependencies are installed:
  ```bash
  sudo apt update
  sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
  ```

- Use yarn for dependency installation to avoid npm compatibility issues.
- If packaging fails, try removing `dist/`, `src-tauri/target/`, `releases/` and rebuilding.
- To customize app icon, name, etc., edit `src-tauri/tauri.conf.json`.
- The project is extensible (scientific functions, history export, etc.).
- Clean code structure, suitable for team collaboration and future maintenance.

---

## Automated Upload to GitHub Release

You can automate the upload of your build packages to GitHub Releases locally using GitHub CLI.

### Steps:

1. **Install GitHub CLI**
   - Download from: https://cli.github.com/
   - On Windows, you can use winget:
     ```powershell
     winget install --id GitHub.cli
     ```

2. **Authenticate with GitHub**
   ```bash
   gh auth login
   ```
   Follow the prompts to authorize your account.

3. **Organize the releases folder**
   - Place the release files to be published (e.g. `AdvancedCalculator_1.0.0_x64_zh-CN.msi`, `AdvancedCalculator_1.0.0_x64-setup.exe`, `AdvancedCalculator_1.0.0_x64.zip`) in the `releases` folder at the project root, and make sure the filenames are in English.

4. **Upload to GitHub Release**
   - In the project root terminal, run (replace `v1.0.0` with your version):
     ```bash
     gh release create v1.0.0 releases\AdvancedCalculator_1.0.0_x64_zh-CN.msi releases\AdvancedCalculator_1.0.0_x64-setup.exe releases\AdvancedCalculator_1.0.0_x64.zip --title "Advanced Calculator v1.0.0" --notes "Windows installer and setup wizard"
     ```
   - If the release already exists, use:
     ```bash
     gh release upload v1.0.0 releases\AdvancedCalculator_1.0.0_x64_zh-CN.msi releases\AdvancedCalculator_1.0.0_x64-setup.exe releases\AdvancedCalculator_1.0.0_x64.zip
     ```

5. **Add a download link in README.md**
   - In the "Download" section, add:
     ```markdown
     > [👉 Download Latest Release](https://github.com/HuQingyepersonalprojectsummary/tarui-vue-vile-20250418/releases/latest)
     ```

6. **Notes**
   - Do NOT push large binaries directly to the main branch; only upload them to Releases.
   - For each new version, just change the version number and filenames as needed.

If you need auto-incrementing version numbers, batch uploads, draft releases, or encounter errors, please contact the developer.

---

For questions, please submit an Issue or contact the developer.
