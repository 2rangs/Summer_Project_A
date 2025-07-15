FROM node:20-slim

WORKDIR /frontend

# package.json만 먼저 복사 (캐시 최적화용)
COPY package*.json ./

# ❗️여기서 컨테이너 내부에서 설치 (호스트 X)
RUN npm install

# 앱 전체 복사
COPY . .

EXPOSE 3000
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
