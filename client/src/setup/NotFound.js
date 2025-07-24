import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <h1 className="text-4xl text-center text-red-500">페이지를 찾지 못했습니다.</h1>
      <div className="flex justify-center mt-4 w-full">
        <p
          onClick={goHome}
          className="px-6 py-2 text-center block mx-auto"
          style={{ cursor: "pointer" }}
        >
          눌러서 홈으로 돌아가기
        </p>
      </div>
    </div>
  );
}

export default NotFound;
