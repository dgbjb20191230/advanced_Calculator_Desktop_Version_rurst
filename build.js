#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}=== 高级计算器构建脚本 ====${colors.reset}`);
console.log(`${colors.yellow}准备构建32位和64位Windows应用${colors.reset}`);

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

// Build both 32-bit and 64-bit versions
try {
  // 64-bit build
  console.log(`${colors.yellow}构建64位Windows应用...${colors.reset}`);
  execSync('yarn tauri build --target x86_64-pc-windows-msvc', { stdio: 'inherit' });
  console.log(`${colors.green}64位Windows应用构建完成${colors.reset}`);
  
  // 32-bit build
  console.log(`${colors.yellow}构建32位Windows应用...${colors.reset}`);
  execSync('yarn tauri build --target i686-pc-windows-msvc', { stdio: 'inherit' });
  console.log(`${colors.green}32位Windows应用构建完成${colors.reset}`);
  
  // Create output directory
  const outputDir = path.join(__dirname, 'releases');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Copy installers to output directory
  const tauriDir = path.join(__dirname, 'src-tauri', 'target');
  
  // Copy both 32-bit and 64-bit MSI and NSIS installers
  fs.readdirSync(tauriDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && (dirent.name.includes('i686') || dirent.name.includes('x86_64')))
    .forEach(dirent => {
      const releaseDir = path.join(tauriDir, dirent.name, 'release', 'bundle');
      
      if (fs.existsSync(releaseDir)) {
        fs.readdirSync(releaseDir, { withFileTypes: true })
          .filter(file => !file.isDirectory() && (file.name.endsWith('.msi') || file.name.endsWith('.exe')))
          .forEach(file => {
            const sourcePath = path.join(releaseDir, file.name);
            const targetPath = path.join(outputDir, file.name);
            
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`${colors.green}安装程序已复制到: ${targetPath}${colors.reset}`);
          });
      }
    });
  
  console.log(`${colors.blue}===== 构建成功完成 =====${colors.reset}`);
  console.log(`${colors.green}安装包保存在 ${outputDir} 目录${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}应用构建失败: ${err.message}${colors.reset}`);
  process.exit(1);
} 