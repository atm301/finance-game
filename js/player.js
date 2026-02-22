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

        // 角色特質（由問答決定）
        this.traits = [];
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
        const stageData = GAME_DATA.stages[this.currentStage];
        const baseIncome = stageData ? stageData.baseIncome : this.baseIncome;
        const wisdomBonus = Math.floor(baseIncome * (this.stats.wisdom * 0.02));
        return baseIncome + this.incomeBonus + wisdomBonus;
    }

    getMonthlyExpense() {
        const stageData = GAME_DATA.stages[this.currentStage];
        const baseExpense = stageData ? stageData.baseExpense : this.baseExpense;
        const perseveranceDiscount = Math.floor(baseExpense * (this.stats.perseverance * 0.01));
        return Math.max(0, baseExpense + this.expenseBonus - perseveranceDiscount);
    }

    addStat(stat, value) {
        if (this.stats.hasOwnProperty(stat)) {
            this.stats[stat] = Math.max(0, Math.min(10, this.stats[stat] + value));
        }
    }

    addCash(amount) {
        this.cash += amount;
        if (this.cash < 0) {
            this.debt += Math.abs(this.cash);
            this.cash = 0;
        }

        // 追蹤低現金狀態
        if (this.cash < 50) {
            this.lowCashStreak++;
        } else {
            this.lowCashStreak = 0;
        }
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

        return true;
    }

    calculateCompoundInterest() {
        let totalReturn = 0;
        let hadLoss = false;

        for (const [type, amount] of Object.entries(this.investments)) {
            const investOption = GAME_DATA.investments.find(i => i.id === type);
            if (investOption) {
                const luckFactor = 1 + (Math.random() - 0.5) * (this.stats.luck * 0.02);
                const returnRate = investOption.returnRate * luckFactor;
                const interest = amount * returnRate;

                this.investments[type] += interest;
                totalReturn += interest;

                if (interest < 0) {
                    hadLoss = true;
                    this.investmentLoss += Math.abs(interest);
                } else {
                    if (type === 'stock') {
                        this.stockProfit += interest;
                    }
                }
            }
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

        const interest = this.calculateCompoundInterest();

        if (this.debt > 0) {
            this.debt *= 1.05;
        }

        // 追蹤無行動
        if (this.actionsThisRound === 0) {
            this.noActionStreak++;
        } else {
            this.noActionStreak = 0;
        }

        this.actionsThisRound = 0;
        this.currentRound++;

        const stageData = GAME_DATA.stages[this.currentStage];
        if (stageData) {
            const roundsPerYear = stageData.rounds / (stageData.age[1] - stageData.age[0]);
            this.age = stageData.age[0] + Math.floor((this.currentRound - this.getStageStartRound()) / roundsPerYear);

            if (this.currentRound > this.getStageEndRound() && this.currentStage < GAME_DATA.stages.length - 1) {
                this.currentStage++;
            }
        }

        return { income, expense, interest };
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

    save() {
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
            traits: this.traits
        };
        localStorage.setItem('financeGame_save', JSON.stringify(saveData));

        // 雲端存檔
        if (Auth && Auth.isLoggedIn()) {
            Auth.saveCloudData(saveData);
        }
    }

    static load() {
        const saveData = localStorage.getItem('financeGame_save');
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

    static clearSave() {
        localStorage.removeItem('financeGame_save');
    }
}
