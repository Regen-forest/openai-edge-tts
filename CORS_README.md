# CORS Configuration Guide

**Written by AI - Claude Opus 4.1 Thinking**

## 已完成的修改

### 1. **requirements.txt**
- 添加了 `flask-cors` 依賴

### 2. **app/server.py**
- 導入了 `flask_cors` 模組
- 添加了 CORS 配置支援
- 預設啟用 CORS（`CORS_ENABLED=True`）
- 預設允許所有來源（`CORS_ORIGINS=*`）

### 3. **docker-compose.yml**
- 添加了 CORS 環境變數配置

### 4. **.env.example**
- 添加了 CORS 配置範例

## 環境變數說明

### CORS_ENABLED
- **預設值**: `True`
- **說明**: 是否啟用 CORS 支援
- **可選值**: `True`, `False`

### CORS_ORIGINS
- **預設值**: `*` (允許所有來源)
- **說明**: 允許的來源列表
- **範例配置**:
  - `*` - 允許所有來源（適用於開發和瀏覽器擴充套件）
  - `https://example.com` - 只允許特定域名
  - `https://example.com,https://app.example.com` - 允許多個域名（逗號分隔）

## 使用方法

### 1. 使用預設配置（允許所有來源）
```bash
docker compose up --build
```

### 2. 自定義 CORS 配置
創建 `.env` 檔案：
```bash
cp .env.example .env
```

編輯 `.env` 檔案，設定 CORS 參數：
```env
# 允許特定域名
CORS_ENABLED=True
CORS_ORIGINS=https://yourdomain.com

# 或關閉 CORS（不建議）
CORS_ENABLED=False
```

### 3. 執行容器
```bash
docker compose up --build
```

## 測試 CORS

### 方法 1：使用提供的測試頁面
1. 啟動服務後，在瀏覽器中開啟 `test_cors.html`
2. 點擊測試按鈕驗證 CORS 是否正常工作

### 方法 2：使用瀏覽器控制台
```javascript
// 在瀏覽器控制台執行
fetch('http://localhost:5050/v1/models')
  .then(response => response.json())
  .then(data => console.log('CORS Success:', data))
  .catch(error => console.error('CORS Error:', error));
```

### 方法 3：使用 curl 檢查 CORS headers
```bash
curl -I -X OPTIONS http://localhost:5050/v1/audio/speech \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

## CORS Headers 說明

啟用 CORS 後，API 會返回以下 headers：

- `Access-Control-Allow-Origin`: 允許的來源
- `Access-Control-Allow-Methods`: GET, POST, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization, X-API-Key
- `Access-Control-Expose-Headers`: Content-Type, Content-Length
- `Access-Control-Max-Age`: 3600（預檢請求快取時間）
- `Access-Control-Allow-Credentials`: true（當設定特定來源時）

## 瀏覽器擴充套件注意事項

對於瀏覽器擴充套件：
1. 保持 `CORS_ORIGINS=*` 以允許擴充套件訪問
2. 如果需要 API 金鑰保護，設定 `REQUIRE_API_KEY=True` 並在擴充套件中配置 API 金鑰
3. 確保擴充套件的 manifest.json 有適當的權限設定

## 安全建議

1. **生產環境**：不建議使用 `CORS_ORIGINS=*`，應設定具體的允許域名
2. **API 金鑰**：啟用 `REQUIRE_API_KEY=True` 以增加安全性
3. **HTTPS**：生產環境應使用 HTTPS

## 故障排除

### 問題：仍然出現 CORS 錯誤
1. 確認 Docker 容器已重新建構：`docker compose down && docker compose up --build`
2. 檢查瀏覽器控制台的具體錯誤訊息
3. 確認環境變數正確設定：在容器中執行 `docker compose exec app env | grep CORS`

### 問題：預檢請求失敗
- 確保 API 支援 OPTIONS 方法
- 檢查 `Access-Control-Allow-Headers` 是否包含所需的 headers

### 問題：憑證錯誤
- 如果設定了特定來源且需要傳送 cookies，確保來源不是 `*`
- 檢查 `Access-Control-Allow-Credentials` header
