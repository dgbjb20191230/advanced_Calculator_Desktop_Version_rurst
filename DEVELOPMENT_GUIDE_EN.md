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
This project is an advanced scientific calculator desktop application based on React + Tauri. It supports basic and scientific calculations, memory operations, history records, and more. The UI is modern and responsive, supporting Windows 32/64-bit systems, portable versions, and multiple installer formats.

---

## Environment Setup
### 1. Prerequisites
- Node.js >= 16.x
- Yarn >= 1.x
- Rust (recommended: install via rustup, with Windows 32/64-bit targets enabled)
- Windows 7/8/10/11

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
- Generates Windows executables and installers, output in `src-tauri/target/`.

### 3. One-click Multi-platform Packaging (Recommended)
```bash
yarn build:all
```
Or run the batch script:
```bash
./build-windows.bat
```
- Automatically generates 32/64-bit installers, portable (zip), output in `releases/`.

### 4. Create Portable Version
```bash
./create-portable.bat
```
- Generates portable (no-install) version and zip archive.

---

## FAQ & Suggestions
- Before packaging, ensure Rust toolchain is installed and Windows 32/64-bit targets are added:
  ```bash
  rustup target add i686-pc-windows-msvc x86_64-pc-windows-msvc
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

3. **Use the Automation Script**
   - The project root contains the `upload-release.bat` script.
   - By default, it uploads all `.exe`, `.zip`, `.msi` files in the `releases` directory, with version set to `v1.0.0` (you can edit the variables at the top of the script).
   - To run:
     - Double-click the script, or run in terminal:
       ```bat
       upload-release.bat
       ```
   - The script will check if gh is installed and authenticated, then create a Release and upload the build files.

4. **Notes**
   - Do NOT push large binaries directly to the main branch; only upload them to Releases.
   - The first time you use gh, you need to authenticate.
   - You can modify the script to support multiple files, different version numbers, etc.

If you need auto-incrementing version numbers, multi-language notes, or encounter errors, please contact the developer.

---

For questions, please submit an Issue or contact the developer.
