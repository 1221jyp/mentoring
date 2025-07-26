// server.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRoutes = require("./services/routes");
const authRoutes = require("./services/auth");
const cookieParser = require("cookie-parser");
const sessionMiddleware = require("./services/session");

const cors = require("cors");
const axios = require("axios");
const cron = require("node-cron");
const {
  calculateAndStoreDailyAverageRgb,
  calculateAndStoreAllDaysAverageRgb,
} = require("./services/dailyAverage");

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

// ML 서버와 통신하는 새로운 API 엔드포인트
app.post("/api/predict-color", async (req, res) => {
  try {
    const mlServerResponse = await axios.post("http://host.docker.internal:5001/predict", req.body);
    res.json(mlServerResponse.data);
  } catch (error) {
    console.error("Error communicating with ML server:", error.message);
    res.status(500).json({ error: "Failed to get prediction from ML server." });
  }
});

// 새로운 ML 예측 API 엔드포인트
app.post("/api/get-predicted-color", async (req, res) => {
  try {
    const { challenge_color } = req.body; // 클라이언트로부터 challenge_color를 받음

    if (!challenge_color || !Array.isArray(challenge_color) || challenge_color.length !== 3) {
      return res.status(400).json({ error: "Invalid challenge_color provided. It must be an array of 3 RGB values." });
    }

    // ml_server의 /predict 엔드포인트로 요청을 보냄
    const mlServerResponse = await axios.post("http://host.docker.internal:5001/predict", {
      challenge_color: challenge_color,
    });

    res.json(mlServerResponse.data); // ml_server의 응답을 클라이언트에게 전달
  } catch (error) {
    console.error("Error getting prediction from ML server:", error.message);
    res.status(500).json({ error: "Failed to get prediction from ML server." });
  }
});

// 정적 파일 제공
const buildPath = path.join(__dirname, "build"); // 또는 "/app/build"
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Schedule the daily average calculation
cron.schedule(
  "0 1 * * *",
  () => {
    console.log("Running daily average RGB calculation...");
    calculateAndStoreDailyAverageRgb();
  },
  {
    scheduled: true,
    timezone: "Asia/Seoul",
  }
);

// 서버 시작 시 실행
// 오늘의 평균을 계산/업데이트합니다.
calculateAndStoreDailyAverageRgb();
// 모든 과거 데이터 중 누락된 평균을 계산합니다.
calculateAndStoreAllDaysAverageRgb();

app.listen(5700, () => {
  console.log("Server running in port 5700");
});
