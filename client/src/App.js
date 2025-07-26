import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import ResultPage from './pages/ResultPage';
import PredictColorPage from './pages/PredictColorPage';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/predict-color" element={<PredictColorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
