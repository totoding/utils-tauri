#[tauri::command]
pub async fn create_project(name: String) -> Result<i64, String> {
    println!("Creating project: {}", name);
    Ok(123)
}

#[tauri::command]
pub async fn list_projects() -> Result<i64, String> {
    Ok(123)
}
