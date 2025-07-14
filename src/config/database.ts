import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

import * as Models from '../models'; // import semua export dari models/index.ts

dotenv.config();

const modelList = Object.values(Models).filter(m => typeof m === 'function'); 
// filter supaya yang bukan class model gak masuk

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: modelList,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});
