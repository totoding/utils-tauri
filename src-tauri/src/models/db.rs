use sqlx::PgPool;

pub struct Db {
    pub(crate) pool: PgPool,
}

impl Db {
    pub async fn new() -> Result<Self, sqlx::Error> {
        dotenvy::dotenv().ok();
        let database_url = dotenvy::var("DATABASE_URL")
            .map_err(|_| sqlx::Error::Configuration("DATABASE_URL not found".into()))?;
        let pool = PgPool::connect(&database_url).await?;

        Ok(Db { pool })
    }

    pub fn get_pool(&self) -> &PgPool {
        &self.pool
    }
}
