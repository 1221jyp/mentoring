import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom"; // useSearchParams 임포트
import api from "../api";

const ScoreboardContainer = styled.div`
  width: 80%;
  max-width: 800px;
  margin: 2rem auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  color: #333;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const AverageColorDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;

  div {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    margin-right: 1rem;
    border: 1px solid #ddd;
  }
`;

const ScoreboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.8rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f8f8f8;
    font-weight: bold;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const UserEntry = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const UserImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

function Scoreboard() {
  const [scoreboardData, setScoreboardData] = useState([]);
  const [averageColor, setAverageColor] = useState(null);
  const [challengeColor, setChallengeColor] = useState(null); // challengeColor 상태 추가
  const [message, setMessage] = useState("로딩 중...");
  const [searchParams] = useSearchParams(); // useSearchParams 훅 사용

  useEffect(() => {
    const fetchScoreboard = async () => {
      const dateParam = searchParams.get("date"); // URL에서 date 파라미터 가져오기
      try {
        const response = await api.getScoreboard(dateParam); // date 파라미터 전달
        if (response.data.scoreboard.length > 0) {
          setScoreboardData(response.data.scoreboard);
          setAverageColor(response.data.average_color);
          setChallengeColor(response.data.challenge_color); // challengeColor 설정
          setMessage(response.data.message);
        } else {
          setMessage(response.data.message || "스코어보드 데이터가 없습니다.");
          setScoreboardData([]);
          setAverageColor(null);
          setChallengeColor(null); // 데이터가 없으면 challengeColor도 초기화
        }
      } catch (error) {
        console.error("Error fetching scoreboard:", error);
        setMessage("스코어보드를 불러오는 데 실패했습니다.");
      }
    };

    fetchScoreboard();
  }, [searchParams]); // searchParams가 변경될 때마다 useEffect 재실행

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  return (
    <ScoreboardContainer>
      <Title>어제자 컬러 챌린지 스코어보드</Title>
      {challengeColor && (
        <AverageColorDisplay color={rgbToHex(challengeColor.r, challengeColor.g, challengeColor.b)}>
          <div />
          어제의 문제 색상: RGB({challengeColor.r}, {challengeColor.g}, {challengeColor.b})
        </AverageColorDisplay>
      )}
      {averageColor && (
        <AverageColorDisplay color={rgbToHex(averageColor.r, averageColor.g, averageColor.b)}>
          <div />
          어제의 평균 색상: RGB({averageColor.r}, {averageColor.g}, {averageColor.b})
        </AverageColorDisplay>
      )}
      {scoreboardData.length > 0 ? (
        <ScoreboardTable>
          <thead>
            <tr>
              <th>순위</th>
              <th>사용자</th>
              <th>제출 색상</th>
              <th>거리 (점수)</th>
            </tr>
          </thead>
          <tbody>
            {scoreboardData.map((entry, index) => (
              <UserEntry key={entry.user_id}>
                <td>{index + 1}</td>
                <td>
                  <UserImage src={entry.picture} alt={entry.name} />
                  {entry.name}
                </td>
                <td>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: rgbToHex(
                        entry.submitted_color.r,
                        entry.submitted_color.g,
                        entry.submitted_color.b
                      ),
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                </td>
                <td>{entry.distance.toFixed(2)}</td>
              </UserEntry>
            ))}
          </tbody>
        </ScoreboardTable>
      ) : (
        <p>{message}</p>
      )}
    </ScoreboardContainer>
  );
}

export default Scoreboard;
