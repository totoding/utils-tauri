use tauri::Manager;

mod commands;
mod models;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                match models::db::Db::new().await {
                    Ok(db) => {
                        let pool = db.get_pool().clone();
                        app_handle.manage(models::db::Db { pool });
                    }
                    Err(e) => {
                        eprintln!("数据库初始化失败: {}", e);
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::system::min_size_window,
            commands::system::close_window,
            commands::project::create_project,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
