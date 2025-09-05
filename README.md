# 發包管理系統

建設公司專用的發包管理系統，支援從詢價到完工的完整流程管理。

## 系統特色

### 🔄 完整業務流程
- **詢價管理**：工料分析表生成、多廠商詢價
- **報價比較**：自動整理單價和總價差異
- **採購管理**：採購單生成、預算自動扣減
- **進度追蹤**：施工進度表、延誤提醒
- **成本控管**：工程採購明細、工料採購明細

### ⚡ 自動化功能
- 新建專案自動建立資料夾和預算表
- 預算審核通知與鎖定機制
- 材料輸入自動生成傳票
- 合約編號生成與 PDF 寄送
- 進度更新自動寄送報告
- 工程完工自動彙整總帳

### 🎯 管理功能
- **日期比對**：預計下單日期、實際交貨日期、現場進度
- **延誤提醒**：自動提醒管理人員進度異常
- **成本分析**：即時預算使用狀況追蹤
- **權限控制**：不同角色的數據存取權限

## 技術架構

### 前端 Frontend
- **Next.js 15** - React 框架，支援 SSR/SSG
- **TypeScript** - 強型別開發
- **Tailwind CSS** - 現代化 UI 設計
- **React Data Grid** - 高效能表格組件
- **Lucide React** - 現代圖示庫

### 後端 Backend
- **NestJS** - 企業級 Node.js 框架
- **TypeORM** - TypeScript ORM
- **PostgreSQL** - 關聯式資料庫
- **BullMQ** - Redis 基礎任務佇列
- **Class Validator** - 數據驗證

### 基礎設施
- **PostgreSQL** - 主資料庫
- **Redis** - 快取與任務佇列
- **Zeabur** - 雲端部署平台

## 專案結構

```
發包管理系統/
├── backend/                 # NestJS 後端
│   ├── src/
│   │   ├── entities/       # 資料庫實體
│   │   ├── modules/        # 業務模組
│   │   │   ├── projects/   # 專案管理
│   │   │   ├── inquiries/  # 詢價管理
│   │   │   └── ...
│   │   ├── config/         # 配置文件
│   │   └── ...
│   └── ...
├── frontend/               # Next.js 前端
│   ├── src/
│   │   ├── app/           # App Router 頁面
│   │   ├── components/    # React 組件
│   │   └── ...
│   └── ...
└── README.md
```

## 核心資料表

### 專案相關
- **projects** - 專案基本資料
- **project_budgets** - 專案預算明細
- **project_progress** - 專案進度記錄

### 詢價流程
- **inquiries** - 詢價單
- **inquiry_items** - 詢價項目
- **inquiry_responses** - 供應商回覆
- **inquiry_response_items** - 回覆項目明細

### 採購管理
- **purchase_orders** - 採購單
- **purchase_order_items** - 採購項目
- **vendors** - 供應商資料
- **materials** - 材料主檔

### 財務記錄
- **financial_records** - 財務傳票記錄

## 開發環境設置

### 1. 環境需求
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- npm 或 yarn

### 2. 後端設置
```bash
cd backend

# 安裝依賴
npm install

# 複製環境變數
cp .env.example .env

# 設置資料庫連接
# 編輯 .env 文件中的資料庫設定

# 啟動開發服務器
npm run start:dev
```

### 3. 前端設置
```bash
cd frontend

# 安裝依賴
npm install

# 安裝額外套件
npm install react-data-grid axios lucide-react @tanstack/react-query @hookform/resolvers react-hook-form zod

# 啟動開發服務器
npm run dev
```

### 4. 環境變數設定

#### 後端 (.env)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=construction_management

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Application
PORT=3001
JWT_SECRET=your-secret-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Zeabur 部署

### 1. 準備部署
1. 推送代碼到 GitHub 倉庫
2. 登入 [Zeabur](https://zeabur.com)
3. 建立新專案

### 2. 部署後端
1. 選擇 GitHub 倉庫
2. 選擇 `backend` 目錄
3. 設定環境變數：
   - `DATABASE_URL`: PostgreSQL 連接字串
   - `REDIS_URL`: Redis 連接字串
   - `JWT_SECRET`: JWT 密鑰
   - 其他必要環境變數

### 3. 部署前端
1. 新增服務選擇 `frontend` 目錄
2. 設定環境變數：
   - `NEXT_PUBLIC_API_URL`: 後端 API 地址

### 4. 資料庫服務
1. 新增 PostgreSQL 服務
2. 新增 Redis 服務
3. 將連接資訊設定到後端環境變數

## API 文檔

### 專案管理
- `GET /projects` - 取得專案列表
- `POST /projects` - 建立新專案
- `GET /projects/:id` - 取得專案詳情
- `PATCH /projects/:id` - 更新專案
- `DELETE /projects/:id` - 刪除專案
- `GET /projects/:id/budget-summary` - 取得預算摘要

### 詢價管理
- `GET /inquiries` - 取得詢價單列表
- `POST /inquiries` - 建立詢價單
- `GET /inquiries/:id` - 取得詢價單詳情
- `GET /inquiries/:id/comparison` - 取得報價比較表
- `POST /inquiries/:id/responses` - 新增供應商回覆
- `PATCH /inquiries/responses/:responseId/status` - 更新回覆狀態

## 主要功能模組

### 1. 專案管理模組
- 專案建立與基本資料維護
- 預算編列與審核流程
- 進度追蹤與里程碑管理
- 預算使用狀況監控

### 2. 詢價管理模組
- 詢價單建立與發送
- 供應商回覆收集
- 報價比較與分析
- 最佳供應商選擇

### 3. 採購管理模組
- 採購單生成與審核
- 交期追蹤與提醒
- 驗收管理流程
- 付款條件管理

### 4. 報表分析模組
- 成本分析報告
- 進度分析報告
- 供應商績效分析
- 財務狀況分析

## 授權

本專案採用 MIT 授權條款。

## 聯絡方式

如有問題或建議，請透過 GitHub Issues 回報。