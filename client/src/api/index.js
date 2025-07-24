import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5700', // 백엔드 서버 주소
  withCredentials: true, // 쿠키를 포함한 요청을 위해 필요
});

const api = {
  checkLogin: () => apiClient.get('/api/check-login'),
  logout: () => apiClient.post('/api/logout'),
  submitColor: (data) => apiClient.post('/api/submit-color', data),
  getScoreboard: (date) => {
    const params = date ? { date } : {};
    return apiClient.get('/api/scoreboard', { params });
  },
};

export default api;
