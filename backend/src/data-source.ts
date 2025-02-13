import { DataSource } from "typeorm";
import { User } from "./entity/User.js";
import { Startup } from "./entity/Startup.js";
import { Equity } from "./entity/Investment.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Startup, Equity],
    subscribers: [],
    migrations: [],
})