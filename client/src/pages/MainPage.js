import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";
import api from "../api"; // api 모듈 임포트

// Styled-components for layout and styling
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const ChallengeContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ColorDisplay = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  background-color: ${(props) => props.color};
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: ${(props) => (isDark(props.color) ? "white" : "black")};
`;

const PickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .sketch-picker {
    box-shadow: none !important;
  }

  .flexbox-fix:nth-child(3) {
    display: none !important;
  }
`;

const SubmitButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

// Helper function to determine if a color is dark
function isDark(hexColor) {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}

function MainPage() {
  const [todayColor, setTodayColor] = useState("#FFFFFF");
  const [selectedColor, setSelectedColor] = useState("#EEEEEE");

  // Fetch today's color from the backend (mocked for now)
  useEffect(() => {
    // In a real app, you would fetch this from your API
    const fetchedColor = "#FF6347"; // Example: Tomato
    setTodayColor(fetchedColor);
  }, []);

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const handleSubmit = async () => {
    console.log("Submitted color:", selectedColor);
    try {
      const response = await api.submitColor({
        challengeColorHex: todayColor,
        submittedColorHex: selectedColor,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting color:", error);
      alert("색상 제출에 실패했습니다. 로그인했는지 확인해주세요.");
    }
  };

  return (
    <MainContainer>
      <h2>Today's Color Challenge</h2>
      <p>Pick a color that you think best matches today's color.</p>
      <ChallengeContainer>
        <PickerContainer>
          <h3>Today's Color</h3>
          <ColorDisplay color={todayColor}>{todayColor}</ColorDisplay>
        </PickerContainer>
        <PickerContainer>
          <h3>Your Choice</h3>
          <SketchPicker
            color={selectedColor}
            onChangeComplete={handleColorChange}
            width="220px"
            presetColors={[]}
            disableAlpha={true} // 이 옵션은 react-color v2 기준이며, 일부 커스텀 빌드에서는 다를 수 있습니다.
          />
        </PickerContainer>
      </ChallengeContainer>
      <SubmitButton onClick={handleSubmit}>Submit Your Color</SubmitButton>
    </MainContainer>
  );
}

export default MainPage;
