@echo off
chcp 65001
echo ===== 高级计算器 Windows 构建脚本 =====
echo 准备构建多种格式的 Windows 应用

REM 添加编译目标
echo 添加编译目标...
call rustup target add i686-pc-windows-msvc x86_64-pc-windows-msvc
if %ERRORLEVEL% neq 0 (
  echo 添加编译目标失败!
  exit /b 1
)
echo 编译目标添加成功

REM 清理旧的构建文件
echo 清理旧的构建文件...
if exist dist (
  rmdir /s /q dist
)
if exist src-tauri\target (
  rmdir /s /q src-tauri\target
)
if exist releases (
  rmdir /s /q releases
)
echo 清理完成

REM 创建必要的目录
mkdir releases
mkdir releases\64位
mkdir releases\32位
mkdir releases\便携版

REM 构建前端
echo 构建前端...
call yarn build
if %ERRORLEVEL% neq 0 (
  echo 前端构建失败!
  exit /b 1
)
echo 前端构建完成

REM 构建 64 位 Windows 应用
echo 构建 64 位 Windows 应用...
call yarn tauri build --target x86_64-pc-windows-msvc
if %ERRORLEVEL% neq 0 (
  echo 64 位 Windows 应用构建失败!
  exit /b 1
)
echo 64 位 Windows 应用构建完成

REM 构建 32 位 Windows 应用
echo 构建 32 位 Windows 应用...
call yarn tauri build --target i686-pc-windows-msvc
if %ERRORLEVEL% neq 0 (
  echo 32 位 Windows 应用构建失败!
  exit /b 1
)
echo 32 位 Windows 应用构建完成

REM 复制所有打包文件
echo 正在复制安装文件...

REM 复制 64 位文件
echo 复制 64 位安装包...
for %%F in (src-tauri\target\x86_64-pc-windows-msvc\release\bundle\msi\*.msi) do (
  copy "%%F" "releases\64位\%%~nF.msi"
  echo 已复制: %%~nF.msi
)

for %%F in (src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\*.exe) do (
  copy "%%F" "releases\64位\%%~nF.exe"
  echo 已复制: %%~nF.exe
)

REM 复制 ZIP 和其他格式 (如果存在)
if exist src-tauri\target\x86_64-pc-windows-msvc\release\bundle\zip (
  for %%F in (src-tauri\target\x86_64-pc-windows-msvc\release\bundle\zip\*.zip) do (
    copy "%%F" "releases\便携版\%%~nF-64位.zip"
    echo 已复制: %%~nF-64位.zip
  )
)

if exist src-tauri\target\x86_64-pc-windows-msvc\release\bundle\appx (
  for %%F in (src-tauri\target\x86_64-pc-windows-msvc\release\bundle\appx\*.appx) do (
    copy "%%F" "releases\64位\%%~nF.appx"
    echo 已复制: %%~nF.appx
  )
)

REM 复制 32 位文件
echo 复制 32 位安装包...
for %%F in (src-tauri\target\i686-pc-windows-msvc\release\bundle\msi\*.msi) do (
  copy "%%F" "releases\32位\%%~nF.msi"
  echo 已复制: %%~nF.msi
)

for %%F in (src-tauri\target\i686-pc-windows-msvc\release\bundle\nsis\*.exe) do (
  copy "%%F" "releases\32位\%%~nF.exe"
  echo 已复制: %%~nF.exe
)

REM 复制 ZIP 和其他格式 (如果存在)
if exist src-tauri\target\i686-pc-windows-msvc\release\bundle\zip (
  for %%F in (src-tauri\target\i686-pc-windows-msvc\release\bundle\zip\*.zip) do (
    copy "%%F" "releases\便携版\%%~nF-32位.zip"
    echo 已复制: %%~nF-32位.zip
  )
)

if exist src-tauri\target\i686-pc-windows-msvc\release\bundle\appx (
  for %%F in (src-tauri\target\i686-pc-windows-msvc\release\bundle\appx\*.appx) do (
    copy "%%F" "releases\32位\%%~nF.appx"
    echo 已复制: %%~nF.appx
  )
)

REM 创建便携版（如果 ZIP 文件不存在）
echo 创建便携版...
if not exist releases\便携版\*.zip (
  echo 正在创建 64 位便携版...
  if exist src-tauri\target\x86_64-pc-windows-msvc\release\高级计算器.exe (
    mkdir releases\便携版\高级计算器-64位
    copy src-tauri\target\x86_64-pc-windows-msvc\release\高级计算器.exe releases\便携版\高级计算器-64位\
    echo 已创建: 高级计算器-64位
  )
  
  echo 正在创建 32 位便携版...
  if exist src-tauri\target\i686-pc-windows-msvc\release\高级计算器.exe (
    mkdir releases\便携版\高级计算器-32位
    copy src-tauri\target\i686-pc-windows-msvc\release\高级计算器.exe releases\便携版\高级计算器-32位\
    echo 已创建: 高级计算器-32位
  )
)

REM 创建版本信息文件
echo 创建版本信息文件...
echo 高级计算器 v1.0.0 > releases\版本信息.txt
echo 构建日期: %date% %time% >> releases\版本信息.txt
echo 支持的操作系统: Windows 7/8/10/11 (32位和64位) >> releases\版本信息.txt
echo. >> releases\版本信息.txt
echo 文件说明: >> releases\版本信息.txt
echo - 64位文件夹: 适用于64位 Windows 系统的安装包 >> releases\版本信息.txt
echo - 32位文件夹: 适用于32位 Windows 系统的安装包 >> releases\版本信息.txt
echo - 便携版文件夹: 免安装便携版应用 >> releases\版本信息.txt
echo. >> releases\版本信息.txt
echo 高级计算器团队 © 2025 >> releases\版本信息.txt

echo ===== 构建成功完成 =====
echo 所有安装包已保存在 releases 目录
echo 64位安装包: releases\64位\
echo 32位安装包: releases\32位\
echo 便携版: releases\便携版\
pause 