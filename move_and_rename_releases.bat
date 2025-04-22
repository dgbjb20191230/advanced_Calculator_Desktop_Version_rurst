@echo off
REM === 移动并重命名打包文件到项目根目录的 releases 文件夹 ===
REM 运行前请确保以下源文件存在

@echo off
chcp 65001 >nul
REM === 移动并重命名打包文件到项目根目录的 releases 文件夹 ===
REM 运行前请确保以下源文件存在

set "SRC_MSI=src-tauri\target\release\bundle\msi\高级计算器_1.0.0_x64_zh-CN.msi"
set "SRC_EXE=src-tauri\target\release\bundle\nsis\高级计算器_1.0.0_x64-setup.exe"
set "DST_DIR=releases"
set "DST_MSI=AdvancedCalculator_1.0.0_x64_zh-CN.msi"
set "DST_EXE=AdvancedCalculator_1.0.0_x64-setup.exe"

REM 创建 releases 目录（如不存在）
if not exist "%DST_DIR%" mkdir "%DST_DIR%"

REM 复制并重命名 MSI
if exist "%SRC_MSI%" (
  copy "%SRC_MSI%" "%DST_DIR%\%DST_MSI%" /Y
  echo [成功] 已复制 %SRC_MSI% 到 %DST_DIR%\%DST_MSI%
) else (
  echo [警告] 未找到 %SRC_MSI%
)

REM 复制并重命名 EXE
if exist "%SRC_EXE%" (
  copy "%SRC_EXE%" "%DST_DIR%\%DST_EXE%" /Y
  echo [成功] 已复制 %SRC_EXE% 到 %DST_DIR%\%DST_EXE%
) else (
  echo [警告] 未找到 %SRC_EXE%
)

pause
