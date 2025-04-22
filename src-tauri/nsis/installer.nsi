!include MUI2.nsh
!include FileFunc.nsh

!define MANUFACTURER "高级计算器"
!define PRODUCTNAME "高级计算器"
!define DESCRIPTION "高级科学计算器应用"
!define VERSIONMAJOR 1
!define VERSIONMINOR 0
!define VERSIONBUILD 0

!define MUI_ICON "..\icons\icon.ico"
!define MUI_UNICON "..\icons\icon.ico"

!define MUI_WELCOMEFINISHPAGE_BITMAP "welcome.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "welcome.bmp"

!define MUI_ABORTWARNING
!define MUI_UNABORTWARNING

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "SimpChinese"

Name "${PRODUCTNAME}"
OutFile "${PRODUCTNAME}-${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}-setup.exe"
InstallDir "$LOCALAPPDATA\${PRODUCTNAME}"
InstallDirRegKey HKCU "Software\${PRODUCTNAME}" ""

ShowInstDetails show
ShowUnInstDetails show

Section "MainSection" SEC01
    SetOutPath "$INSTDIR"
    SetOverwrite on
    File /r "{{src}}\*"
    
    CreateDirectory "$SMPROGRAMS\${PRODUCTNAME}"
    CreateShortCut "$SMPROGRAMS\${PRODUCTNAME}\${PRODUCTNAME}.lnk" "$INSTDIR\${PRODUCTNAME}.exe"
    CreateShortCut "$DESKTOP\${PRODUCTNAME}.lnk" "$INSTDIR\${PRODUCTNAME}.exe"
    
    WriteRegStr HKCU "Software\${PRODUCTNAME}" "" "$INSTDIR"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCTNAME}" "DisplayName" "${PRODUCTNAME}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCTNAME}" "UninstallString" "$INSTDIR\uninstall.exe"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCTNAME}" "DisplayIcon" "$INSTDIR\${PRODUCTNAME}.exe"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCTNAME}" "Publisher" "${MANUFACTURER}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCTNAME}" "DisplayVersion" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
    
    WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section Uninstall
    Delete "$INSTDIR\uninstall.exe"
    
    RMDir /r "$INSTDIR"
    
    Delete "$SMPROGRAMS\${PRODUCTNAME}\${PRODUCTNAME}.lnk"
    Delete "$DESKTOP\${PRODUCTNAME}.lnk"
    RMDir "$SMPROGRAMS\${PRODUCTNAME}"
    
    DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCTNAME}"
    DeleteRegKey HKCU "Software\${PRODUCTNAME}"
SectionEnd
