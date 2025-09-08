# 開發指南

## 系統狀態

✅ **已完成的功能**

### 後端 (NestJS + TypeORM)
- [x] 完整的資料庫 Entity 設計 (12個核心表)
- [x] 專案管理模組 (ProjectsModule)
- [x] 詢價管理模組 (InquiriesModule)  
- [x] 採購管理模組 (PurchaseOrdersModule)
- [x] 供應商管理模組 (VendorsModule)
- [x] 材料管理模組 (MaterialsModule)
- [x] 完整的 API 端點設計
- [x] DTO 驗證和資料轉換
- [x] TypeORM 配置和資料庫連接
- [x] BullMQ 任務佇列配置

### 前端 (Next.js + TypeScript)
- [x] 響應式佈局設計 (Sidebar + Header)
- [x] 系統總覽儀表板
- [x] 專案列表頁面
- [x] 詢價管理頁面
- [x] 採購管理頁面
- [x] 供應商管理頁面
- [x] 材料管理頁面
- [x] 可重用的 UI 組件 (DataTable, Button, Modal)
- [x] TypeScript 類型定義
- [x] API 客戶端封裝

### 基礎設施
- [x] Docker Compose 配置
- [x] Dockerfile (前端/後端)
- [x] 環境變數配置
- [x] 完整的部署文檔

## 🚧 待完成的工作

### 高優先級
1. **依賴安裝問題解決**
   - 後端：清除 node_modules 重新安裝
   - 前端：清除 node_modules 重新安裝
   
2. **API 整合**
   - 前端頁面連接真實 API
   - 錯誤處理和載入狀態
   - React Query 實作

3. **表單功能**
   - 新增/編輯專案表單
   - 新增/編輯詢價單表單
   - 新增/編輯採購單表單
   - 新增/編輯供應商表單
   - 新增/編輯材料表單

### 中優先級
4. **進階功能**
   - 詢價比價表頁面
   - 進度追蹤頁面
   - 報表分析頁面
   - 檔案上傳功能
   - PDF 生成

5. **系統優化**
   - 分頁處理
   - 搜尋和篩選優化
   - 資料快取策略
   - 錯誤邊界處理

### 低優先級
6. **額外功能**
   - 用戶認證系統
   - 權限管理
   - 通知系統
   - 審核流程
   - 資料匯入/匯出

## 📋 開發流程

### 1. 環境準備

#### 後端開發
```bash
cd backend

# 清除舊的依賴
rm -rf node_modules package-lock.json

# 安裝依賴
npm install

# 複製環境設定
cp .env.example .env
# 編輯 .env 設定資料庫連接資訊

# 啟動開發服務器
npm run start:dev
```

#### 前端開發
```bash
cd frontend

# 清除舊的依賴  
rm -rf node_modules package-lock.json

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

### 2. 資料庫設置

#### 使用 Docker (推薦)
```bash
# 啟動 PostgreSQL 和 Redis
docker-compose up postgres redis -d

# 檢查服務狀態
docker-compose ps
```

#### 本地安裝
```bash
# PostgreSQL 
createdb construction_management

# Redis
redis-server
```

### 3. API 測試

後端啟動後可以測試以下端點：

```bash
# 專案相關
GET    /projects
POST   /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id

# 供應商相關
GET    /vendors
POST   /vendors
GET    /vendors/:id
PATCH  /vendors/:id

# 材料相關
GET    /materials
POST   /materials
GET    /materials/categories
GET    /materials/search?q=鋼筋

# 詢價相關
GET    /inquiries
POST   /inquiries
GET    /inquiries/:id/comparison

# 採購相關
GET    /purchase-orders
POST   /purchase-orders
PATCH  /purchase-orders/:id/approve
```

## 🗂️ 專案結構

```
發包管理系統/
├── backend/                 # NestJS 後端
│   ├── src/
│   │   ├── entities/       # 資料庫實體
│   │   │   ├── project.entity.ts
│   │   │   ├── vendor.entity.ts
│   │   │   ├── material.entity.ts
│   │   │   ├── inquiry.entity.ts
│   │   │   ├── purchase-order.entity.ts
│   │   │   └── ...
│   │   ├── modules/        # 業務模組
│   │   │   ├── projects/
│   │   │   ├── vendors/
│   │   │   ├── materials/
│   │   │   ├── inquiries/
│   │   │   └── purchase-orders/
│   │   ├── config/         # 配置文件
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Next.js 前端
│   ├── src/
│   │   ├── app/           # App Router 頁面
│   │   │   ├── page.tsx                # 系統總覽
│   │   │   ├── projects/page.tsx       # 專案管理
│   │   │   ├── inquiries/page.tsx      # 詢價管理
│   │   │   ├── purchase-orders/page.tsx # 採購管理
│   │   │   ├── vendors/page.tsx        # 供應商管理
│   │   │   └── materials/page.tsx      # 材料管理
│   │   ├── components/    # React 組件
│   │   │   ├── layout/    # 佈局組件
│   │   │   ├── ui/        # UI 組件
│   │   │   └── tables/    # 表格組件
│   │   ├── lib/           # 工具函數
│   │   │   └── api.ts     # API 客戶端
│   │   └── types/         # TypeScript 類型
│   │       └── index.ts
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker 配置
├── README.md              # 專案說明
├── DEPLOYMENT.md          # 部署指南
└── DEVELOPMENT.md         # 開發指南（本文件）
```

## 🛠️ 常見問題解決

### 1. 依賴安裝失敗
```bash
# Windows WSL 環境常見問題
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### 2. 資料庫連接失敗
```bash
# 檢查 PostgreSQL 服務
docker-compose ps postgres

# 檢查連接配置
cat backend/.env
```

### 3. TypeScript 錯誤
```bash
# 檢查類型定義
npm run lint
npm run build
```

### 4. API 調用失敗
```bash
# 檢查 CORS 設定
# 檢查 API 基礎路徑
console.log(process.env.NEXT_PUBLIC_API_URL)
```

## 📖 開發規範

### 1. 代碼風格
- 使用 ESLint 和 Prettier
- TypeScript 嚴格模式
- 統一命名規範

### 2. 提交規範
```bash
feat: 新增功能
fix: 修復錯誤
docs: 文檔更新
style: 代碼格式
refactor: 重構代碼
test: 測試相關
chore: 其他修改
```

### 3. 分支規範
- `main`: 主分支
- `develop`: 開發分支
- `feature/xxx`: 功能分支
- `hotfix/xxx`: 緊急修復分支

## 🚀 下一步計劃

1. **立即任務**：解決依賴安裝問題，確保開發環境可用
2. **本週任務**：完成 API 整合，實現基本的 CRUD 功能
3. **下週任務**：完成表單功能，實現完整的用戶操作流程
4. **月底目標**：完成核心功能開發，準備測試部署

## 📞 支援

如有開發問題，請參考：
1. [NestJS 官方文檔](https://docs.nestjs.com/)
2. [Next.js 官方文檔](https://nextjs.org/docs)
3. [TypeORM 官方文檔](https://typeorm.io/)
4. [Tailwind CSS 官方文檔](https://tailwindcss.com/docs)