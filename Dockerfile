FROM node:18-bullseye

# 設定工作目錄
WORKDIR /app

# 複製 package.json 與 package-lock.json
COPY backend/package*.json ./

# 安裝所有依賴（包含 devDependencies 用於構建）
RUN npm ci

# 複製後端程式碼
COPY backend/ ./

# 構建應用
RUN npm run build

# 清理 devDependencies，只保留生產依賴
RUN npm prune --production

# 暴露端口
EXPOSE 3001

# 設定環境變數（可在 Zeabur UI 覆寫）
ENV NODE_ENV=production

# 啟動命令
CMD ["npm", "run", "start:prod"]