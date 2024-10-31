import sql  from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: false // change to true for local dev / self-signed certs
    }
  }

  function query(query: string) {
    // sql.connect() will return the existing global pool if it exists or create a new one if it doesn't
    return sql.connect(sqlConfig as any).then((pool) => {
      return  pool.query(query)
    })
  }

export { query }