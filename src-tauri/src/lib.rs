// Advanced Calculator - Rust backend
// Optimized for low memory usage and small binary size

// Memory optimization settings
#[global_allocator]
static GLOBAL: std::alloc::System = std::alloc::System;

// No operation needed from Rust side since the calculator logic is in JavaScript
// This keeps the binary size small

#[tauri::command]
fn clear_memory() {
    // Force a garbage collection to free up memory
    #[cfg(target_os = "windows")]
    unsafe {
        winapi::um::winbase::SetProcessWorkingSetSize(
            winapi::um::processthreadsapi::GetCurrentProcess(),
            usize::MAX,
            usize::MAX,
        );
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let context = tauri::generate_context!();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![clear_memory])
        .setup(|_app| {
            // Set DPI awareness for better scaling on Windows
            #[cfg(target_os = "windows")]
            unsafe {
                winapi::um::shellscalingapi::SetProcessDpiAwareness(
                    winapi::um::shellscalingapi::PROCESS_PER_MONITOR_DPI_AWARE,
                );
            }
            
            Ok(())
        })
        .run(context)
        .expect("Error while running calculator application");
}
