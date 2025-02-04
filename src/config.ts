import * as dotenv from "dotenv";

const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

//  API
export const API_PORT       = Number(process.env.API_PORT);

//  Database
export const DB_HOST        = process.env.DB_HOST;
export const DB_PORT        = process.env.DB_PORT;
export const DB_USER        = process.env.DB_USER;
export const DB_PASSWORD    = process.env.DB_PASSWORD;
export const DB_NAME        = process.env.DB_NAME;

//  JWT
export const JWT_SECRET     = process.env.JWT_SECRET;
