import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS 임포트

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/api/check-login");
        console.log("로그인 상태 응답:", response.data);
        setIsLoggedIn(response.data.loggedIn);
      } catch (error) {
        console.error("로그인 상태 확인 오류:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLoginRedirect = () => {
    const redirectUrl = location.pathname;
    window.location.href = `/login?redirectTo=${encodeURIComponent(redirectUrl)}`;
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      axios
        .post("/api/logout")
        .then(() => {
          setIsLoggedIn(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error("로그아웃 오류:", error);
        });
    } else {
      handleLoginRedirect();
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/">
            시스팀
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className={`nav-link ${location.pathname === "/" ? "active" : ""}`} href="/">
                  홈
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${location.pathname === "/enroll" ? "active" : ""}`}
                  href="/enroll"
                >
                  동아리 신청하기
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={handleLoginLogout}>
                  {isLoggedIn ? "로그아웃" : "로그인"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
