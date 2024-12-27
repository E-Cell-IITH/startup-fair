import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Startup } from "./entity/Startup";
import { Investment } from "./entity/Investment";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User, Startup, Investment],
    subscribers: [],
    migrations: [],
})