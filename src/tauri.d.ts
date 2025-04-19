declare module '@tauri-apps/api/tauri' {
  export function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
}

// 全局 Window 类型扩展
declare global {
  interface Window {
    __TAURI__?: {
      invoke: typeof import('@tauri-apps/api/tauri').invoke;
      [key: string]: any;
    };
  }
}

export {}; 