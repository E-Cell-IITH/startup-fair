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

INSERT_QUERY = `INSERT INTO users (id, name, email_id, password, amount) VALUES ($1, $2, $3, $4, $5)`

const users = [
    ['1', 'Shiven', 'x' + '@gmail.com', bcrypt.hashSync('password', 10), 1000],
    ['2', 'Aman', 'y' + '@gmail.com', bcrypt.hashSync('password', 10), 1000],
    ['3', 'Anushka', 'z' + '@gmail.com', bcrypt.hashSync('password', 10), 1000],
]

Promise.all(users.map(async (user) => {
    db.none(INSERT_QUERY, user).then(() => {
        console.log("User added!", user[1])
    }).catch((err) => {
        console.log("Error occured:!", err)
    })
})).finally(() => {
    pgp.end()
})

