/**
 * 財商小達人 v2.0 - 玩家系統（含成就追蹤）
 */

class Player {
    constructor(name = '玩家') {
        this.name = name;

        // 基礎屬性
        this.stats = {
            wisdom: 0,
            perseverance: 0,
            social: 0,
            luck: 0
        };

        // 財務狀況
        this.cash = 500;
        this.investments = {};
        this.debt = 0;

        // 收支
        this.baseIncome = 50;
        this.baseExpense = 30;
        this.incomeBonus = 0;
        this.expenseBonus = 0;

        // 遊戲狀態
        this.currentRound = 1;
        this.currentStage = 0;
        this.age = 12;

        // 統計（用於成就）
        this.totalInvested = 0;
        this.investmentReturn = 0;
        this.investmentLoss = 0;
        this.stockProfit = 0;

        // 保險狀態
        this.hasInsurance = false;
        this.hasHealthInsurance = false;
        this.hasPropertyInsurance = false;

        // 行動追蹤
        this.actionsThisRound = 0;
        this.maxActionsPerRound = 2;
        this.learnCount = 0;
        this.spendCount = 0;
        this.saveCount = 0;

        // 成就追蹤
        this.lowCashStreak = 0;
        this.noActionStreak = 0;
        this.investWinStreak = 0;
        this.scammedCount = 0;
        this.scamAvoided = 0;
        this.totalDonations = 0;
        this.missedOpportunities = 0;
        this.healthLoss = 0;
        this.hadNegativeNetWorth = false;
        this.hadImpulseBuy = false;
        this.hasProperty = false;
        this.quizzesPassed = 0;
        this.gamesCompleted = 0;
        this.hasEverInvested = false;
        this.maxDebtReached = 0;    // 追蹤曾達到的最高負債
        this.totalDebtTaken = 0;    // 追蹤曾借入的總負債金額
        this.eventHistory = [];     // 記錄事件歷史（用於故事產生）
        this.actionHistory = [];    // 記錄行動歷史（用於故事產生）
        this.careerHistory = [];    // 記錄職業變化

        // 角色特質與家庭狀態
        this.traits = []; // 具體特質 ID 列表
        this.familyStatus = 'single'; // single, married, parent
        this.luxuries = []; // 已購豪華物件 ID 列表
        this.activeIncomeHistory = [];
        this.passiveIncomeHistory = [];
        this.expenseHistory = [];

        this.currentCareer = 'student';
        this.currentMarketState = 'stable';
    }

    getTotalInvestments() {
        return Object.values(this.investments).reduce((sum, val) => sum + val, 0);
    }

    getNetWorth() {
        const netWorth = this.cash + this.getTotalInvestments() - this.debt;
        if (netWorth < 0) {
            this.hadNegativeNetWorth = true;
        }
        return netWorth;
    }

    getMonthlyIncome() {
        const careerData = GAME_DATA.careers.find(c => c.id === this.currentCareer);
        const baseSalary = careerData ? careerData.baseSalary : 50;

        // 額外加成
        const stageData = GAME_DATA.stages[this.currentStage];
        const stageBonus = stageData ? stageData.baseIncome - 50 : 0; // 階段性環境加成

        const wisdomBonus = Math.floor(baseSalary * (this.stats.wisdom * 0.02));
        return baseSalary + stageBonus + this.incomeBonus + wisdomBonus;
    }

    getMonthlyExpense() {
        const stageData = GAME_DATA.stages[this.currentStage];
        const baseExpense = stageData ? stageData.baseExpense : this.baseExpense;
        const perseveranceDiscount = Math.floor(baseExpense * (this.stats.perseverance * 0.01));
        return Math.max(0, baseExpense + this.expenseBonus - perseveranceDiscount);
    }

    addStat(stat, value) {
        if (this.stats.hasOwnProperty(stat)) {
            this.stats[stat] = Math.max(0, Math.min(20, this.stats[stat] + value));
            if (window.UI) UI.updateGameUI(this);
        }
    }

    addCash(amount) {
        this.cash += amount;
        if (this.cash < 0) {
            const debtAdded = Math.abs(this.cash);
            this.debt += debtAdded;
            this.totalDebtTaken += debtAdded;
            if (this.debt > this.maxDebtReached) this.maxDebtReached = this.debt;
            this.cash = 0;
        }

        // 追蹤低現金狀態
        if (this.cash < 50) {
            this.lowCashStreak++;
        } else {
            this.lowCashStreak = 0;
        }

        if (window.UI) UI.updateGameUI(this);
    }

    invest(type, amount) {
        if (amount <= 0 || amount > this.cash) return false;

        const investOption = GAME_DATA.investments.find(i => i.id === type);
        if (!investOption) return false;

        if (investOption.minAmount && amount < investOption.minAmount) {
            return false;
        }

        this.cash -= amount;
        if (!this.investments[type]) {
            this.investments[type] = 0;
        }
        this.investments[type] += amount;
        this.totalInvested += amount;
        this.hasEverInvested = true; // 標記為有投資過

        return true;
    }

    calculateCompoundInterest() {
        let totalReturn = 0;
        let hadLoss = false;

        const market = GAME_DATA.market.states.find(s => s.id === this.currentMarketState);
        let marketMultiplier = market ? market.multiplier : 1.0;

        // 特質影響：遠見者/冒險者
        let investBonus = 1.0;
        if (this.hasTrait('visionary')) investBonus *= 1.1;

        for (const [type, amount] of Object.entries(this.investments)) {
            const investOption = GAME_DATA.investments.find(i => i.id === type);
            if (investOption) {
                let currentRate = investOption.returnRate;
                if (type === 'stock' && this.hasTrait('risk_taker')) currentRate *= 1.2;

                const luckFactor = 1 + (Math.random() - 0.5) * (this.stats.luck * 0.02);
                const returnRate = currentRate * marketMultiplier * luckFactor * investBonus;
                const interest = amount * returnRate;

                this.investments[type] += interest;
                totalReturn += interest;

                if (interest < 0) {
                    hadLoss = true;
                    // 特質影響：冒險家損失也增加
                    const finalLoss = this.hasTrait('risk_taker') ? Math.abs(interest) * 1.2 : Math.abs(interest);
                    this.investmentLoss += finalLoss;
                } else {
                    if (type === 'stock') {
                        this.stockProfit += interest;
                    }
                }
            }
        }

        // 儲蓄利率特質
        if (this.investments['savings'] && this.hasTrait('saver')) {
            // 已在上方迴圈處理過基礎利息，這裡可以視為額外加成或是調整 returnRate
        }

        if (totalReturn > 0 && !hadLoss) {
            this.investWinStreak++;
        } else {
            this.investWinStreak = 0;
        }

        this.investmentReturn += Math.max(0, totalReturn);
        return totalReturn;
    }

    processRound() {
        const income = this.getMonthlyIncome();
        this.addCash(income);

        const expense = this.getMonthlyExpense();
        this.addCash(-expense);

        // 豪華資產維護費：若現金不足，自動累積為負債
        let maintenanceCost = 0;
        this.luxuries.forEach(luxuryId => {
            const lux = GAME_DATA.luxuries.find(l => l.id === luxuryId);
            if (lux && lux.maintenance > 0) maintenanceCost += lux.maintenance;
        });
        if (maintenanceCost > 0) {
            if (this.cash >= maintenanceCost) {
                this.cash -= maintenanceCost;
            } else {
                const shortfall = maintenanceCost - this.cash;
                this.cash = 0;
                this.debt += shortfall;
                this.totalDebtTaken += shortfall;
                if (this.debt > this.maxDebtReached) this.maxDebtReached = this.debt;
            }
            if (window.UI) UI.updateGameUI(this);
        }

        const interest = this.calculateCompoundInterest();

        if (this.debt > 0) {
            const debtInterest = this.debt * 0.05;
            this.debt += debtInterest;
            if (this.debt > this.maxDebtReached) this.maxDebtReached = this.debt;
        }

        // 追蹤無行動
        if (this.actionsThisRound === 0) {
            this.noActionStreak++;
        } else {
            this.noActionStreak = 0;
        }

        this.actionsThisRound = 0;
        this.currentRound++;

        // 年齡累加：從 12 到 60，共 25 回合，每回合 +2 歲
        this.age = Math.min(60, 12 + Math.floor((this.currentRound - 1) * 2));

        // 人生階段更新
        const stageThresholds = [0, 5, 10, 15, 20, 25];
        for (let i = GAME_DATA.stages.length - 1; i >= 0; i--) {
            if (this.currentRound > stageThresholds[i]) {
                this.currentStage = i;
                break;
            }
        }

        this.updateMarketState();
        this.checkCareerPromotion();

        // 記錄歷史數據（用於結算圖表）
        this.activeIncomeHistory.push(income);
        this.passiveIncomeHistory.push(Math.max(0, interest));
        this.expenseHistory.push(expense);

        return { income, expense, interest, market: this.currentMarketState };
    }

    hasTrait(traitId) {
        return this.traits.includes(traitId);
    }

    updateMarketState() {
        const rand = Math.random();
        let cumulative = 0;
        for (const state of GAME_DATA.market.states) {
            cumulative += state.chance;
            if (rand < cumulative) {
                this.currentMarketState = state.id;
                break;
            }
        }
    }

    checkCareerPromotion() {
        // 從最高級別開始檢查，符合條件就晉升
        const availableCareers = [...GAME_DATA.careers].reverse();
        for (const career of availableCareers) {
            const meetWisdom = this.stats.wisdom >= (career.minWisdom || 0);
            const meetPerseverance = this.stats.perseverance >= (career.minPerseverance || 0);
            const meetSocial = this.stats.social >= (career.minSocial || 0);
            const meetLuck = this.stats.luck >= (career.minLuck || 0);

            if (meetWisdom && meetPerseverance && meetSocial && meetLuck) {
                if (this.currentCareer !== career.id) {
                    this.currentCareer = career.id;
                    // TODO: 觸發通知
                }
                break;
            }
        }
    }

    getStageStartRound() {
        let start = 1;
        for (let i = 0; i < this.currentStage; i++) {
            start += GAME_DATA.stages[i].rounds;
        }
        return start;
    }

    getStageEndRound() {
        return this.getStageStartRound() + GAME_DATA.stages[this.currentStage].rounds - 1;
    }

    useAction() {
        if (this.actionsThisRound >= this.maxActionsPerRound) {
            return false;
        }
        this.actionsThisRound++;
        return true;
    }

    // 記錄衝動消費
    recordImpulseBuy(amount) {
        const netWorth = this.getNetWorth();
        if (amount > netWorth * 0.3) {
            this.hadImpulseBuy = true;
        }
    }

    // 增加特質
    addTrait(trait) {
        if (!this.traits.includes(trait)) {
            this.traits.push(trait);
        }
    }

    // 完成遊戲
    completeGame() {
        this.gamesCompleted++;
    }


    save(slotId = 1) {
        const saveData = {
            name: this.name,
            stats: this.stats,
            cash: this.cash,
            investments: this.investments,
            debt: this.debt,
            incomeBonus: this.incomeBonus,
            expenseBonus: this.expenseBonus,
            currentRound: this.currentRound,
            currentStage: this.currentStage,
            age: this.age,
            totalInvested: this.totalInvested,
            investmentReturn: this.investmentReturn,
            investmentLoss: this.investmentLoss,
            stockProfit: this.stockProfit,
            hasInsurance: this.hasInsurance,
            hasHealthInsurance: this.hasHealthInsurance,
            hasPropertyInsurance: this.hasPropertyInsurance,
            learnCount: this.learnCount,
            spendCount: this.spendCount,
            saveCount: this.saveCount,
            lowCashStreak: this.lowCashStreak,
            noActionStreak: this.noActionStreak,
            investWinStreak: this.investWinStreak,
            scammedCount: this.scammedCount,
            scamAvoided: this.scamAvoided,
            totalDonations: this.totalDonations,
            missedOpportunities: this.missedOpportunities,
            healthLoss: this.healthLoss,
            hadNegativeNetWorth: this.hadNegativeNetWorth,
            hadImpulseBuy: this.hadImpulseBuy,
            hasProperty: this.hasProperty,
            quizzesPassed: this.quizzesPassed,
            gamesCompleted: this.gamesCompleted,
            traits: this.traits,
            hasEverInvested: this.hasEverInvested,
            maxDebtReached: this.maxDebtReached,
            totalDebtTaken: this.totalDebtTaken,
            currentCareer: this.currentCareer,
            currentMarketState: this.currentMarketState,
            luxuries: this.luxuries,
            familyStatus: this.familyStatus,
            activeIncomeHistory: this.activeIncomeHistory,
            passiveIncomeHistory: this.passiveIncomeHistory,
            expenseHistory: this.expenseHistory,
            eventHistory: this.eventHistory,
            actionHistory: this.actionHistory,
            careerHistory: this.careerHistory,
            savedAt: new Date().toISOString(),
            slotLabel: `回合 ${this.currentRound - 1} / 年齡 ${this.age} 歲`
        };
        localStorage.setItem(`financeGame_save_${slotId}`, JSON.stringify(saveData));

        // 向下相容：同步到舊存檔鍵值
        localStorage.setItem('financeGame_save', JSON.stringify(saveData));

        // 雲端存檔
        if (typeof Auth !== 'undefined' && Auth && Auth.isLoggedIn()) {
            Auth.saveCloudData(saveData);
        }
    }

    static load(slotId = null) {
        // 若指定 slot，讀該 slot；否則嘗試舊格式向下相容
        const key = slotId ? `financeGame_save_${slotId}` : 'financeGame_save';
        const saveData = localStorage.getItem(key);
        if (!saveData) return null;

        try {
            const data = JSON.parse(saveData);
            const player = new Player(data.name);
            Object.assign(player, data);
            return player;
        } catch (e) {
            return null;
        }
    }

    // 取得三個存檔槽的摘要資訊
    static getSaveSlots() {
        const slots = [];
        for (let i = 1; i <= 3; i++) {
            const raw = localStorage.getItem(`financeGame_save_${i}`);
            if (raw) {
                try {
                    const d = JSON.parse(raw);
                    slots.push({
                        slotId: i,
                        isEmpty: false,
                        label: d.slotLabel || `回合 ${d.currentRound - 1}`,
                        name: d.name || '玩家',
                        netWorth: (d.cash || 0) + Object.values(d.investments || {}).reduce((s, v) => s + v, 0) - (d.debt || 0),
                        savedAt: d.savedAt
                    });
                } catch (e) {
                    slots.push({ slotId: i, isEmpty: true });
                }
            } else {
                slots.push({ slotId: i, isEmpty: true });
            }
        }
        return slots;
    }

    static clearSave(slotId = null) {
        if (slotId) {
            localStorage.removeItem(`financeGame_save_${slotId}`);
        } else {
            // 清除所有槽位
            for (let i = 1; i <= 3; i++) {
                localStorage.removeItem(`financeGame_save_${i}`);
            }
            localStorage.removeItem('financeGame_save');
        }
    }
}

