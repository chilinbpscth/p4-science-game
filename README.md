# 🚀 P4 科學科 — 太空冒險｜Firebase 設定完整指南

呢個遊戲用 Firebase Firestore 嚟儲存學生成績，同埋提供：
- 遊戲內即時排行榜（每位學生最高分）
- `leaderboard.html` 公開大屏排行榜
- `results.html` 老師專用詳細成績表

**注意**：現在 project 已經轉用 **Vite + npm Firebase modular SDK**（因為你喺 console 選擇了「使用 npm」）。Config 已經喺 `js/firebase.js` 入面用你的真實值 set 好。

---

## 📋 設定步驟（Firestore 部分）

### 1. 建立 Firebase 專案（如果你未做）

1. 打開 [Firebase Console](https://console.firebase.google.com/)
2. 點擊右上角 **「新增專案」**
3. 專案名稱建議用：`p4scigame` （或你用的）
4. 點擊「建立專案」

### 2. 新增 Web 應用程式（Config 已經 copy 好）

Config 已經從你之前的 screenshot 放了入 `js/firebase.js`：

```js
const firebaseConfig = {
  apiKey: "AIzaSyDqMA3nVUyTFywuRMv43NXvNasMiiJRJ-A",
  authDomain: "p4scigame.firebaseapp.com",
  projectId: "p4scigame",
  storageBucket: "p4scigame.firebasestorage.app",
  messagingSenderId: "937770158737",
  appId: "1:937770158737:web:1165453f5beba9d0fc0d30"
};
```

### 3. 啟用 Firestore 資料庫（最重要）

1. 左邊選單展開 **Build** → 點擊 **Firestore Database**
2. 點擊 **「建立資料庫」**
3. 選擇 **「開始於測試模式」**（之後會改規則）
4. 選擇地區：推薦 `asia-east2`（香港）
5. 點擊「啟用」

### 4. 設定 Firestore 安全規則（好重要！）

1. 切換去 **Rules** 標籤
2. 將全部內容**替換**為以下規則：

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{scoreId} {
      // 任何人（學生）都可以新增一筆成績
      allow create: if true;

      // 任何人（包括排行榜同老師）都可以讀取
      allow read: if true;

      // 嚴禁修改同刪除，保護學生成績數據
      allow update, delete: if false;
    }
  }
}
```

3. 點擊右上角 **Publish**（發佈）

> ⚠️ 如果之後想加強保安（例如只限特定網域），可以再改。

---

## 🛠️ 開發同測試

因為用 Vite + modular：

```bash
npm run dev
```

Vite 會自動開瀏覽器，支援 hot reload。

**直接雙擊 index.html 不 work**，一定要用 `npm run dev`。

---

## 🚀 放喺 Firebase Hosting 托管（你現在問的）

係！可以托管喺 Firebase Hosting。

我已經幫你準備好：

- `firebase.json` （public: "dist"）
- `.firebaserc` （project: p4scigame）
- `package.json` 有 `"deploy": "npm run build && firebase deploy"`

### 步驟：

1. **Login Firebase CLI**（第一次要做）：

```bash
export PATH="/opt/homebrew/bin:$PATH"
firebase login
```

   會開瀏覽器登入你的 Google 帳戶。

2. **Build 同 Deploy**：

```bash
npm run deploy
```

   呢個會自動 `npm run build` 然後 `firebase deploy`。

第一次 deploy 可能要確認，之後就簡單。

部署後，你會得到一個 URL 如 `https://p4scigame.web.app` ，學生可以直接用瀏覽器開，不使裝嘢。

---

## 📁 檔案用途說明

| 檔案              | 用途                     | 建議用法                     |
|-------------------|--------------------------|------------------------------|
| `index.html`      | 遊戲主頁 + 登入          | 畀學生玩（經 Vite dev 或 build） |
| `game.html`       | 實際遊戲                 | 由 index.html 跳轉           |
| `leaderboard.html`| 公開即時排行榜           | 放喺班房大電視 / 投影機      |
| `results.html`    | 老師專用詳細成績表       | **只畀老師自己用**，建議用密碼保護或放內網 |

---

## 🔒 安全建議

- `results.html` 包含所有學生成績，**不好**公開上網俾任何人見到。
  - Hosting 後可以用 Firebase Auth 或簡單 password 保護（可再問我加）。
- Firestore 規則現在係「任何人可寫可讀」，適合小規模班用。

---

## ❓ 常見問題

**Q: 玩完沒有儲到分？**  
A: 檢查：
1. Firestore Database 是否已建立
2. Rules 是否已 Publish（去 Rules 頁睇有沒有紅色錯誤）
3. 用 `npm run dev` 開（不好直接開 html）

**Q: 排行榜顯示不到？**  
A: 檢查 rules 入面 `allow read: if true;` 有沒有

**Q: 想清空測試數據？**  
A: 去 Firebase Console → Firestore → 選 collection `scores` → 刪除文件

**Q: 想改班別列表？**  
A: 喺 `game.html` 搵 `const CLASSES = ['4A', '4B'...]` 改

**Q: 部署後點樣 update？**  
A: 改完 code → `npm run deploy`

---

## 📞 仲有問題？

有任何設定問題，歡迎再問我，我可以一步一步幫你 debug。

設定好之後記住 **git push** 更新你的 GitHub repo！

## 📁 檔案用途說明

| 檔案              | 用途                     | 建議用法                     |
|-------------------|--------------------------|------------------------------|
| `index.html`      | 遊戲主頁 + 登入          | 畀學生玩                     |
| `game.html`       | 實際遊戲                 | 由 index.html 跳轉           |
| `leaderboard.html`| 公開即時排行榜           | 放喺班房大電視 / 投影機      |
| `results.html`    | 老師專用詳細成績表       | **只畀老師自己用**，建議用密碼保護或放內網 |

---

## 🔒 安全建議

- `results.html` 包含所有學生成績，**不好**公開上網俾任何人見到。
  - 可以用 GitHub Pages 時只 deploy 其他檔案
  - 或加簡單密碼保護（可再問我加功能）
- Firestore 規則現在係「任何人可寫可讀」，適合小規模班用。如果想限制只限你網站，可以加 `request.resource.data` 驗證或改用 Authentication。

---

## ❓ 常見問題

**Q: 玩完沒有儲到分？**  
A: 檢查三樣嘢：
1. 三個 HTML 檔案的 firebaseConfig 是否正確貼上
2. Firestore 是否已建立
3. Rules 是否已 Publish（有沒有紅色錯誤）

**Q: 排行榜顯示不到？**  
A: 檢查 rules 入面 `allow read: if true;` 有沒有

**Q: 想清空測試數據？**  
A: 去 Firebase Console → Firestore → 選 collection `scores` → 刪除文件

**Q: 想改班別列表？**  
A: 喺 `game.html` 搵 `const CLASSES = ['4A', '4B'...]` 改

---

## 🛠️ 開發模式（npm + Vite + 現代 Firebase SDK）

因為你選擇了「使用 npm」，我已經幫你：

- `npm install firebase`
- `npm install -D vite`
- 建立 `vite.config.js`（支援多頁）
- 抽取了 `js/firebase.js` 用現代 modular API
- 更新了三個 HTML 檔案用 `import` + Vite

### 啟動開發伺服器（推薦）

```bash
npm run dev
```

Vite 會自動開瀏覽器，支援 hot reload，Firebase import 會正確 resolve。

### 構建生產版

```bash
npm run build
```

輸出會喺 `dist/` 資料夾，然後可以用任何 static hosting（GitHub Pages, Netlify 等）。

### 注意

- 直接雙擊 `index.html` 現在**不會正常運作**（因為用了 ES module + bare import）。
- 一定要用 `npm run dev` 嚟開發/測試。
- 學生最終玩遊戲時，可以用 build 後的 `dist/` 檔案，或者你繼續 maintain 一個純 CDN 版本。

---

## 📞 仲有問題？

有任何設定問題，歡迎再問我，我可以一步一步幫你 debug。

設定好之後記住 **git push** 更新你的 GitHub repo！
