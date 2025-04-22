@echo off
echo 正在创建高级计算器绿色版...

set OUTPUT_DIR=高级计算器_绿色版_x64
set SOURCE_EXE=src-tauri\target\release\app.exe

if not exist "%SOURCE_EXE%" (
    echo 错误：找不到可执行文件 %SOURCE_EXE%
    echo 请先运行 npm run tauri build 构建应用程序
    exit /b 1
)

if exist "%OUTPUT_DIR%" (
    echo 正在清理旧的输出目录...
    rmdir /s /q "%OUTPUT_DIR%"
)

echo 创建输出目录...
mkdir "%OUTPUT_DIR%"

echo 复制可执行文件...
copy "%SOURCE_EXE%" "%OUTPUT_DIR%\高级计算器.exe"

echo 创建说明文件...
echo 高级计算器 v1.0.0 > "%OUTPUT_DIR%\说明.txt"
echo. >> "%OUTPUT_DIR%\说明.txt"
echo 这是高级计算器的绿色版本，无需安装，直接运行高级计算器.exe即可使用。 >> "%OUTPUT_DIR%\说明.txt"
echo. >> "%OUTPUT_DIR%\说明.txt"
echo 功能特点： >> "%OUTPUT_DIR%\说明.txt"
echo - 基本计算功能 >> "%OUTPUT_DIR%\说明.txt"
echo - 科学计算功能 >> "%OUTPUT_DIR%\说明.txt"
echo - 内存操作功能 >> "%OUTPUT_DIR%\说明.txt"
echo - 历史记录功能 >> "%OUTPUT_DIR%\说明.txt"
echo. >> "%OUTPUT_DIR%\说明.txt"
echo © 2025 高级计算器应用 >> "%OUTPUT_DIR%\说明.txt"

echo 创建压缩包...
powershell -Command "Compress-Archive -Path '%OUTPUT_DIR%' -DestinationPath '%OUTPUT_DIR%.zip' -Force"

echo 完成！
echo 绿色版已创建在 %OUTPUT_DIR% 目录中
echo 压缩包已创建：%OUTPUT_DIR%.zip
