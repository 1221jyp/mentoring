import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Enroll() {
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    phone: "",
    career: "",
    programmingExp: "",
    plan: "",
    additionalAnswer: "",
    bio: "",
    question: "",
    intervDate: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지를 위한 상태 추가

  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 리디렉션

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdditionalAnswerChange = (e) => {
    setFormData({
      ...formData,
      additionalAnswer: e.target.value,
    });
  };

  useEffect(() => {
    // 로그인 상태 확인 API 호출
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/api/check-login");
        setIsLoggedIn(response.data.loggedIn);
      } catch (error) {
        console.error("로그인 상태 확인 오류:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로그인하지 않은 경우 알림 표시
    if (!isLoggedIn) {
      alert("로그인 후에 게시물을 작성할 수 있습니다.");
      return;
    }

    const { number, name, phone, career, programmingExp, plan, additionalAnswer, bio, intervDate } =
      formData;

    // 각 입력 값 검증
    if (
      number.trim() === "" ||
      name.trim() === "" ||
      phone.trim() === "" ||
      career === "" ||
      programmingExp === "" ||
      plan === "" ||
      bio === "" ||
      intervDate === ""
    ) {
      alert("모든 정보를 작성하세요.");
      return;
    }

    // 학번은 5자리 숫자만 허용
    if (!/^\d{5}$/.test(number)) {
      alert("학번은 정확히 5자리 숫자만 입력할 수 있습니다.");
      return;
    }

    // 이름은 한글, 영문, 공백만 허용
    if (!/^[가-힣a-zA-Z\s]+$/.test(name)) {
      alert("이름은 한글, 영문, 공백만 입력할 수 있습니다.");
      return;
    }

    // 전화번호는 10자리 또는 11자리 숫자만 허용
    if (!/^\d{10,11}$/.test(phone)) {
      alert("연락처는 10자리 또는 11자리 숫자로 입력해야 합니다.");
      return;
    }

    // plan이 "1"일 때 additionalAnswer가 비어있는지 체크
    if (plan === "1" && additionalAnswer.trim() === "") {
      alert("계획에 대한 추가 정보를 작성해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("네트워크 응답이 올바르지 않습니다");
      }

      setSuccessMessage("신청이 성공적으로 완료되었습니다!"); // 성공 메시지 설정
      setTimeout(() => {
        navigate("/"); // 3초 후에 메인 페이지로 리디렉션
      }, 2000); // 2초 기다린 후 리디렉션
    } catch (error) {
      console.error("폼 제출 실패:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container py-5">
        {/* 로그인되지 않았을 경우 상단에 고정된 경고 메시지 */}
        {!isLoggedIn && (
          <div className="alert alert-warning w-100 mb-4" role="alert">
            <strong>로그인 후에 신청이 가능합니다!</strong> 로그인을 먼저 한 후 다시 시도해주세요.
          </div>
        )}

        {/* 성공 메시지 */}
        {successMessage && (
          <div className="alert alert-success w-100 mb-4" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-sm rounded p-4 mb-3">
            <h2 className="h2 mb-4">동아리 신청</h2>

            <p className="mb-4">
              동아리 신청 페이지입니다. 신청 후 수정이 필요하시면 새로 작성하여 제출하시면 됩니다.
            </p>
            <p>신청 취소를 원하시면, 자기소개란에 '취소합니다'를 입력하고 다시 제출해주세요.</p>
          </div>
          <h3 className="h4 mb-4">- 개인정보</h3>
          <div className="bg-white shadow-sm rounded p-4">
            {/* 학번 */}
            <div className="mb-5">
              <label className="form-label" htmlFor="number">
                학번 <span style={{ color: "red" }}>*필수</span>
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="form-control"
                placeholder="ex) 10101"
              />
            </div>
            {/* 이름 */}
            <div className="mb-5">
              <label className="form-label" htmlFor="name">
                이름 <span style={{ color: "red" }}>*필수</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="ex) 김오남"
              />
            </div>
            {/* 연락처 */}
            <div className="mb-3">
              <label className="form-label" htmlFor="phone">
                연락처 <span style={{ color: "red" }}>*필수</span>
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="공백없이 입력 ex) 01012341234"
              />
            </div>
          </div>
          <h3 className="h4 mb-4 mt-4">- 면접일</h3>

          <div className="mb-2 bg-white shadow-sm rounded p-4">
            <label className="form-label" htmlFor="intervDate">
              희망하는 면접 날짜를 입력해주세요 <span style={{ color: "red" }}>*필수</span>
            </label>
            <div className="form-check">
              <input
                type="radio"
                id="yes"
                name="intervDate"
                value="1"
                onChange={handleChange}
                checked={formData.intervDate === "1"}
                className="form-check-input"
              />
              <label htmlFor="yes" className="form-check-label">
                3월 12일 (수요일)
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="no"
                name="intervDate"
                value="0"
                onChange={handleChange}
                checked={formData.intervDate === "0"}
                className="form-check-input"
              />
              <label htmlFor="no" className="form-check-label">
                3월 13일 (목요일)
              </label>
            </div>
          </div>

          <h3 className="h4 mb-4 mt-4">- 질문사항</h3>
          {/* 1번 질문: 희망 진로 */}
          <div className="mb-2 bg-white shadow-sm rounded p-4">
            <label className="form-label" htmlFor="career">
              1. 당신의 희망 진로는 무엇인가요? <span style={{ color: "red" }}>*필수</span>
            </label>
            <input
              type="text"
              name="career"
              value={formData.career}
              onChange={handleChange}
              className="form-control"
              placeholder="학과가 아니여도 좋습니다. 최대한 구체적으로 적어주세요."
            />
          </div>

          {/* 2번 질문: 프로그래밍 언어 사용경험 */}
          <div className="mb-2 bg-white shadow-sm rounded p-4">
            <label className="form-label" htmlFor="programmingExp">
              2. 파이썬 혹은 기타 프로그래밍 언어를 사용해본적이 있나요?{" "}
              <span style={{ color: "red" }}>*필수</span>
            </label>
            <div className="form-check">
              <input
                type="radio"
                id="yes"
                name="programmingExp"
                value="1"
                onChange={handleChange}
                checked={formData.programmingExp === "1"}
                className="form-check-input"
              />
              <label htmlFor="yes" className="form-check-label">
                예
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="no"
                name="programmingExp"
                value="0"
                onChange={handleChange}
                checked={formData.programmingExp === "0"}
                className="form-check-input"
              />
              <label htmlFor="no" className="form-check-label">
                아니요
              </label>
            </div>
          </div>

          {/* 3번 질문: 동아리 계획 */}
          <div className="mb-2 bg-white shadow-sm rounded p-4">
            <label className="form-label" htmlFor="plan">
              3. 동아리 시간에 만들어보고 싶은 프로그램이나 계획이 있으신가요?{" "}
              <span style={{ color: "red" }}>*필수</span>
            </label>
            <div className="form-check">
              <input
                type="radio"
                id="yes"
                name="plan"
                value="1"
                onChange={handleChange}
                checked={formData.plan === "1"}
                className="form-check-input"
              />
              <label htmlFor="yes" className="form-check-label">
                예
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="no"
                name="plan"
                value="0"
                onChange={handleChange}
                checked={formData.plan === "0"}
                className="form-check-input"
              />
              <label htmlFor="no" className="form-check-label">
                아니요
              </label>
            </div>
            {formData.plan === "1" && (
              <div className="mt-3">
                <label className="form-label" htmlFor="additionalAnswer">
                  어떤 구체적 계획이 있으신가요?{" "}
                  <span style={{ color: "red" }}>* '예' 선택시 필수</span>
                </label>
                <textarea
                  name="additionalAnswer"
                  value={formData.additionalAnswer}
                  onChange={handleAdditionalAnswerChange}
                  className="form-control"
                  rows="4"
                  placeholder="자유롭게 적어주세요"
                />
              </div>
            )}
          </div>

          {/* 4번 질문: 자기소개 */}
          <div className="mb-2 bg-white shadow-sm rounded p-4">
            <label className="form-label" htmlFor="bio">
              4. 자기소개 <span style={{ color: "red" }}>*필수</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="자기소개를 입력하세요"
            />
          </div>

          {/* 5번 질문: 질문하고 싶은 사항 */}
          <div className="mb-2 bg-white shadow-sm rounded p-4">
            <label className="form-label" htmlFor="question">
              5. 동아리에 질문하고 싶은 사항을 적어주세요.
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="궁금한 사항을 자유롭게 적어주세요"
            />
          </div>

          <button type="submit" className="btn btn-dark w-100 py-3">
            신청하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default Enroll;
