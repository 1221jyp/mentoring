//services/routes.js
const express = require("express");
const router = express.Router();
const connection = require("../db");

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

//이메일 확인 미들웨어
const emailFilterMiddleware = (req, res, next) => {
  const allowedEmails = ["1221jyp@gmail.com", "seosky1225@gmail.com"]; // 허용할 이메일 배열
  if (req.session.user && allowedEmails.includes(req.session.user.email)) {
    console.log("accepted");
    next(); // 접근 허용
  } else {
    res.status(403).send("접근이 거부되었습니다.");
  }
};

router.get("/api/protected", emailFilterMiddleware, (req, res) => {
  res.send("이 페이지에 접근할 수 있습니다.");
});

router.get("/api/enrollments", async (req, res) => {
  // 세션에 저장된 사용자 정보 확인
  if (!req.session.user || !req.session.user.email) {
    return res.status(401).send("로그인이 필요합니다."); // 로그인되지 않은 경우
  }

  const userEmail = req.session.user.email;
  console.log(userEmail);

  // 특정 이메일 확인
  if (["1221jyp@gmail.com", "seosky1225@gmail.com"].includes(userEmail)) {
    try {
      const result = await connection.query("SELECT * FROM enrollments");
      res.json(result.rows); // 모든 레코드를 JSON 형식으로 반환
    } catch (err) {
      console.error(err);
      res.status(500).send("서버 오류");
    }
  } else {
    res.status(403).send("접근 권한이 없습니다.");
  }
});

// POST 라우트
router.post("/api/enroll", (req, res) => {
  const formData = req.body;
  console.log("Received form data:", formData);

  // 세션에서 이메일을 가져옵니다
  const email = req.session.user.email; // session에서 email을 가져옴

  console.log(email);

  if (!email) {
    // 세션에 이메일이 없다면 로그인되지 않은 상태로 간주하고 처리
    return res.status(401).json({ error: "로그인 후 제출 가능합니다." });
  }

  const {
    number,
    name,
    phone,
    career,
    programmingExp,
    plan,
    additionalAnswer,
    bio,
    question,
    intervDate,
  } = formData;

  // 먼저 이메일이 존재하는지 확인
  const checkEmailQuery = "SELECT id FROM enrollments WHERE email = $1";
  const checkEmailValues = [email];

  connection.query(checkEmailQuery, checkEmailValues, (error, result) => {
    if (error) {
      console.error("Error checking email:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.rows.length > 0) {
        // 이메일이 이미 존재하면 기존 데이터를 업데이트
        const updateQuery =
          "UPDATE enrollments SET number = $1, name = $2, phone = $3, career = $4, programming_exp = $5, plan = $6, additional_answer = $7, bio = $8, question = $9, updated_at = timezone('Asia/Seoul', now()) , interview_date = $11 WHERE email = $10";

        const updateValues = [
          number,
          name,
          phone,
          career,
          programmingExp,
          plan,
          additionalAnswer,
          bio,
          question,
          email,
          intervDate,
        ];

        connection.query(updateQuery, updateValues, (updateError, updateResult) => {
          if (updateError) {
            console.error("Error updating data:", updateError);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Data updated successfully:", updateResult);
            res.status(200).json({ message: "Data updated successfully" });
          }
        });
      } else {
        // 이메일이 존재하지 않으면 새로 데이터를 삽입
        const insertQuery =
          "INSERT INTO enrollments (number, name, phone, career, programming_exp, plan, additional_answer, bio, question, email, created_at, updated_at, interview_date) " +
          "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, timezone('Asia/Seoul', now()) , timezone('Asia/Seoul', now()), $11)";

        const insertValues = [
          number,
          name,
          phone,
          career,
          programmingExp,
          plan,
          additionalAnswer,
          bio,
          question,
          email,
          intervDate,
        ];

        connection.query(insertQuery, insertValues, (insertError, insertResult) => {
          if (insertError) {
            console.error("Error inserting data:", insertError);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Data inserted successfully:", insertResult);
            res.status(200).json({ message: "Data saved successfully" });
          }
        });
      }
    }
  });
});

router.post("/api/submit-color", async (req, res) => {
  console.log("Session in /api/submit-color:", req.session);
  console.log("User in session in /api/submit-color:", req.session.user);
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  const { challengeColorHex, submittedColorHex } = req.body;
  const userId = req.session.user.id;

  if (!challengeColorHex || !submittedColorHex) {
    return res.status(400).json({ error: "문제 색상과 제출 색상이 모두 필요합니다." });
  }

  try {
    const challengeRgb = hexToRgb(challengeColorHex);
    const submittedRgb = hexToRgb(submittedColorHex);

    const query =
      "INSERT INTO color_submissions (user_id, challenge_color_r, challenge_color_g, challenge_color_b, submitted_color_r, submitted_color_g, submitted_color_b) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [
      userId,
      challengeRgb.r,
      challengeRgb.g,
      challengeRgb.b,
      submittedRgb.r,
      submittedRgb.g,
      submittedRgb.b,
    ];

    const result = await connection.query(query, values);
    res.status(201).json({ message: "색상 제출 성공", submission: result.rows[0] });
  } catch (error) {
    console.error("색상 제출 오류:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/scoreboard", async (req, res) => {
  try {
    // 날짜 파라미터 확인 (YYYY-MM-DD 형식)
    const targetDateParam = req.query.date;
    console.log("Received targetDateParam:", targetDateParam);
    let targetDate;
    let challengeColor = null; // challengeColor를 null로 초기화

    if (targetDateParam) {
      // 파라미터가 있으면 해당 날짜 사용
      targetDate = targetDateParam;
    } else {
      // 파라미터가 없으면 어제 날짜 사용
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      targetDate = yesterday.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    }
    console.log("Using targetDate for query:", targetDate);

    // 해당 날짜의 모든 색상 데이터 가져오기
    const submissionsQuery = `
      SELECT
        cs.user_id,
        cs.submitted_color_r,
        cs.submitted_color_g,
        cs.submitted_color_b,
        cs.challenge_color_r,
        cs.challenge_color_g,
        cs.challenge_color_b,
        u.name,
        u.picture,
        cs.submission_date
      FROM
        color_submissions cs
      JOIN
        users u ON cs.user_id = u.id
      WHERE
        cs.submission_date = $1;
    `;
    const submissionsResult = await connection.query(submissionsQuery, [targetDate]);
    const submissions = submissionsResult.rows;

    if (submissions.length > 0) {
      console.log("Sample submission_date from DB:", submissions[0].submission_date);
      // 문제 색상 (첫 번째 제출에서 가져옴)
      challengeColor = {
        r: submissions[0].challenge_color_r,
        g: submissions[0].challenge_color_g,
        b: submissions[0].challenge_color_b,
      };
      console.log("Challenge Color from DB:", challengeColor); // 디버깅 로그 추가
    }

    // 평균 색상 계산
    let sumR = 0,
      sumG = 0,
      sumB = 0;
    submissions.forEach((sub) => {
      sumR += sub.submitted_color_r;
      sumG += sub.submitted_color_g;
      sumB += sub.submitted_color_b;
    });

    const avgR = sumR / submissions.length;
    const avgG = sumG / submissions.length;
    const avgB = sumB / submissions.length;

    // 유클리드 거리 계산 및 점수화
    const scoreboard = submissions.map((sub) => {
      const distance = Math.sqrt(
        Math.pow(sub.submitted_color_r - avgR, 2) +
          Math.pow(sub.submitted_color_g - avgG, 2) +
          Math.pow(sub.submitted_color_b - avgB, 2)
      );
      return {
        user_id: sub.user_id,
        name: sub.name,
        picture: sub.picture,
        submitted_color: {
          r: sub.submitted_color_r,
          g: sub.submitted_color_g,
          b: sub.submitted_color_b,
        },
        distance: distance,
      };
    });

    // 거리가 짧은 순서대로 정렬 (점수가 낮을수록 좋음)
    scoreboard.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      message: `${targetDate} 스코어보드 데이터`,
      average_color: { r: Math.round(avgR), g: Math.round(avgG), b: Math.round(avgB) },
      challenge_color: challengeColor, // 문제 색상 추가
      scoreboard: scoreboard,
    });
  } catch (error) {
    console.error("스코어보드 API 오류:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
