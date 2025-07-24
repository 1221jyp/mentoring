CREATE TABLE color_submissions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    challenge_color_r SMALLINT NOT NULL CHECK (challenge_color_r >= 0 AND challenge_color_r <= 255),
    challenge_color_g SMALLINT NOT NULL CHECK (challenge_color_g >= 0 AND challenge_color_g <= 255),
    challenge_color_b SMALLINT NOT NULL CHECK (challenge_color_b >= 0 AND challenge_color_b <= 255),
    submitted_color_r SMALLINT NOT NULL CHECK (submitted_color_r >= 0 AND submitted_color_r <= 255),
    submitted_color_g SMALLINT NOT NULL CHECK (submitted_color_g >= 0 AND submitted_color_g <= 255),
    submitted_color_b SMALLINT NOT NULL CHECK (submitted_color_b >= 0 AND submitted_color_b <= 255),
    submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
