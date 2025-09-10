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

# 啟動命令 - 確保監聽所有網路介面
CMD ["sh", "-c", "echo \"Starting backend on port ${PORT:-3001}\" && npm run start:prod"]