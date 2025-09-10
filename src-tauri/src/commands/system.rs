use tauri::Manager;

#[tauri::command]
pub async fn min_size_window(
    app: tauri::AppHandle,
) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or("无法找到主窗口")?;
      
    window.minimize()
        .map_err(|e| format!("最小化窗口失败: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn close_window(app: tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or("无法找到主窗口")?;
    
    window
        .close()
        .map_err(|e| format!("关闭窗口失败: {}", e))?;
    
    Ok(())
}