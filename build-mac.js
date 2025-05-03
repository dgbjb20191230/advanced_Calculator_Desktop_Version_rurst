#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}=== 高级计算器 macOS 构建脚本 ====${colors.reset}`);
console.log(`${colors.yellow}准备构建 macOS 应用 (兼容 M1 及以上)${colors.reset}`);

// Clean existing build artifacts
try {
  console.log(`${colors.yellow}清理旧的构建文件...${colors.reset}`);

  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }

  if (fs.existsSync('./src-tauri/target')) {
    fs.rmSync('./src-tauri/target', { recursive: true, force: true });
  }

  console.log(`${colors.green}清理完成${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}清理错误: ${err.message}${colors.reset}`);
}

// Build frontend
try {
  console.log(`${colors.yellow}构建前端...${colors.reset}`);
  execSync('yarn build', { stdio: 'inherit' });
  console.log(`${colors.green}前端构建完成${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}前端构建失败: ${err.message}${colors.reset}`);
  process.exit(1);
}

// Build macOS app for Apple Silicon (M1 and above)
try {
  console.log(`${colors.yellow}构建 macOS 应用 (Apple Silicon)...${colors.reset}`);
  execSync('yarn tauri build --target aarch64-apple-darwin', { stdio: 'inherit' });
  console.log(`${colors.green}macOS 应用构建完成${colors.reset}`);

  // Create output directory
  const outputDir = path.join(__dirname, 'releases', 'macos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Copy the .app bundle to the output directory
  const tauriDir = path.join(__dirname, 'src-tauri', 'target', 'aarch64-apple-darwin', 'release', 'bundle');
  const appPath = path.join(tauriDir, 'macos');

  if (fs.existsSync(appPath)) {
    // Create DMG (disk image)
    console.log(`${colors.yellow}创建 DMG 镜像...${colors.reset}`);
    try {
      execSync(`hdiutil create -volname "高级计算器" -srcfolder "${appPath}" -ov -format UDZO "${outputDir}/高级计算器-M1.dmg"`, { stdio: 'inherit' });
      console.log(`${colors.green}DMG 镜像创建完成${colors.reset}`);
    } catch (err) {
      console.error(`${colors.red}DMG 镜像创建失败: ${err.message}${colors.reset}`);
    }

    // Create PKG installer
    console.log(`${colors.yellow}创建 PKG 安装包...${colors.reset}`);
    try {
      // First, create a temporary directory for the pkg structure
      const pkgTempDir = path.join(outputDir, 'pkg-temp');
      if (!fs.existsSync(pkgTempDir)) {
        fs.mkdirSync(pkgTempDir, { recursive: true });
      }

      // Create Applications directory in the temp folder
      const pkgAppsDir = path.join(pkgTempDir, 'Applications');
      if (!fs.existsSync(pkgAppsDir)) {
        fs.mkdirSync(pkgAppsDir, { recursive: true });
      }

      // Copy the .app to the Applications folder
      execSync(`cp -R "${appPath}/"* "${pkgAppsDir}/"`, { stdio: 'inherit' });

      // Create the PKG file
      execSync(`pkgbuild --root "${pkgTempDir}" --identifier "com.calculator.advanced" --version "1.0.0" "${outputDir}/高级计算器-M1.pkg"`, { stdio: 'inherit' });

      // Clean up temp directory
      fs.rmSync(pkgTempDir, { recursive: true, force: true });

      console.log(`${colors.green}PKG 安装包创建完成${colors.reset}`);
    } catch (err) {
      console.error(`${colors.red}PKG 安装包创建失败: ${err.message}${colors.reset}`);
    }
  }

  console.log(`${colors.blue}===== 构建成功完成 =====${colors.reset}`);
  console.log(`${colors.green}安装包保存在 ${outputDir} 目录${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}应用构建失败: ${err.message}${colors.reset}`);
  process.exit(1);
}
