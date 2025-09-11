use tauri::State;
use sqlx::PgPool;

use crate::models::project::{CreateProject, Project};

#[tauri::command]
pub async fn create_project(payload: CreateProject, pool: State<'_, PgPool>) -> Result<Project, String> {
    let result = sqlx::query_as!(
        Project,
        "INSERT INTO projects (name, description) 
        VALUES ($1, $2) 
        RETURNING id, name, description, created_at, updated_at",
        payload.name,
        payload.description 
    )
    .fetch_one(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    Ok(result)
}

#[tauri::command]
pub async fn list_projects(pool: State<'_, PgPool>) -> Result<Vec<Project>, String> {
    let projects = sqlx::query_as!(
        Project,
        "SELECT id, name, description, created_at, updated_at FROM projects WHERE deleted_at IS NULL"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    Ok(projects)
}