#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 控制台颜色
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}=== 高级计算器 Windows 构建脚本 ====${colors.reset}`);
console.log(`${colors.yellow}准备构建 32 位和 64 位 Windows 应用${colors.reset}`);

// 添加编译目标
try {
  console.log(`${colors.yellow}添加编译目标...${colors.reset}`);
  execSync('rustup target add i686-pc-windows-msvc x86_64-pc-windows-msvc', { stdio: 'inherit' });
  console.log(`${colors.green}编译目标添加成功${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}添加编译目标失败: ${err.message}${colors.reset}`);
  process.exit(1);
}

// 清理旧的构建文件
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

// 构建前端
try {
  console.log(`${colors.yellow}构建前端...${colors.reset}`);
  execSync('yarn build', { stdio: 'inherit' });
  console.log(`${colors.green}前端构建完成${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}前端构建失败: ${err.message}${colors.reset}`);
  process.exit(1);
}

// 构建 64 位 Windows 应用
try {
  console.log(`${colors.yellow}构建 64 位 Windows 应用...${colors.reset}`);
  execSync('yarn tauri build --target x86_64-pc-windows-msvc', { stdio: 'inherit' });
  console.log(`${colors.green}64 位 Windows 应用构建完成${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}64 位 Windows 应用构建失败: ${err.message}${colors.reset}`);
  process.exit(1);
}

// 构建 32 位 Windows 应用
try {
  console.log(`${colors.yellow}构建 32 位 Windows 应用...${colors.reset}`);
  execSync('yarn tauri build --target i686-pc-windows-msvc', { stdio: 'inherit' });
  console.log(`${colors.green}32 位 Windows 应用构建完成${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}32 位 Windows 应用构建失败: ${err.message}${colors.reset}`);
  process.exit(1);
}

// 创建输出目录
try {
  const outputDir = path.join(__dirname, 'releases');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 复制安装文件到输出目录
  const tauriDir = path.join(__dirname, 'src-tauri', 'target');
  
  // 复制 32 位和 64 位的 MSI 和 NSIS 安装程序
  fs.readdirSync(tauriDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && (dirent.name.includes('i686') || dirent.name.includes('x86_64')))
    .forEach(dirent => {
      const releaseDir = path.join(tauriDir, dirent.name, 'release', 'bundle');
      
      if (fs.existsSync(releaseDir)) {
        const is32bit = dirent.name.includes('i686');
        const archLabel = is32bit ? '32位' : '64位';
        
        fs.readdirSync(releaseDir, { withFileTypes: true })
          .filter(file => !file.isDirectory() && (file.name.endsWith('.msi') || file.name.endsWith('.exe')))
          .forEach(file => {
            const sourcePath = path.join(releaseDir, file.name);
            // 添加位数标识到文件名
            const newFileName = file.name.replace('.', `-${archLabel}.`);
            const targetPath = path.join(outputDir, newFileName);
            
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`${colors.green}安装程序已复制到: ${targetPath}${colors.reset}`);
          });
      }
    });
  
  console.log(`${colors.blue}===== 构建成功完成 =====${colors.reset}`);
  console.log(`${colors.green}安装包保存在 ${outputDir} 目录${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}复制安装文件失败: ${err.message}${colors.reset}`);
  process.exit(1);
} 