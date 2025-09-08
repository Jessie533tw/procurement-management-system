FROM node:18-alpine

WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production && npm cache clean --force

# 複製源代碼
COPY . .

# 建立應用
RUN npm run build

# 暴露端口
EXPOSE 3001

# 啟動命令
CMD ["npm", "run", "start:prod"]