// services/auth.js
const express = require("express");
const axios = require("axios");
const connection = require("../db");
const router = express.Router();

//env 환경변수 가져오기
const path = require("path");
const dotenv = require("dotenv");
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN_REDIRECT_URI = process.env.GOOGLE_LOGIN_REDIRECT_URI;
const GOOGLE_SIGNUP_REDIRECT_URI = process.env.GOOGLE_SIGNUP_REDIRECT_URI;
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

// 로그인 기능
router.get("/login", (req, res) => {
  // 로그인 전에 현재 URL을 세션에 저장
  req.session.redirectTo = req.query.redirectTo || "/"; // 기본적으로 '/'로 리다이렉트

  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`;
  url += "&response_type=code";
  url += "&scope=email profile";
  res.redirect(url);
});

router.get("/signup", (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_SIGNUP_REDIRECT_URI}`;
  url += "&response_type=code";
  url += "&scope=email profile";
  res.redirect(url);
});

// 리다이렉트 주소 설정
router.get("/login/redirect", async (req, res) => {
  const { code } = req.query;
  console.log(`code: ${code}`);

  try {
    // access_token 가져오기
    const resp = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_LOGIN_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    // 사용자 정보 가져오기
    const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${resp.data.access_token}`,
      },
    });

    const { id: googleId, email, name, picture } = resp2.data;

    // DB에 사용자 정보 저장
    const query =
      "INSERT INTO users (id, email, name, picture) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING";
    const values = [googleId, email, name, picture];

    connection.query(query, values, (error) => {
      if (error) {
        console.error("로그인 DB 저장 오류:", error);
        return res.status(500).send("Internal Server Error");
      }

      // 세션에 사용자 정보 저장
      req.session.user = { id: googleId, email, name, picture };
      console.log("로그인 발생 :", req.session.user);

      // 로그인 후 원래 요청한 URL로 리다이렉트
      const redirectTo = req.session.redirectTo || "/";
      delete req.session.redirectTo; // 리다이렉션 후 세션에서 URL을 제거
      res.redirect(redirectTo);
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 회원가입 리다이렉트 처리
router.get("/signup/redirect", async (req, res) => {
  const { code } = req.query;

  try {
    // access_token 가져오기
    const resp = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    // 사용자 정보 가져오기
    const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${resp.data.access_token}`,
      },
    });

    const { id: googleId, email, name, picture } = resp2.data; // 프로필 사진 URL을 가져옴

    // DB에 사용자 정보 저장
    const query =
      "INSERT INTO users (id, email, name, picture) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING";
    const values = [googleId, email, name, picture];

    connection.query(query, values, (error) => {
      if (error) {
        console.error("회원가입 DB 저장 오류:", error);
        return res.status(500).send("Internal Server Error");
      }
      // 성공적으로 저장된 경우 사용자 정보 반환
      res.json(resp2.data);
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 로그인 상태 확인
router.get("/api/check-login", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// 로그아웃 처리
router.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("로그아웃 실패");
    }
    res.send("로그아웃 성공");
  });
});

module.exports = router;
