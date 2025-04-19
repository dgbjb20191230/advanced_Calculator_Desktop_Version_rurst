// 替代 Tauri API 模块，当真实模块不可用时使用
export async function invoke(command: string, args?: Record<string, unknown>): Promise<any> {
  console.log(`Mock invoke: ${command}`, args);
  return Promise.resolve(null);
} 