import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { SketchPicker } from 'react-color'; // SketchPicker 임포트

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: calc(100vh - 60px); /* Header 높이 제외 */
  background-color: #f0f2f5;
`;

const PickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  .sketch-picker {
    box-shadow: none !important;
  }

  .flexbox-fix:nth-child(3) {
    display: none !important;
  }
`;

const PredictButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ResultContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const PredictedColorBox = styled.div`
  width: 100px;
  height: 100px;
  margin: 20px auto;
  border: 1px solid #ccc;
  border-radius: 50%;
  background-color: rgb(${props => props.rgb.join(',')});
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

function PredictColorPage() {
  const [selectedColorHex, setSelectedColorHex] = useState('#EEEEEE');
  const [predictedColor, setPredictedColor] = useState(null);
  const [error, setError] = useState(null);

  const handleColorChange = (color) => {
    setSelectedColorHex(color.hex);
  };

  const handlePredict = async () => {
    setError(null);
    setPredictedColor(null);
    try {
      const rgb = hexToRgb(selectedColorHex);
      const response = await axios.post('/api/get-predicted-color', {
        challenge_color: rgb,
      });
      setPredictedColor(response.data.predicted_color);
    } catch (err) {
      console.error('Error fetching predicted color:', err);
      setError('예측 색상을 가져오는 데 실패했습니다. 서버를 확인해주세요.');
    }
  };

  return (
    <PageContainer>
      <h1>색상 예측하기</h1>
      <p>어떤 색상에 어울리는 색상을 예측할까요? 팔레트에서 선택해주세요.</p>
      <PickerContainer>
        <SketchPicker
          color={selectedColorHex}
          onChangeComplete={handleColorChange}
          width="220px"
          presetColors={[]}
          disableAlpha={true}
        />
      </PickerContainer>
      <PredictButton onClick={handlePredict}>예측하기</PredictButton>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {predictedColor && (
        <ResultContainer>
          <h2>예측된 어울리는 색상:</h2>
          <PredictedColorBox rgb={predictedColor} />
          <p>RGB: ({predictedColor[0]}, {predictedColor[1]}, {predictedColor[2]})</p>
        </ResultContainer>
      )}
    </PageContainer>
  );
}

export default PredictColorPage;