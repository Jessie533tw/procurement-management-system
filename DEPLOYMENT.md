# 部署指南

本文檔詳細說明如何在不同環境中部署發包管理系統。

## Zeabur 雲端部署 (推薦)

### 1. 準備工作

1. 將代碼推送到 GitHub 倉庫
2. 註冊並登入 [Zeabur](https://zeabur.com)
3. 確保代碼結構正確

### 2. 建立 Zeabur 專案

1. 在 Zeabur 控制台點擊 "New Project"
2. 選擇 GitHub 倉庫
3. 為專案命名（例如：construction-management）

### 3. 部署資料庫服務

#### PostgreSQL
1. 在專案中點擊 "Add Service" → "Database" → "PostgreSQL"
2. 等待部署完成
3. 記下連接資訊（會自動生成環境變數）

#### Redis
1. 點擊 "Add Service" → "Database" → "Redis"
2. 等待部署完成
3. 記下連接資訊

### 4. 部署後端 API

1. 點擊 "Add Service" → "Git"
2. 選擇倉庫和 "backend" 目錄
3. 設定環境變數：

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=${POSTGRES_URL}  # 由 Zeabur 自動提供
REDIS_URL=${REDIS_URL}        # 由 Zeabur 自動提供
JWT_SECRET=your-super-secret-jwt-key-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

4. 點擊 "Deploy"

### 5. 部署前端應用

1. 點擊 "Add Service" → "Git"
2. 選擇倉庫和 "frontend" 目錄
3. 設定環境變數：

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-url.zeabur.app
```

4. 點擊 "Deploy"

### 6. 設定自訂網域（可選）

1. 在服務設定中點擊 "Domains"
2. 新增自訂網域
3. 更新 DNS 設定

## Docker 本地部署

### 1. 準備環境

確保已安裝：
- Docker Desktop
- Docker Compose

### 2. 克隆專案

```bash
git clone <repository-url>
cd 發包管理系統
```

### 3. 環境設定

建立 `.env` 文件（後端）：

```bash
cd backend
cp .env.example .env
```

編輯 `.env` 文件中的設定。

### 4. 啟動服務

```bash
# 回到專案根目錄
cd ..

# 啟動所有服務
docker-compose up -d

# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f
```

### 5. 訪問應用

- 前端：http://localhost:3000
- 後端 API：http://localhost:3001
- PostgreSQL：localhost:5432
- Redis：localhost:6379

### 6. 停止服務

```bash
docker-compose down

# 同時刪除資料卷（注意：會清除資料庫資料）
docker-compose down -v
```

## 手動部署

### 1. 伺服器準備

#### 系統需求
- Ubuntu 20.04 LTS 或更新版本
- 至少 2GB RAM
- 20GB 硬碟空間

#### 安裝依賴
```bash
# 更新系統
sudo apt update && sudo apt upgrade -y

# 安裝 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安裝 PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 安裝 Redis
sudo apt install redis-server -y

# 安裝 PM2
sudo npm install -g pm2
```

### 2. 資料庫設定

#### PostgreSQL
```bash
# 切換到 postgres 使用者
sudo -u postgres psql

# 建立資料庫和使用者
CREATE DATABASE construction_management;
CREATE USER construction_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE construction_management TO construction_user;
\q
```

#### Redis
```bash
# 啟動 Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 3. 部署後端

```bash
# 克隆並進入專案
git clone <repository-url>
cd 發包管理系統/backend

# 安裝依賴
npm install

# 建置專案
npm run build

# 設定環境變數
cp .env.example .env
# 編輯 .env 文件

# 啟動應用
pm2 start dist/main.js --name construction-backend
```

### 4. 部署前端

```bash
cd ../frontend

# 安裝依賴
npm install

# 建置專案
npm run build

# 啟動應用
pm2 start npm --name construction-frontend -- start
```

### 5. 設定 Nginx (可選)

```bash
# 安裝 Nginx
sudo apt install nginx -y

# 建立配置文件
sudo nano /etc/nginx/sites-available/construction-management
```

Nginx 配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

啟用配置：

```bash
# 建立符號連結
sudo ln -s /etc/nginx/sites-available/construction-management /etc/nginx/sites-enabled/

# 測試配置
sudo nginx -t

# 重啟 Nginx
sudo systemctl restart nginx
```

## 資料庫遷移

### 1. 初始化資料庫結構

```bash
cd backend
npm run typeorm:migration:run
```

### 2. 初始數據載入

```bash
# 載入基礎資料（材料分類、預設供應商等）
npm run seed
```

## 監控與維護

### 1. 服務監控

```bash
# 查看 PM2 服務狀態
pm2 status

# 查看日誌
pm2 logs construction-backend
pm2 logs construction-frontend

# 重啟服務
pm2 restart construction-backend
pm2 restart construction-frontend
```

### 2. 資料庫備份

```bash
# 建立備份腳本
nano backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="construction_management"
DB_USER="construction_user"

mkdir -p $BACKUP_DIR
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/construction_$DATE.sql.gz

# 保留最近 7 天的備份
find $BACKUP_DIR -name "construction_*.sql.gz" -mtime +7 -delete
```

設定定期備份：

```bash
chmod +x backup-db.sh
crontab -e

# 新增每日凌晨 2 點備份
0 2 * * * /path/to/backup-db.sh
```

### 3. SSL 證書設置

使用 Let's Encrypt：

```bash
# 安裝 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 取得 SSL 證書
sudo certbot --nginx -d your-domain.com

# 設定自動更新
sudo crontab -e
# 新增：0 12 * * * /usr/bin/certbot renew --quiet
```

## 故障排除

### 常見問題

1. **資料庫連接失敗**
   - 檢查 PostgreSQL 服務狀態
   - 確認連接字串正確
   - 檢查防火牆設定

2. **Redis 連接失敗**
   - 檢查 Redis 服務狀態
   - 確認 Redis 配置

3. **前端無法連接後端**
   - 檢查 API URL 設定
   - 確認後端服務運行
   - 檢查 CORS 設定

### 日誌查看

```bash
# PM2 日誌
pm2 logs

# Nginx 日誌
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# PostgreSQL 日誌
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## 效能優化

### 1. 資料庫優化

- 建立適當的索引
- 定期執行 VACUUM 和 ANALYZE
- 調整 PostgreSQL 配置

### 2. 應用優化

- 啟用 Redis 快取
- 實作 API 回應快取
- 優化查詢語句

### 3. 前端優化

- 啟用 Next.js 靜態生成
- 實作程式碼分割
- 優化圖片載入