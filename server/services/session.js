//services/session.js

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const connection = require("../db"); // PostgreSQL 연결 객체

//env 환경변수 가져오기
const path = require("path");
const dotenv = require("dotenv");
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

const sessionMiddleware = session({
  store: new pgSession({
    pool: connection,
    tableName: "session",
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.COOKIE_SECURE === "true" }, // HTTPS 환경에서는 true로 설정
});

module.exports = sessionMiddleware;
