require('dotenv').config()

const bcrypt = require('bcrypt')
const pgp = require('pg-promise')()
const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  })

INSERT_QUERY = `INSERT INTO startup (id, name, amount) VALUES ($1, $2, $3)`

const startups = [
    ['phonepe', 'PhonePe', 0],
    ['boom', 'Big Boom', 100],
    ['amazon', 'Amazon', 20],
]

Promise.all(startups.map(async (startup) => {
    db.none(INSERT_QUERY, startup).then(() => {
        console.log("Startup added!", startup[1])
    }).catch((err) => {
        console.log("Error occured:!", err)
    })
})).finally(() => {
    pgp.end()
})

