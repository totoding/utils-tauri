use sqlx::FromRow;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Project {
    pub id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateProject {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct UpdateProject {
    pub name: Option<String>,
    pub description: Option<String>,
}

impl Project {
    pub fn new(name: String, description: Option<String>) -> Self {
        Self {
            id: None,
            name,
            description,
            created_at: None,
            updated_at: None,
            deleted_at: None,
        }
    }

    pub fn from_create(create: CreateProject) -> Self {
        Self::new(create.name, create.description)
    }
}