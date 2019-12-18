import mysql from "mysql";
import knex from "knex";

const connection = knex({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "root",
    database: "badgers"
  },
  pool: {
    min: 0
  }
});

export default connection;
