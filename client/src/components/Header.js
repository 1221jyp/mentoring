import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트
import api from '../api'; // API 호출 함수들을 모아둔 파일

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
`;

const Logo = styled(Link)` // Link 컴포넌트로 변경
  font-size: 1.5rem;
  margin: 0;
  color: #333;
  text-decoration: none; // 링크 밑줄 제거
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;

  a {
    color: #333;
    text-decoration: none;
    font-size: 1rem;
    &:hover {
      color: #007bff;
    }
  }
`;

const AuthContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LoginButton = styled.a`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  text-decoration: none;
  color: #fff;
  background-color: #4285F4; // Google Blue
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357ae8;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: transparent;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await api.checkLogin();
        setIsLoggedIn(response.data.loggedIn);
        if (response.data.loggedIn) {
          // In a real app, you might fetch user details here
          // For now, we'll rely on the backend session
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      setIsLoggedIn(false);
      setUser(null);
      window.location.reload(); // Reload to clear state
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <HeaderContainer>
      <Logo to="/">Color Palette Challenge</Logo>
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/results">Results</Link>
        <Link to="/predict-color">Predict Color</Link>
      </NavLinks>
      <AuthContainer>
        {isLoggedIn ? (
          <UserProfile>
            {/* Mock user data for now */}
            <UserImage src="https://lh3.googleusercontent.com/a/ACg8ocK_..." alt="User" />
            <span>Welcome!</span>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </UserProfile>
        ) : (
          <LoginButton href="http://localhost:5700/login">Login with Google</LoginButton>
        )}
      </AuthContainer>
    </HeaderContainer>
  );
}

export default Header;
