FROM node:18-alpine

WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci && npm cache clean --force

# 複製源代碼
COPY . .

# 建立應用
RUN npm run build

# 確認 public 文件已複製
RUN ls -la public/

# 暴露端口 (Zeabur 會動態分配)
EXPOSE 3000

# 啟動命令 - 列出所有環境變數找出 Zeabur 的動態端口
CMD ["sh", "-c", "echo \"=== All environment variables ===\" && env | sort && echo \"=== Starting Next.js ===\" && npx next start -p ${PORT:-3000} -H 0.0.0.0"]