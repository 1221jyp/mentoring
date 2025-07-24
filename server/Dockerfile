# Node.js 공식 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 서버 코드 복사
COPY ./server/package.json ./server/package-lock.json ./
RUN npm install

# ✅ 클라이언트 빌드 결과를 서버에 복사
COPY ./client/build /app/build 

# 전체 서버 코드 복사
COPY ./server /app

# 서버 실행
CMD ["npm", "start"]