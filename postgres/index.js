const { Pool } = require('pg')

export const pg = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 20
})