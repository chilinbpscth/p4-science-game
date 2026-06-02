# 🚀 P4 科學科 — 太空冒險｜Firebase 設定完整指南

呢個遊戲用 Firebase Firestore 嚟儲存學生成績，同埋提供：
- 遊戲內即時排行榜（每位學生最高分）
- `leaderboard.html` 公開大屏排行榜
- `results.html` 老師專用詳細成績表

---

## 📋 設定步驟（5 分鐘搞掂）

### 1. 建立 Firebase 專案

1. 打開 [Firebase Console](https://console.firebase.google.com/)
2. 點擊右上角 **「新增專案」**
3. 專案名稱建議用：`p4-science-game` 或 `p4-太空冒險`
4. **關閉** Google Analytics（唔使）
5. 點擊「建立專案」

### 2. 新增 Web 應用程式

1. 進入專案後，喺中間點擊 **Web 圖示 `</>`**
2. 應用程式暱稱填：`P4 太空冒險`
3. 打勾「也為這個應用程式設定 Firebase Hosting」（可選）
4. 點擊「註冊應用程式」
5. **複製** 畫面顯示嘅 `firebaseConfig` 整個物件（之後要用）

### 3. 啟用 Firestore 資料庫

1. 左邊選單展開 **Build** → 點擊 **Firestore Database**
2. 點擊 **「建立資料庫」**
3. 選擇 **「開始於測試模式」**（之後會改規則）
4. 選擇地區：
   - 推薦 `asia-east2`（香港）或 `asia-southeast1`
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

### 5. 把 Config 貼入三個 HTML 檔案

喺你下載/克隆嘅資料夾，有三個檔案都要貼**一樣**嘅 config：

- `game.html` （學生玩遊戲時儲分用）
- `leaderboard.html` （公開排行榜）
- `results.html` （老師查看詳細成績）

**操作方法**：
1. 用文字編輯器打開每個檔案
2. 搵到 `const firebaseConfig = { ... }` 呢一段
3. 將你喺 Firebase 複製嘅 config **完整取代** 佢

範例（取代後應該係咁）：

```js
const firebaseConfig = {
  apiKey: "AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "p4-science-game.firebaseapp.com",
  projectId: "p4-science-game",
  storageBucket: "p4-science-game.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**三個檔案都要改！** 改完儲存。

### 6. 測試

1. 喺瀏覽器打開 `index.html`
2. 玩一兩關，完成後應該會見到「✅ 成績已記錄！」
3. 打開 `leaderboard.html` 應該見到你嘅成績
4. 打開 `results.html` 應該見到詳細表格

---

## 📁 檔案用途說明

| 檔案              | 用途                     | 建議用法                     |
|-------------------|--------------------------|------------------------------|
| `index.html`      | 遊戲主頁 + 登入          | 畀學生玩                     |
| `game.html`       | 實際遊戲                 | 由 index.html 跳轉           |
| `leaderboard.html`| 公開即時排行榜           | 放喺班房大電視 / 投影機      |
| `results.html`    | 老師專用詳細成績表       | **只畀老師自己用**，建議用密碼保護或放內網 |

---

## 🔒 安全建議

- `results.html` 包含所有學生成績，**唔好**公開上網俾任何人見到。
  - 可以用 GitHub Pages 時只 deploy 其他檔案
  - 或加簡單密碼保護（可再問我加功能）
- Firestore 規則而家係「任何人可寫可讀」，適合小規模班用。如果想限制只限你網站，可以加 `request.resource.data` 驗證或改用 Authentication。

---

## ❓ 常見問題

**Q: 玩完冇儲到分？**  
A: 檢查三樣嘢：
1. 三個 HTML 檔案嘅 firebaseConfig 是否正確貼上
2. Firestore 是否已建立
3. Rules 是否已 Publish（有冇紅色錯誤）

**Q: 排行榜顯示唔到？**  
A: 檢查 rules 入面 `allow read: if true;` 有冇

**Q: 想清空測試數據？**  
A: 去 Firebase Console → Firestore → 選 collection `scores` → 刪除文件

**Q: 想改班別列表？**  
A: 喺 `game.html` 搵 `const CLASSES = ['4A', '4B'...]` 改

---

## 🛠️ 開發模式（npm + Vite + 現代 Firebase SDK）

因為你選擇咗「使用 npm」，我已經幫你：

- `npm install firebase`
- `npm install -D vite`
- 建立 `vite.config.js`（支援多頁）
- 抽取咗 `js/firebase.js` 用現代 modular API
- 更新咗三個 HTML 檔案用 `import` + Vite

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

- 直接雙擊 `index.html` 而家**唔會正常運作**（因為用咗 ES module + bare import）。
- 一定要用 `npm run dev` 嚟開發/測試。
- 學生最終玩遊戲時，可以用 build 後嘅 `dist/` 檔案，或者你繼續 maintain 一個純 CDN 版本。

---

## 📞 仲有問題？

有任何設定問題，歡迎再問我，我可以一步一步幫你 debug。

設定好之後記住 **git push** 更新你嘅 GitHub repo！
