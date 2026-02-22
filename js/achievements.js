/**
 * 財商小達人 - 成就系統
 */

const ACHIEVEMENTS = {
    // 正面成就
    positive: [
        { id: 'A01', name: '🐣 理財新手', desc: '完成第一次投資', icon: '🐣', condition: (p) => p.totalInvested > 0 },
        { id: 'A02', name: '💰 小富翁', desc: '淨值達到 5,000', icon: '💰', condition: (p) => p.getNetWorth() >= 5000 },
        { id: 'A03', name: '💎 大富翁', desc: '淨值達到 20,000', icon: '💎', condition: (p) => p.getNetWorth() >= 20000 },
        { id: 'A04', name: '👑 財富自由', desc: '淨值達到 50,000', icon: '👑', condition: (p) => p.getNetWorth() >= 50000 },
        { id: 'A04B', name: '🌌 財富花園', desc: '淨值達到 150,000', icon: '🌌', condition: (p) => p.getNetWorth() >= 150000 },
        { id: 'A05', name: '📈 複利達人', desc: '投資收益超過本金', icon: '📈', condition: (p) => p.investmentReturn > p.totalInvested && p.totalInvested > 0 },
        { id: 'A06', name: '🏦 定存專家', desc: '銀行定存超過 1,000', icon: '🏦', condition: (p) => (p.investments.savings || 0) >= 1000 },
        { id: 'A07', name: '📊 股票高手', desc: '股票投資獲利超過 500', icon: '📊', condition: (p) => p.stockProfit >= 500 },
        { id: 'A08', name: '🏢 房產大亨', desc: '購買房地產', icon: '🏢', condition: (p) => (p.investments.property || 0) > 0 },
        { id: 'A09', name: '💪 毅力超群', desc: '毅力屬性達到 10', icon: '💪', condition: (p) => p.stats.perseverance >= 10 },
        { id: 'A10', name: '🧠 智慧過人', desc: '智慧屬性達到 10', icon: '🧠', condition: (p) => p.stats.wisdom >= 10 },
        { id: 'A11', name: '🤝 人緣極佳', desc: '社交屬性達到 10', icon: '🤝', condition: (p) => p.stats.social >= 10 },
        { id: 'A12', name: '🍀 幸運之星', desc: '運氣屬性達到 10', icon: '🍀', condition: (p) => p.stats.luck >= 10 },
        { id: 'A09B', name: '🔥 鐵血毅力', desc: '毅力屬性達到 15', icon: '🔥', condition: (p) => p.stats.perseverance >= 15 },
        { id: 'A10B', name: '👨‍💻 百科全書', desc: '智慧屬性達到 15', icon: '👨‍💻', condition: (p) => p.stats.wisdom >= 15 },
        { id: 'A11B', name: '🌟 社交大師', desc: '社交屬性達到 15', icon: '🌟', condition: (p) => p.stats.social >= 15 },
        { id: 'A12B', name: '✨ 天生幸運兒', desc: '運氣屬性達到 15', icon: '✨', condition: (p) => p.stats.luck >= 15 },
        { id: 'A09C', name: '🧘 山不轉移', desc: '毅力屬性達到 20', icon: '🧘', condition: (p) => p.stats.perseverance >= 20 },
        { id: 'A10C', name: '🔭 天才橫溢', desc: '智慧屬性達到 20', icon: '🔭', condition: (p) => p.stats.wisdom >= 20 },
        { id: 'A11C', name: '👑 化甸無老', desc: '社交屬性達到 20', icon: '👑', condition: (p) => p.stats.social >= 20 },
        { id: 'A12C', name: '🌈 天降豪雨', desc: '運氣屬性達到 20', icon: '🌈', condition: (p) => p.stats.luck >= 20 },
        { id: 'A13', name: '🛡️ 風險管理師', desc: '購買所有類型保險', icon: '🛡️', condition: (p) => p.hasInsurance && p.hasHealthInsurance && p.hasPropertyInsurance },
        { id: 'A14', name: '📚 終身學習者', desc: '學習行動累計 10 次', icon: '📚', condition: (p) => p.learnCount >= 10 },
        { id: 'A15', name: '🎓 財商博士', desc: '通過所有知識測驗', icon: '🎓', condition: (p) => p.quizzesPassed >= 5 },
        { id: 'A16', name: '🏆 人生贏家', desc: '完成整個遊戲', icon: '🏆', condition: (p) => p.currentRound > 25 },
        { id: 'A17', name: '❤️ 慈善家', desc: '捐款累計超過 500', icon: '❤️', condition: (p) => p.totalDonations >= 500 },
        { id: 'A18', name: '🌟 全能發展', desc: '四項屬性都達到 5 以上', icon: '🌟', condition: (p) => p.stats.wisdom >= 5 && p.stats.perseverance >= 5 && p.stats.social >= 5 && p.stats.luck >= 5 },
        { id: 'A19', name: '💵 現金為王', desc: '現金持有超過 10,000', icon: '💵', condition: (p) => p.cash >= 10000 },
        { id: 'A20', name: '🎖️ 無債一身輕', desc: '遊戲結束時沒有任何負債', icon: '🎖️', condition: (p) => p.debt === 0 && p.currentRound > 25 },
        { id: 'A21', name: '🏎️ 山銀豪客', desc: '擁有至少三件豪華資產', icon: '🏎️', condition: (p) => p.luxuries.length >= 3 },
        { id: 'A22', name: '💼 CFO 財務長', desc: '成為財務長 CFO', icon: '💼', condition: (p) => p.currentCareer === 'cfo' || p.currentCareer === 'angel_investor' || p.currentCareer === 'tycoon' },
        { id: 'A23', name: '👑 商業大亨', desc: '達到商業大亨職稱', icon: '👑', condition: (p) => p.currentCareer === 'tycoon' },
        { id: 'A24', name: '🏦 負債跟蹤者', desc: '負債超過 2,000 後依然尚未還清', icon: '🏦', condition: (p) => p.maxDebtReached >= 2000 }
    ],

    // 負面成就
    negative: [
        { id: 'B01', name: '💸 月光族', desc: '連續 5 回合現金低於 50', icon: '💸', condition: (p) => p.lowCashStreak >= 5 },
        { id: 'B02', name: '📉 投資失敗者', desc: '投資虧損超過 500', icon: '📉', condition: (p) => p.investmentLoss >= 500 },
        { id: 'B03', name: '💳 卡債人生', desc: '負債超過 1,000', icon: '💳', condition: (p) => p.debt >= 1000 },
        { id: 'B04', name: '🏥 健康警報', desc: '因生病事件損失超過 300', icon: '🏥', condition: (p) => p.healthLoss >= 300 },
        { id: 'B05', name: '😴 懶惰蟲', desc: '連續 3 回合不選擇任何行動', icon: '😴', condition: (p) => p.noActionStreak >= 3 },
        { id: 'B06', name: '🛒 購物狂', desc: '消費行動累計超過 15 次', icon: '🛒', condition: (p) => p.spendCount >= 15 },
        { id: 'B07', name: '🎰 賭徒心態', desc: '被詐騙事件損失金錢', icon: '🎰', condition: (p) => p.scammedCount > 0 },
        { id: 'B08', name: '😰 壓力山大', desc: '毅力歸零', icon: '😰', condition: (p) => p.stats.perseverance <= 0 },
        { id: 'B09', name: '🏚️ 破產危機', desc: '淨值曾經變成負數', icon: '🏚️', condition: (p) => p.hadNegativeNetWorth },
        { id: 'B10', name: '🙈 理財盲', desc: '遊戲結束時從未投資過', icon: '🙈', condition: (p) => !p.hasEverInvested && p.currentRound >= 25 },
        { id: 'B11', name: '💔 錯失良機', desc: '拒絕超過 5 次正面機會事件', icon: '💔', condition: (p) => p.missedOpportunities >= 5 },
        { id: 'B12', name: '🤑 守財奴', desc: '從未進行任何消費享樂', icon: '🤑', condition: (p) => p.spendCount === 0 && p.currentRound > 25 },
        { id: 'B13', name: '📵 社交孤島', desc: '社交屬性歸零', icon: '📵', condition: (p) => p.stats.social <= 0 },
        { id: 'B14', name: '🎪 衝動消費', desc: '單次消費超過總資產 30%', icon: '🎪', condition: (p) => p.hadImpulseBuy },
        { id: 'B15', name: '⏰ 時間乞丐', desc: '從未進行任何學習', icon: '⏰', condition: (p) => p.learnCount === 0 && p.currentRound > 25 }
    ],

    // 隱藏成就
    hidden: [
        { id: 'H01', name: '🦄 完美人生', desc: '獲得所有正面成就且無負面成就', icon: '🦄', hidden: true, condition: (p, earned) => earned.positive.length >= 20 && earned.negative.length === 0 },
        { id: 'H02', name: '🎯 精準投資', desc: '連續 10 次投資都獲利', icon: '🎯', hidden: true, condition: (p) => p.investWinStreak >= 10 },
        { id: 'H03', name: '🔮 預言家', desc: '避開所有詐騙事件', icon: '🔮', hidden: true, condition: (p) => p.scamAvoided >= 3 && p.scammedCount === 0 },
        { id: 'H04', name: '🌈 逆轉人生', desc: '從破產恢復到淨值 10,000', icon: '🌈', hidden: true, condition: (p) => p.hadNegativeNetWorth && p.getNetWorth() >= 10000 },
        { id: 'H05', name: '🎮 遊戲大師', desc: '完成遊戲 5 次以上', icon: '🎮', hidden: true, condition: (p) => p.gamesCompleted >= 5 },
        { id: 'H06', name: '🚀 大亨崛起', desc: '達到商業大亨職稱且淨值超過 100,000', icon: '🚀', hidden: true, condition: (p) => p.currentCareer === 'tycoon' && p.getNetWorth() >= 100000 },
        { id: 'H07', name: '🛥️ 豪富生活家', desc: '擁有全部豪華資產', icon: '🛥️', hidden: true, condition: (p) => p.luxuries.includes('sports_car') && p.luxuries.includes('yacht') && p.luxuries.includes('mansion') },
        { id: 'H08', name: '⚖️ 負債也能致富', desc: '貸款超過 5,000 後最終財富超過 30,000', icon: '⚖️', hidden: true, condition: (p) => p.totalDebtTaken >= 5000 && p.getNetWorth() >= 30000 }
    ]
};

class AchievementSystem {
    constructor() {
        this.unlockedAchievements = {
            positive: [],
            negative: [],
            hidden: []
        };
        this.newlyUnlocked = [];
    }

    // 從存檔載入成就
    loadFromSave(data) {
        if (data && data.achievements) {
            this.unlockedAchievements = data.achievements;
        }
    }

    // 檢查並解鎖成就
    checkAchievements(player) {
        this.newlyUnlocked = [];

        // 檢查正面成就
        ACHIEVEMENTS.positive.forEach(achievement => {
            if (!this.unlockedAchievements.positive.includes(achievement.id)) {
                if (achievement.condition(player)) {
                    this.unlockAchievement(achievement, 'positive');
                }
            }
        });

        // 檢查負面成就
        ACHIEVEMENTS.negative.forEach(achievement => {
            if (!this.unlockedAchievements.negative.includes(achievement.id)) {
                if (achievement.condition(player)) {
                    this.unlockAchievement(achievement, 'negative');
                }
            }
        });

        // 檢查隱藏成就
        ACHIEVEMENTS.hidden.forEach(achievement => {
            if (!this.unlockedAchievements.hidden.includes(achievement.id)) {
                if (achievement.condition(player, this.unlockedAchievements)) {
                    this.unlockAchievement(achievement, 'hidden');
                }
            }
        });

        return this.newlyUnlocked;
    }

    // 解鎖成就
    unlockAchievement(achievement, type) {
        this.unlockedAchievements[type].push(achievement.id);
        this.newlyUnlocked.push({ ...achievement, type });

        // 播放成就音效
        if (window.AudioManager) {
            AudioManager.play(type === 'negative' ? 'fail' : 'achievement');
        }
    }

    // 取得所有已解鎖成就
    getUnlockedAchievements() {
        const all = [];

        ['positive', 'negative', 'hidden'].forEach(type => {
            const achievements = ACHIEVEMENTS[type];
            this.unlockedAchievements[type].forEach(id => {
                const achievement = achievements.find(a => a.id === id);
                if (achievement) {
                    all.push({ ...achievement, type });
                }
            });
        });

        return all;
    }

    // 計算正面成就完成度
    getPositiveProgress() {
        return {
            unlocked: this.unlockedAchievements.positive.length,
            total: ACHIEVEMENTS.positive.length,
            percentage: Math.round((this.unlockedAchievements.positive.length / ACHIEVEMENTS.positive.length) * 100)
        };
    }

    // 檢查是否完成所有正面成就
    hasAllPositive() {
        return this.unlockedAchievements.positive.length >= ACHIEVEMENTS.positive.length;
    }

    // 取得成就資料以儲存
    getSaveData() {
        return this.unlockedAchievements;
    }

    // 重置成就（用於測試）
    reset() {
        this.unlockedAchievements = {
            positive: [],
            negative: [],
            hidden: []
        };
    }
}

// 全域成就系統實例
const achievementSystem = new AchievementSystem();
