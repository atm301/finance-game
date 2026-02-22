# 財商小達人 v3.2 — 遊戲內部設計說明文件

> **適用對象**：開發者、系統設計者  
> **最後更新**：2026-02-22  
> **文件涵蓋**：職業系統、收入/支出計算、投資複利、事件系統、成就系統、教學系統、存檔機制

---

## 📁 檔案結構

```
finance-game/
├── index.html             # 主頁面 HTML
├── css/
│   └── style.css          # 全域樣式
└── js/
    ├── data.js            # 所有靜態遊戲資料（職業、事件、投資選項等）
    ├── player.js          # Player 類別（屬性、財務、晉升、存檔邏輯）
    ├── game.js            # Game 類別（主要遊戲控制器、行動處理）
    ├── ui.js              # UI 物件（DOM 更新、彈窗、畫面切換）
    ├── events.js          # Events 物件（事件觸發、效果套用）
    ├── achievements.js    # ACHIEVEMENTS 常數 + AchievementSystem 類別
    ├── finance.js         # Finance 工具（複利計算、格式化金錢）
    ├── tutorial.js        # Tutorial 物件（教學引導步驟）
    ├── audio.js           # AudioManager 物件（音效/BGM）
    └── auth.js            # Auth 物件（雲端存檔，選用）
```

---

## 🎮 遊戲流程總覽

```
開始畫面
  └─> 角色創建畫面（答 5 題問答，決定初始屬性）
        └─> 遊戲主畫面（共 25 回合）
              ├─ 每回合：選最多 2 個行動
              ├─ 行動結束→按「下一回合」
              ├─ 觸發隨機事件 / 結算本回合收支
              └─ 第 25 回合後→結算畫面（成就 + 複利小教室）
```

**25 回合 = 5 個人生階段 × 每階段 5 回合**

---

## 👤 人生階段（`GAME_DATA.stages`）

| 階段 | 名稱 | 年紀 | 基礎月收入 | 基礎月支出 |
|------|------|------|-----------|-----------|
| 0 | 📚 學生時期 | 12–18 | 50 | 30 |
| 1 | 🎓 大學時期 | 18–22 | 80 | 60 |
| 2 | 💼 職場新鮮人 | 22–30 | 200 | 120 |
| 3 | 📈 事業發展期 | 30–45 | 350 | 200 |
| 4 | 🏖️ 退休準備期 | 45–60 | 400 | 250 |

> 階段轉換在回合 6、11、16、21 發生（每 5 回合一個階段）。

---

## 💼 職業系統（`GAME_DATA.careers`）

### 晉升邏輯（`player.checkCareerPromotion()`）

**觸發時機**：每次按下「下一回合」後，在 `processRound()` 內部自動呼叫。

**判斷方式**：從**最高職級→最低職級**依序比對，找到第一個「所有屬性門檻都達到」的職業，即設為當前職業。若職業有改變，`game.js` 會偵測到並觸發晉升通知彈窗。

### 職業門檻表

| 職業 ID | 職業名稱 | 基礎薪資 | 智慧需求 | 毅力需求 | 社交需求 | 運氣需求 |
|---------|---------|---------|---------|---------|---------|---------|
| `student` | 學生 | 50 | — | — | — | — |
| `intern` | 實習生 | 120 | ≥ 3 | — | — | — |
| `junior` | 初級職員 | 250 | ≥ 5 | — | — | — |
| `senior` | 高級專員 | 500 | ≥ 8 | ≥ 5 | — | — |
| `manager` | 部門經理 | 1,000 | ≥ 10 | — | ≥ 8 | — |
| `entrepreneur` | 創業者 | 1,500 | ≥ 12 | — | — | ≥ 5 |

> ⚠️ **注意**：`entrepreneur` 要求智慧 ≥ 12，而屬性上限為 10，因此「創業者」職業透過一般屬性累積**無法達成**。僅能透過特殊事件效果（`incomeBonus`）模擬高收入。

---

## 💰 收入計算公式

每回合開始時，由 `player.getMonthlyIncome()` 計算：

```
月收入 = baseSalary（職業底薪）
       + stageBonus（當前人生階段底薪 - 50，作為環境加成）
       + incomeBonus（事件/特殊效果加成，can be negative）
       + wisdomBonus（baseSalary × wisdom × 2%）
```

**範例**：智慧 = 5，職業 `junior`（底薪 250），人生階段 2（baseIncome=200）
- stageBonus = 200 - 50 = 150
- wisdomBonus = 250 × 5 × 0.02 = 25
- **月收入 = 250 + 150 + 0 + 25 = 425**

---

## 📉 支出計算公式

```
月支出 = stageBaseExpense（當前階段基礎支出）
       + expenseBonus（豪華資產維護費、事件效果等）
       - perseveranceDiscount（stageBaseExpense × perseverance × 1%）
```

> 支出最低為 0，不會出現負值。

---

## 📈 投資系統（`GAME_DATA.investments`）

### 可投資項目

| ID | 名稱 | 年報酬率 | 風險等級 | 最低金額 |
|----|------|---------|---------|---------|
| `savings` | 🏦 銀行定存 | 2% | 低 | — |
| `fund` | 📈 指數基金 | 7% | 中 | — |
| `stock` | 📊 股票投資 | 12% | 高 | — |
| `property` | 🏢 房地產 | 5% | 中 | 1,000 金幣 |

### 複利計算（每回合 `player.calculateCompoundInterest()`）

```javascript
// 每項投資都執行以下：
luckFactor = 1 + (random - 0.5) * (luck * 0.02)  // 運氣微調報酬
returnRate = investOption.returnRate × marketMultiplier × luckFactor × investBonus
interest = amount × returnRate
investment[type] += interest  // 直接累積到本金（複利效果）
```

**市場狀態乘數**（每回合隨機切換）：
| 市場 | 乘數 | 觸發機率 |
|------|------|---------|
| 🐻 熊市 | ×0.5 | 20% |
| ⚖️ 平穩期 | ×1.0 | 50% |
| 🐂 牛市 | ×1.5 | 30% |

**特質影響**：
- `visionary`（遠見者）：`investBonus × 1.1`
- `risk_taker`（冒險家）：股票報酬 × 1.2，但虧損也 × 1.2

---

## 🎲 事件系統（`events.js`）

### 觸發邏輯（`Events.triggerRandomEvent()`）

每回合「下一回合」後，系統隨機抽取一個事件。事件有以下幾種類型：

| type 值 | 說明 |
|---------|------|
| `positive` | 正面事件，通常增加現金或屬性 |
| `negative` | 負面事件，通常扣除現金 |
| `neutral` | 中性事件，可能是知識問答等 |
| `decision` | 需要玩家做選擇（2 選項） |

### 保險緩衝（`Events.mitigateWithInsurance()`）

若玩家持有對應保險，`negative` 事件的現金扣除量會降低（依保險類型）。

### 事件效果套用（`Events.applyEventEffect()`）

常見效果欄位：
- `cash`：現金增減
- `stat`：屬性增減（wisdom / perseverance / social / luck）
- `addInsurance`：取得保險
- `buyLuxury`：購買豪華資產
- `career`：暫時改變收入加成

---

## 🏆 成就系統（`achievements.js`）

### 架構

- `ACHIEVEMENTS.positive`（20 個）：正面里程碑
- `ACHIEVEMENTS.negative`（15 個）：警示型成就
- `ACHIEVEMENTS.hidden`（5 個）：隱藏成就，畫面顯示 `???`

### 觸發時機

`game.checkAchievements()` 在以下時點呼叫：
1. 每次行動後
2. 每回合結算後
3. 遊戲結束時

成就只會被解鎖一次（不可重複），存於 `achievementSystem.unlockedAchievements` 中。

### 重要成就條件說明

| 成就 | 關鍵條件 | 備註 |
|------|---------|------|
| 🙈 理財盲（B10） | `!p.hasEverInvested && round >= 25` | 只要點過一次「確認投資」即不觸發 |
| 🏚️ 破產危機（B09） | `p.hadNegativeNetWorth` | 淨值曾為負即永久標記 |
| 🎯 精準投資（H02，隱藏） | 連續 10 次投資獲利 | `investWinStreak >= 10` |
| 🌈 逆轉人生（H04，隱藏） | 曾破產 + 最終淨值 ≥ 10,000 | 破產後翻身 |

---

## 👤 玩家屬性系統

屬性範圍：**0 ~ 10**（超過 10 會被 `Math.min(10, ...)` 截斷）

| 屬性 | 影響 |
|------|------|
| 智慧（wisdom）| 月收入加成（baseSalary × wisdom × 2%）；職業晉升門檻 |
| 毅力（perseverance）| 月支出折扣（baseExpense × perseverance × 1%）；職業門檻 |
| 社交（social）| 正面事件觸發率提升；職業晉升門檻 |
| 運氣（luck）| 投資報酬微調（luck × 2% 的隨機範圍） |

---

## 🎭 角色特質系統（`GAME_DATA.traits`）

特質在角色創建問答或遊戲事件中獲得：

| 特質 ID | 名稱 | 效果 |
|---------|------|------|
| `frugal` | 節儉者 | 月支出 ×0.8，社交成長減半 |
| `visionary` | 遠見者 | 投資報酬 +10%，主動收入 ×0.95 |
| `risk_taker` | 冒險家 | 股票報酬 ×1.2，負面事件損失 ×1.2 |
| `saver` | 儲蓄達人 | 現金存款利息翻倍 |
| `socialite` | 社交達人 | 社交效果 ×2，運氣 +1 |

---

## 🏎️ 豪華資產（`GAME_DATA.luxuries`）

| ID | 名稱 | 購買成本 | 每月維護費 | 效果 |
|----|------|---------|---------|------|
| `sports_car` | 豪華跑車 | 1,500 | +100/月 | 社交+2，運氣+1 |
| `luxury_watch` | 名貴腕錶 | 500 | 0 | 社交+1 |
| `mansion` | 獨棟別墅 | 5,000 | +200/月 | 社交+3，運氣+2 |

豪華資產透過**特殊事件**觸發購買選項，非直接在主介面購買。購買後會增加 `player.expenseBonus`（累加維護費）。

---

## 💾 存檔機制（`player.save()` / `Player.load()`）

- **儲存位置**：`localStorage.financeGame_save`（JSON 格式）
- **觸發時機**：每回合結算後、遊戲結束時
- **雲端存檔**：若 `Auth.isLoggedIn()` 為 `true`，同步至 `Auth.saveCloudData()`
- **讀取**：`Player.load()` 使用 `Object.assign(player, data)` 還原所有欄位
- **重置**：`Player.clearSave()` 刪除 localStorage 中的存檔

---

## 🎓 教學系統（`tutorial.js`）

- **觸發時機**：首次進入遊戲畫面後 500ms（若 `localStorage.financeGame_tutorialDone` 不存在）
- **步驟流程**：welcome → panel_left → finance → actions → invest → events → luxury_tutorial → compound → start
- **定位邏輯**：`positionPopup()` 根據 `step.position`（top/bottom/left/right/center）計算彈窗位置，並進行視窗邊界修正
- **重置**：`Tutorial.reset()` 清除 localStorage 標記，可在齒輪選單中觸發

---

## ⚙️ 齒輪選單（`game.showSettingsMenu()`）

點擊介面右上角的 ⚙️ 按鈕後跳出選單，提供：
- 🔄 重新開始遊戲（需確認）
- 📖 重新觀看教學
- 🏆 查看成就頁面
- ✖ 關閉選單

---

## 🔧 已知限制與待改善項目

| 項目 | 說明 |
|------|------|
| `entrepreneur` 職業不可達 | 智慧上限 10，但創業者要求智慧 12，建議降低門檻或改為特殊觸發機制 |
| `hasEverInvested` 未存入存檔 | `player.save()` 目前不儲存此標記，讀取後會重置，可能影響 B10 成就判定 |
| 歲數未隨階段更新 | `player.age` 初始為 12 但未隨回合累加，僅為靜態顯示 |
| 市場狀態未存入存檔 | `currentMarketState` 讀取後預設為 `stable` |
| 教學 `luxury_tutorial` 高亮目標 | `.luxury-panel` 是否存在於 HTML 中需確認 |
