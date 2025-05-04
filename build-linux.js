#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
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

console.log(`${colors.blue}=== 高级计算器 Linux 构建脚本 ====${colors.reset}`);
console.log(`${colors.yellow}准备构建 Linux 应用${colors.reset}`);

// Clean existing build artifacts
try {
  console.log(`${colors.yellow}清理旧的构建文件...${colors.reset}`);
  
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }
  
  // Only clean Linux target to preserve other builds
  if (fs.existsSync('./src-tauri/target/x86_64-unknown-linux-gnu')) {
    fs.rmSync('./src-tauri/target/x86_64-unknown-linux-gnu', { recursive: true, force: true });
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

// Build Linux app
try {
  console.log(`${colors.yellow}构建 Linux 应用...${colors.reset}`);
  execSync('yarn tauri build --target x86_64-unknown-linux-gnu', { stdio: 'inherit' });
  console.log(`${colors.green}Linux 应用构建完成${colors.reset}`);
  
  // Create output directory
  const outputDir = path.join(__dirname, 'releases', 'linux');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Copy the Linux bundles to the output directory
  const tauriDir = path.join(__dirname, 'src-tauri', 'target', 'x86_64-unknown-linux-gnu', 'release', 'bundle');
  
  if (fs.existsSync(tauriDir)) {
    // Copy AppImage
    const appImageDir = path.join(tauriDir, 'appimage');
    if (fs.existsSync(appImageDir)) {
      fs.readdirSync(appImageDir, { withFileTypes: true })
        .filter(file => !file.isDirectory() && file.name.endsWith('.AppImage'))
        .forEach(file => {
          const sourcePath = path.join(appImageDir, file.name);
          const targetPath = path.join(outputDir, file.name);
          fs.copyFileSync(sourcePath, targetPath);
          // Make AppImage executable
          fs.chmodSync(targetPath, 0o755);
          console.log(`${colors.green}AppImage 已复制到: ${targetPath}${colors.reset}`);
        });
    } else {
      console.log(`${colors.yellow}未找到 AppImage 包${colors.reset}`);
    }
    
    // Copy Debian package
    const debDir = path.join(tauriDir, 'deb');
    if (fs.existsSync(debDir)) {
      fs.readdirSync(debDir, { withFileTypes: true })
        .filter(file => !file.isDirectory() && file.name.endsWith('.deb'))
        .forEach(file => {
          const sourcePath = path.join(debDir, file.name);
          const targetPath = path.join(outputDir, file.name);
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`${colors.green}Debian 包已复制到: ${targetPath}${colors.reset}`);
        });
    } else {
      console.log(`${colors.yellow}未找到 Debian 包${colors.reset}`);
    }
  }
  
  console.log(`${colors.blue}===== 构建成功完成 =====${colors.reset}`);
  console.log(`${colors.green}安装包保存在 ${outputDir} 目录${colors.reset}`);
  console.log(`${colors.yellow}Linux 打包文件位置:${colors.reset}`);
  console.log(`${colors.yellow}1. AppImage: ${path.join(tauriDir, 'appimage')}${colors.reset}`);
  console.log(`${colors.yellow}2. Debian 包: ${path.join(tauriDir, 'deb')}${colors.reset}`);
  console.log(`${colors.yellow}3. 复制后的文件: ${outputDir}${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}应用构建失败: ${err.message}${colors.reset}`);
  process.exit(1);
}