@echo off
REM === 自动上传打包文件到 GitHub Release ===
REM 依赖：已安装 GitHub CLI (gh)，并已 gh auth login 登录
REM 用法：双击运行，或在命令行运行 upload-release.bat

REM === 配置区 ===
set VERSION=v1.0.0
set TITLE=Advanced Calculator v1.0.0
set NOTES=自动发布说明：高级计算器 Windows 版本自动上传
set FILES=releases\*.exe releases\*.zip releases\*.msi
REM === END ===

REM 检查 gh 是否安装
where gh >nul 2>nul
if %errorlevel% neq 0 (
  echo [错误] 未检测到 gh (GitHub CLI)。请先安装：https://cli.github.com/
  pause
  exit /b 1
)

REM 检查是否已登录
call gh auth status >nul 2>nul
if %errorlevel% neq 0 (
  echo [错误] gh 未登录，请先运行 gh auth login 完成授权。
  pause
  exit /b 1
)

REM 创建 Release 并上传文件

gh release create %VERSION% %FILES% --title "%TITLE%" --notes "%NOTES%"

if %errorlevel% neq 0 (
  echo [错误] 上传 Release 失败，请检查版本号、文件路径或网络。
  pause
  exit /b 1
)

echo [成功] 已自动上传 Release v%VERSION%！
pause
