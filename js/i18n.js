/**
 * 財商小達人 - 多語言支援
 */

const I18N = {
    currentLang: 'zh-TW',

    translations: {
        'zh-TW': {
            // 遊戲標題
            'game.title': '財商小達人',
            'game.subtitle': '人生理財模擬遊戲',

            // 開始畫面
            'start.description1': '🎯 學習理財的基本觀念',
            'start.description2': '📈 體驗複利的神奇威力',
            'start.description3': '🎮 模擬人生中的財務決策',
            'start.newGame': '開始遊戲',
            'start.continue': '繼續遊戲',
            'start.login': '登入',
            'start.logout': '登出',

            // 角色創建
            'character.title': '🌟 角色創建',
            'character.subtitle': '回答以下問題，決定你的起始能力！',
            'character.question': '問題',
            'character.stats': '目前屬性',

            // 屬性
            'stat.wisdom': '智慧',
            'stat.perseverance': '毅力',
            'stat.social': '社交',
            'stat.luck': '運氣',

            // 遊戲主畫面
            'game.round': '回合',
            'game.age': '歲',
            'game.player': '玩家',

            // 人生階段
            'stage.student': '📚 學生時期',
            'stage.college': '🎓 大學時期',
            'stage.newbie': '💼 職場新鮮人',
            'stage.career': '📈 事業發展期',
            'stage.retire': '🏖️ 退休準備期',

            // 財務
            'finance.title': '💎 財務狀況',
            'finance.cash': '現金',
            'finance.investments': '投資資產',
            'finance.debt': '負債',
            'finance.netWorth': '總淨值',
            'finance.income': '月收入',
            'finance.expense': '月支出',

            // 行動
            'action.title': '選擇行動',
            'action.save': '儲蓄',
            'action.invest': '投資',
            'action.spend': '消費',
            'action.learn': '學習',
            'action.nextRound': '進入下一回合',
            'action.remaining': '剩餘',

            // 投資
            'invest.title': '選擇投資項目',
            'invest.savings': '銀行定存',
            'invest.fund': '指數基金',
            'invest.stock': '股票投資',
            'invest.property': '房地產',
            'invest.amount': '投資金額',
            'invest.available': '可用',
            'invest.confirm': '確認投資',
            'invest.cancel': '取消',
            'invest.minAmount': '最低金額',
            'invest.return': '年報酬',
            'invest.risk': '風險',
            'invest.risk.low': '低',
            'invest.risk.medium': '中',
            'invest.risk.high': '高',

            // 複利
            'compound.title': '📊 複利成長',
            'compound.tip': '💡 越早投資，複利效果越明顯！',

            // 結算
            'result.title': '🎉 遊戲結束！',
            'result.finalNetWorth': '最終淨值',
            'result.totalReturn': '投資總收益',
            'result.achievements': '獲得成就',
            'result.lesson': '📚 複利小教室',
            'result.restart': '🔄 再玩一次',

            // 成就
            'achievements.title': '🏆 成就系統',
            'achievements.positive': '正面成就',
            'achievements.negative': '負面成就',
            'achievements.hidden': '隱藏成就',
            'achievements.locked': '尚未解鎖',
            'achievements.unlocked': '新成就解鎖！',

            // 設定
            'settings.title': '⚙️ 設定',
            'settings.sound': '音效',
            'settings.music': '音樂',
            'settings.language': '語言',
            'settings.save': '儲存',

            // 教學
            'tutorial.welcome': '歡迎來到財商小達人！',
            'tutorial.skip': '跳過教學',
            'tutorial.next': '下一步',
            'tutorial.finish': '開始遊戲',

            // 通用
            'common.confirm': '確認',
            'common.cancel': '取消',
            'common.close': '關閉',
            'common.coins': '金幣'
        },

        'en': {
            'game.title': 'Finance Master',
            'game.subtitle': 'Life Finance Simulation Game',
            'start.description1': '🎯 Learn basic financial concepts',
            'start.description2': '📈 Experience the magic of compound interest',
            'start.description3': '🎮 Simulate financial decisions in life',
            'start.newGame': 'New Game',
            'start.continue': 'Continue',
            'start.login': 'Login',
            'start.logout': 'Logout',
            'character.title': '🌟 Character Creation',
            'character.subtitle': 'Answer questions to determine your starting abilities!',
            'stat.wisdom': 'Wisdom',
            'stat.perseverance': 'Perseverance',
            'stat.social': 'Social',
            'stat.luck': 'Luck',
            'game.round': 'Round',
            'game.age': 'years old',
            'action.save': 'Save',
            'action.invest': 'Invest',
            'action.spend': 'Spend',
            'action.learn': 'Learn',
            'action.nextRound': 'Next Round',
            'finance.cash': 'Cash',
            'finance.investments': 'Investments',
            'finance.debt': 'Debt',
            'finance.netWorth': 'Net Worth',
            'result.title': '🎉 Game Over!',
            'result.restart': '🔄 Play Again',
            'achievements.unlocked': 'Achievement Unlocked!',
            'common.confirm': 'Confirm',
            'common.cancel': 'Cancel',
            'common.coins': 'coins'
        }
    },

    // 初始化
    init() {
        const savedLang = localStorage.getItem('financeGame_lang');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        }
    },

    // 翻譯
    t(key, replacements = {}) {
        const lang = this.translations[this.currentLang] || this.translations['zh-TW'];
        let text = lang[key] || this.translations['zh-TW'][key] || key;

        // 替換佔位符
        Object.entries(replacements).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, v);
        });

        return text;
    },

    // 切換語言
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('financeGame_lang', lang);
            this.updateUI();
        }
    },

    // 更新 UI 文字
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
    },

    // 取得可用語言
    getAvailableLanguages() {
        return [
            { code: 'zh-TW', name: '繁體中文' },
            { code: 'en', name: 'English' }
        ];
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    I18N.init();
});
