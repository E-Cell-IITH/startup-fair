require('dotenv').config()

const pgp = require('pg-promise')()
const db = pgp(process.env.DATABASE_URL)

DROP_TABLES = 'DROP TABLE IF EXISTS startup, users;'
CREATE_TABLES = `
        CREATE TABLE startup (
            "id" VARCHAR(255) NOT NULL ,
            "name" VARCHAR(255) NOT NULL,
            "amount" INTEGER NOT NULL,
            PRIMARY KEY ("id")
        );
        CREATE TABLE users (
            "id" VARCHAR(255) NOT NULL  ,
            "name" VARCHAR(255) NOT NULL,
            "email_id" VARCHAR(255) NOT NULL,
            "amount" INTEGER NOT NULL,
            PRIMARY KEY ("id")
        );`

db.none(DROP_TABLES).then(() => {
    console.log("Removed old tables!")
    return db.none(CREATE_TABLES)
}).then(() => {
    console.log("Created new tables!")
}).catch((err) => {
    console.log("Error occured:!", err)
}).finally(() => {
    pgp.end()
})