const db = require("../db");

async function calculateAndStoreDailyAverageRgb() {
  console.log(`[${new Date().toISOString()}] Calculating and storing daily average RGB...`);
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Calculate average RGB for submitted_color for today
    const result = await db.query(
      `SELECT 
                AVG(submitted_color_r) as avg_r,
                AVG(submitted_color_g) as avg_g,
                AVG(submitted_color_b) as avg_b
            FROM color_submissions
            WHERE submission_date = $1;`,
      [today]
    );

    const avgRgb = result.rows[0];

    if (avgRgb && avgRgb.avg_r !== null) {
      const avg_r = Math.round(avgRgb.avg_r);
      const avg_g = Math.round(avgRgb.avg_g);
      const avg_b = Math.round(avgRgb.avg_b);

      // Check if an entry for today already exists
      const existingEntry = await db.query(
        `SELECT * FROM daily_average_rgb WHERE submission_date = $1;`,
        [today]
      );

      if (existingEntry.rows.length > 0) {
        // Update existing entry
        await db.query(
          `UPDATE daily_average_rgb
                       SET avg_r = $1, avg_g = $2, avg_b = $3, created_at = NOW()
                       WHERE submission_date = $4;`,
          [avg_r, avg_g, avg_b, today]
        );
        console.log(
          `[${new Date().toISOString()}] Updated daily average RGB for ${today}: (${avg_r}, ${avg_g}, ${avg_b})`
        );
      } else {
        // Insert new entry
        await db.query(
          `INSERT INTO daily_average_rgb (submission_date, avg_r, avg_g, avg_b)
                       VALUES ($1, $2, $3, $4);`,
          [today, avg_r, avg_g, avg_b]
        );
        console.log(
          `[${new Date().toISOString()}] Inserted daily average RGB for ${today}: (${avg_r}, ${avg_g}, ${avg_b})`
        );
      }
    } else {
      console.log(
        `[${new Date().toISOString()}] No color submissions found for ${today}. Skipping average calculation.`
      );
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error calculating or storing daily average RGB:`,
      error
    );
  }
}

async function calculateAndStoreAllDaysAverageRgb() {
  console.log(
    `[${new Date().toISOString()}] Starting to calculate and store averages for ALL days.`
  );
  try {
    // 1. color_submissions 테이블에서 모든 유니크한 날짜를 가져옵니다.
    const datesResult = await db.query(
      `SELECT DISTINCT submission_date FROM color_submissions ORDER BY submission_date;`
    );
    const dates = datesResult.rows.map((row) => row.submission_date);

    console.log(`[${new Date().toISOString()}] Found ${dates.length} unique dates to process.`);

    for (const date of dates) {
      const formattedDate = date;
      console.log(`[${new Date().toISOString()}] Processing date: ${formattedDate}`);

      // 2. daily_average_rgb 테이블에 해당 날짜의 데이터가 이미 있는지 확인합니다.
      const existingEntry = await db.query(
        `SELECT 1 FROM daily_average_rgb WHERE submission_date = $1;`,
        [formattedDate]
      );

      if (existingEntry.rows.length > 0) {
        console.log(
          `[${new Date().toISOString()}] Average for ${formattedDate} already exists. Skipping.`
        );
        continue; // 이미 데이터가 있으면 건너뜁니다.
      }

      // 3. 해당 날짜의 평균 RGB를 계산합니다.
      const avgResult = await db.query(
        `SELECT 
                    AVG(submitted_color_r) as avg_r,
                    AVG(submitted_color_g) as avg_g,
                    AVG(submitted_color_b) as avg_b
                FROM color_submissions
                WHERE submission_date = $1;`,
        [formattedDate]
      );

      const avgRgb = avgResult.rows[0];
      console.log(`[${new Date().toISOString()}] Calculated avgRgb for ${formattedDate}:`, avgRgb);

      if (avgRgb && avgRgb.avg_r !== null) {
        const avg_r = Math.round(avgRgb.avg_r);
        const avg_g = Math.round(avgRgb.avg_g);
        const avg_b = Math.round(avgRgb.avg_b);
        console.log(
          `[${new Date().toISOString()}] Rounded RGB for ${formattedDate}: (${avg_r}, ${avg_g}, ${avg_b})`
        );

        // 4. 계산된 평균값을 daily_average_rgb 테이블에 삽입합니다.
        try {
          await db.query(
            `INSERT INTO daily_average_rgb (submission_date, avg_r, avg_g, avg_b)
                           VALUES ($1, $2, $3, $4);`,
            [formattedDate, avg_r, avg_g, avg_b]
          );
          console.log(
            `[${new Date().toISOString()}] Successfully inserted daily average for ${formattedDate}: (${avg_r}, ${avg_g}, ${avg_b})`
          );
        } catch (insertError) {
          console.error(
            `[${new Date().toISOString()}] ERROR inserting daily average for ${formattedDate}:`,
            insertError
          );
        }
      } else {
        console.log(
          `[${new Date().toISOString()}] No valid average RGB calculated for ${formattedDate}. Skipping insertion.`
        );
      }
    }
    console.log(`[${new Date().toISOString()}] Finished processing all days.`);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error in calculateAndStoreAllDaysAverageRgb:`,
      error
    );
  }
}

module.exports = { calculateAndStoreDailyAverageRgb, calculateAndStoreAllDaysAverageRgb };
