# 1. Node.js 베이스 이미지 사용
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 설치에 필요한 파일 먼저 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 나머지 모든 파일 복사
COPY . .

# 6. Next.js 개발 서버 실행
CMD ["npm", "run", "dev"]
