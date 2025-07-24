function Home() {
  return (
    <div>
      <header
        className="py-5 bg-image-full position-relative"
        style={{
          backgroundImage: "url('/images/home2.jpg')", // public/images/home1.jpg 파일을 배경으로 사용
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)", // 반투명 검정 배경 추가
            top: 0,
            left: 0,
          }}
        ></div>
        <div className="text-center my-5 position-relative" style={{ zIndex: 1 }}>
          <img
            className="img-fluid rounded-circle mb-4"
            src="/images/home1.jpg"
            alt="..."
            style={{ maxWidth: "150px", maxHeight: "150px" }}
          />
          <h1 className="text-white fs-3 fw-bolder">시스팀</h1>
          <p className="text-white mb-0">오남고등학교 컴퓨터공학 동아리</p>
        </div>
      </header>
      <section class="py-1">
        <div class="container my-4">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <h2 class="mb-3">하는 활동</h2>
              <p class="lead">
                하는 활동 시스팀에서는 동아리 이름에 맞춰 동아리원들이 팀을 구성하여 각 팀별로 실물
                프로그램을 개발하는 활동을 진행합니다.
              </p>
              <p class="mb-0">
                실물 프로그램은 웹사이트, 게임, GUI 응용 프로그램 등 다양하게 가능하며, 어떤
                프로그램을 만들지 결정하지 못한 학생들을 위해 Python 프로그래밍 언어의 tkinter
                라이브러리를 활용하여 컴퓨터에서 작동 가능한 GUI 응용 프로그램을 만드는 방법에 대한
                강의를 준비할 예정입니다.
                <br></br>
                <br></br>
                ** 꼭 팀으로 활동할 필요는 없습니다!
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="py-1">
        <div class="container my-4">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <h2>가입 요구 사항</h2>
              <p class="lead"> * 파이썬 or 기타 프로그래밍 언어 기초</p>
              <p class="mb-0">
                프로그래밍 언어로 조건문, 함수문 정도는 다루실줄 아셔야 GUI 응용 프로그램 제작
                수업을 따라오기 수월할 것입니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="py-1">
        <div class="container my-3">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <h2>가입 방법</h2>
              <p class="mb-0">
                우측 상단 메뉴 버튼을 누른 뒤에 로그인을 한 후, 동아리 신청하기를 해주세요.
              </p>
              <br></br>
              <p class="mb-0">* 로그인이 반드시 되어있어야 신청이 가능합니다.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="py-1">
        <div class="container my-3">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <p class="m-0 text-center">기장 김오남</p>Í›
              <p class="m-0 text-center">연락처 : 01012345678 / @onam2007</p>
              <br></br>
              <p class="m-0 text-center">부기장 홍길동</p>
              <p class="m-0 text-center">연락처 : 01087654321 / @onam2008</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
