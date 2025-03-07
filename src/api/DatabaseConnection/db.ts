import { Client } from 'pg';
import {
  DB_HOST
  , DB_PORT
  , DB_USER
  , DB_PASSWORD
  , DB_NAME
} from '../../config';

const client = new Client({
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Allows self-signed certs
  },
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Database connection error', err.stack));

export default client;
