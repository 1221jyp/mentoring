import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS 임포트

const RegiInfo = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); // 데이터를 저장할 상태

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await axios.get("/api/protected");
        if (response.status === 200) {
          setHasAccess(true);
        }
      } catch (error) {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, []);

  useEffect(() => {
    if (hasAccess) {
      const fetchData = async () => {
        try {
          const response = await axios.get("/api/enrollments"); // 새로운 요청
          if (Array.isArray(response.data)) {
            setData(response.data);
          } else {
            console.error("데이터 형식이 올바르지 않습니다:", response.data);
          }
        } catch (error) {
          console.error("데이터를 가져오는 데 오류가 발생했습니다:", error);
        }
      };
      fetchData();
    }
  }, [hasAccess]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!hasAccess) {
    return <div>접근이 거부되었습니다.</div>;
  }

  return (
    <div className="container">
      <div className="mt-5"></div>
      <div className="mt-5"></div>
      <h1 className="mt-5">보호된 페이지</h1>
      <p>여기는 특정 이메일을 가진 사용자만 접근할 수 있는 페이지입니다.</p>

      {data.length > 0 ? (
        <div className="row">
          {data.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">ID: {item.id}</h5>
                  <p className="card-text">이름: {item.name}</p>
                  <p className="card-text">전화번호: {item.phone}</p>
                  <p className="card-text">경력: {item.career}</p>
                  <p className="card-text">
                    프로그래밍 경험: {item.programming_exp ? "예" : "아니오"}
                  </p>
                  <p className="card-text">계획: {item.plan ? "예" : "아니오"}</p>
                  <p className="card-text">추가 답변: {item.additional_answer || "-"}</p>
                  <p className="card-text">자기소개: {item.bio}</p>
                  <p className="card-text">질문: {item.question || "-"}</p>
                  <p className="card-text">이메일: {item.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default RegiInfo;
