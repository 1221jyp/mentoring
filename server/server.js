// server.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRoutes = require("./services/routes");
const authRoutes = require("./services/auth");
const cookieParser = require("cookie-parser");
const sessionMiddleware = require("./services/session");

const cors = require("cors");
app.use(cors()); // 모든 도메인에서 오는 요청을 허용

//env 환경변수 가져오기
const path = require("path");
const dotenv = require("dotenv");
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

app.use(cookieParser("secret"));

app.use(sessionMiddleware);

// body-parser 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 로그인 및 회원가입 라우트 설정
app.use("/", authRoutes); // auth.js에서 정의한 라우트를 사용

// 기존의 apiRoutes 설정
app.use("/", apiRoutes);

// 정적 파일 제공
const buildPath = path.join(__dirname, "build"); // 또는 "/app/build"
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(5700, () => {
  console.log("Server running in port 5700");
});
