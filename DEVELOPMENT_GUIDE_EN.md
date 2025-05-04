## Environment Setup
### 1. Prerequisites
- Node.js >= 16.x
- Yarn >= 1.x
- Rust (recommended: install via rustup)
  - For Windows: Add Windows 32/64-bit targets
  - For macOS: Supports both Intel and Apple Silicon (M1+)
- Supported OS:
  - Windows 7/8/10/11
  - macOS 11.0+ (Big Sur and newer)
  - Linux system


## Build & Release
### 1. Production Build
```bash
yarn build
```
- Frontend code outputs to `dist/`.

### 2. Desktop Packaging
```bash
yarn tauri build
```
- Generates executables and installers, output in `src-tauri/target/`.

### 3. Windows Multi-platform Packaging
```bash
yarn build:all
```
Or run the batch script:
```bash
./build-windows.bat
```
- Automatically generates 32/64-bit installers, portable (zip), output in `releases/`.

### 4. Create Windows Portable Version
```bash
./create-portable.bat
```
- Generates portable (no-install) version and zip archive.

### 5. macOS Packaging (Apple Silicon M1+)
```bash
yarn build:mac
```
- Builds the application for Apple Silicon (M1, M2, M3+) Macs
- Creates both .dmg (disk image) and .pkg (installer package) files
- Output files are saved in the `releases/macos/` directory

### 6. macOS Manual Build
```bash
# Build for Apple Silicon (M1+)
yarn tauri build --target aarch64-apple-darwin

# Build for Intel Macs (if needed)
yarn tauri build --target x86_64-apple-darwin
```

### 7. Linux Packaging
```bash
yarn build:linux
```
- Builds the application for Linux (x86_64)
- Creates both .AppImage and .deb (Debian package) files
- Output files are saved in the `releases/linux/` directory

### 8. Linux Manual Build
```bash
yarn build:linux-direct
```
or
```bash
yarn tauri build --target x86_64-unknown-linux-gnu
```

### 9. Linux Package Locations
The Linux packages are stored in the following locations:
- AppImage: `src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/appimage/`
- Debian package: `src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/deb/`
- Copied packages: `releases/linux/`

### 10. Installing Linux Packages
```bash
# Install .deb package (Debian/Ubuntu)
sudo apt install ./src-tauri/target/release/bundle/deb/jsqyyCalculator_1.0.0_amd64.deb

# Or use dpkg to install
sudo dpkg -i ./src-tauri/target/release/bundle/deb/jsqyyCalculator_1.0.0_amd64.deb
# If there are dependency issues, run
sudo apt-get install -f

# Install .rpm package (Fedora/CentOS)
sudo rpm -i ./src-tauri/target/release/bundle/rpm/jsqyyCalculator-1.0.0-1.x86_64.rpm

# Run AppImage
chmod +x ./src-tauri/target/release/bundle/appimage/jsqyyCalculator_1.0.0_amd64.AppImage
./src-tauri/target/release/bundle/appimage/jsqyyCalculator_1.0.0_amd64.AppImage

## FAQ & Suggestions
- Before packaging for Windows, ensure Rust toolchain is installed and Windows targets are added:
  ```bash
  rustup target add i686-pc-windows-msvc x86_64-pc-windows-msvc
  ```
- Before packaging for macOS, ensure the Apple Silicon target is added:
  ```bash
  rustup target add aarch64-apple-darwin
  ```
  For Intel Macs (if needed):
  ```bash
  rustup target add x86_64-apple-darwin
  ```
- For Linux packaging, ensure necessary system dependencies are installed:
  ```bash
  sudo apt update
  sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
  ```
- Use yarn for dependency installation to avoid npm compatibility issues.
- If packaging fails, try removing `dist/`, `src-tauri/target/`, `releases/` and rebuilding.
- To customize app icon, name, etc., edit `src-tauri/tauri.conf.json`.
- For macOS packaging, the build script creates both .dmg (disk image) and .pkg (installer) formats.
- The project is extensible (scientific functions, history export, etc.).
- Clean code structure, suitable for team collaboration and future maintenance.
```