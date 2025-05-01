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

console.log(`${colors.blue}=== Advanced Calculator Linux Build Script ====${colors.reset}`);
console.log(`${colors.yellow}Preparing to build Linux application${colors.reset}`);

// Clean existing build artifacts
try {
  console.log(`${colors.yellow}Cleaning old build files...${colors.reset}`);

  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }

  if (fs.existsSync('./src-tauri/target')) {
    fs.rmSync('./src-tauri/target', { recursive: true, force: true });
  }

  console.log(`${colors.green}Cleaning completed${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}Cleaning error: ${err.message}${colors.reset}`);
}

// Build frontend
try {
  console.log(`${colors.yellow}Building frontend...${colors.reset}`);
  execSync('yarn build', { stdio: 'inherit' });
  console.log(`${colors.green}Frontend build completed${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}Frontend build failed: ${err.message}${colors.reset}`);
  process.exit(1);
}

// Build Linux application
try {
  console.log(`${colors.yellow}Building Linux application...${colors.reset}`);
  execSync('yarn tauri build', { stdio: 'inherit' });
  console.log(`${colors.green}Linux application build completed${colors.reset}`);

  // Create output directory
  const outputDir = path.join(__dirname, 'releases', 'linux');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Copy installers to output directory
  const tauriDir = path.join(__dirname, 'src-tauri', 'target', 'release', 'bundle');

  // Copy Linux packages (deb, AppImage)
  if (fs.existsSync(tauriDir)) {
    ['deb', 'appimage'].forEach(format => {
      const formatDir = path.join(tauriDir, format);
      if (fs.existsSync(formatDir)) {
        fs.readdirSync(formatDir, { withFileTypes: true })
          .filter(file => !file.isDirectory())
          .forEach(file => {
            const sourcePath = path.join(formatDir, file.name);
            const targetPath = path.join(outputDir, file.name);

            fs.copyFileSync(sourcePath, targetPath);
            console.log(`${colors.green}Installer copied to: ${targetPath}${colors.reset}`);
          });
      } else {
        console.log(`${colors.yellow}No ${format} packages found${colors.reset}`);
      }
    });
  }

  console.log(`${colors.blue}===== Build successfully completed =====${colors.reset}`);
  console.log(`${colors.green}Packages saved in ${outputDir} directory${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}Application build failed: ${err.message}${colors.reset}`);
  process.exit(1);
}
