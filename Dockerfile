FROM node:18-bullseye

WORKDIR /app

# 複製 package.json
COPY backend/package*.json ./

# 安裝依賴
RUN npm ci

# 複製後端程式碼
COPY backend/ ./

# 構建應用（使用 npx）
RUN npm run build

EXPOSE 3001
ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]