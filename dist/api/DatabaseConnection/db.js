"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("../../config");
const client = new pg_1.Client({
    host: config_1.DB_HOST,
    port: parseInt(config_1.DB_PORT || '5432'),
    user: config_1.DB_USER,
    password: config_1.DB_PASSWORD,
    database: config_1.DB_NAME,
});
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err) => console.error('Database connection error', err.stack));
exports.default = client;
