import { invoke } from "@tauri-apps/api/core";

// 在这里集中声明所有 Rust 命令的参数和返回类型
export type Commands = {
  close_window: { args: {}; result: void };
  min_size_window: { args: {}; result: void };
};

export type AppError = {
  code: string;
  message: string;
  cause?: unknown;
};

// 统一的调用入口：类型、安全、错误处理
async function call<C extends keyof Commands>(
  cmd: C,
  args: Commands[C]["args"]
): Promise<Commands[C]["result"]> {
  try {
    const res = await invoke<Commands[C]["result"]>(
      cmd as string,
      args as Record<string, unknown>
    );
    return res;
  } catch (err: any) {
    const e: AppError = {
      code: err?.code ?? "INVOKE_ERROR",
      message: err?.message ?? "调用失败",
      cause: err,
    };
    // TODO: 这里可以统一上报/打点
    throw e;
  }
}

// 对外暴露语义化 API
export const api = {
  closeWindow: () => call("close_window", {}),
  minSizeWindow: () => call("min_size_window", {}),
};