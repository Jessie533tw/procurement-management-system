FROM node:18-alpine

WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝所有依賴（包括 devDependencies 用於建置）
RUN npm ci && npm cache clean --force

# 複製源代碼
COPY . .

# 建立應用
RUN npm run build

# 安裝僅生產依賴
RUN npm ci --only=production && npm cache clean --force

# 暴露端口
EXPOSE 3001

# 啟動命令
CMD ["npm", "run", "start:prod"]