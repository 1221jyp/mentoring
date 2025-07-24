// db.js
const { Pool } = require("pg");

//env 환경변수 가져오기
const path = require("path");
const dotenv = require("dotenv");
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

const connection = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

connection.connect((err) => {
  if (err) {
    console.error("데이터베이스 연결 실패: " + err.stack);
    return;
  }
  console.log("데이터베이스 연결 성공.");
});

module.exports = connection;
