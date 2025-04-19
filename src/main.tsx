import React, { useEffect, memo } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
// 导入本地模块作为备用
import * as tauriLocal from "./tauri-api";

// Memoize the App component to prevent unnecessary re-renders
const MemoizedApp = memo(App);

// Memory optimization function
const optimizeMemory = async () => {
  try {
    if (window.__TAURI__) {
      // 直接使用本地模块
      tauriLocal.invoke("clear_memory").catch(console.error);
    }
  } catch (error) {
    console.log("Tauri API not available", error);
  }
};

// Create the root component with memory optimization
const Root = () => {
  useEffect(() => {
    // Schedule memory cleanup every 60 seconds
    const interval = setInterval(optimizeMemory, 60000);
    return () => clearInterval(interval);
  }, []);

  return <MemoizedApp />;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
