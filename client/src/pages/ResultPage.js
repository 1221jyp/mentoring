import React from 'react';
import Scoreboard from '../components/Scoreboard';
import styled from 'styled-components';

const ResultPageContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

function ResultPage() {
  return (
    <ResultPageContainer>
      <h1>어제자 챌린지 결과</h1>
      <Scoreboard />
    </ResultPageContainer>
  );
}

export default ResultPage;
