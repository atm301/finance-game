/**
 * 財商小達人 v2.0 - 遊戲資料
 * 包含問題庫、事件庫、投資選項等靜態資料
 */

const GAME_DATA = {
    // 人生階段定義
    stages: [
        { id: 'student', name: '📚 學生時期', age: [12, 18], rounds: 5, baseIncome: 50, baseExpense: 30 },
        { id: 'college', name: '🎓 大學時期', age: [18, 22], rounds: 5, baseIncome: 80, baseExpense: 60 },
        { id: 'newbie', name: '💼 職場新鮮人', age: [22, 30], rounds: 5, baseIncome: 200, baseExpense: 120 },
        { id: 'career', name: '📈 事業發展期', age: [30, 45], rounds: 5, baseIncome: 350, baseExpense: 200 },
        { id: 'retire', name: '🏖️ 退休準備期', age: [45, 60], rounds: 5, baseIncome: 400, baseExpense: 250 }
    ],

    // 角色創建問題庫（擴充版）
    questions: [
        {
            id: 'q1',
            text: '如果你撿到 100 元，你會怎麼做？',
            answers: [
                { text: '交給老師', effects: { wisdom: 2 }, trait: 'honest' },
                { text: '買零食吃掉', effects: { social: 1 }, trait: 'impulsive' },
                { text: '存進撲滿', effects: { perseverance: 2 }, trait: 'saver' },
                { text: '試著找失主', effects: { social: 2, luck: 1 }, trait: 'kind' }
            ]
        },
        {
            id: 'q2',
            text: '考試前一天，同學約你打電動，你會？',
            answers: [
                { text: '拒絕，繼續讀書', effects: { perseverance: 2 }, trait: 'disciplined' },
                { text: '先玩一下再說', effects: { social: 1, luck: 1 }, trait: 'balanced' },
                { text: '讀完書再去玩', effects: { wisdom: 1, perseverance: 1 }, trait: 'planner' },
                { text: '邀請同學一起讀書', effects: { wisdom: 1, social: 1 }, trait: 'leader' }
            ]
        },
        {
            id: 'q3',
            text: '過年拿到紅包，你會怎麼處理？',
            answers: [
                { text: '全部交給爸媽保管', effects: { wisdom: 1 }, trait: 'trusting' },
                { text: '買一直想要的玩具', effects: { luck: 1 }, trait: 'impulsive' },
                { text: '存一半、花一半', effects: { perseverance: 2, wisdom: 1 }, trait: 'balanced' },
                { text: '請同學吃東西', effects: { social: 2 }, trait: 'generous' }
            ]
        },
        {
            id: 'q4',
            text: '學校舉辦跳蚤市場，你會？',
            answers: [
                { text: '擺攤賣舊物品賺錢', effects: { wisdom: 2, social: 1 }, trait: 'entrepreneur' },
                { text: '到處逛逛買便宜貨', effects: { luck: 1 }, trait: 'shopper' },
                { text: '幫忙別人顧攤位', effects: { social: 2, perseverance: 1 }, trait: 'helper' },
                { text: '在家休息不參加', effects: { perseverance: 1 }, trait: 'introvert' }
            ]
        },
        {
            id: 'q5',
            text: '你存了零用錢想買新遊戲，但朋友說下個月會打折，你會？',
            answers: [
                { text: '等打折再買', effects: { perseverance: 2, wisdom: 1 }, trait: 'patient' },
                { text: '現在就買，等不及了', effects: { luck: 1 }, trait: 'impulsive' },
                { text: '先看看別的遊戲', effects: { wisdom: 1 }, trait: 'researcher' },
                { text: '跟朋友一起等打折', effects: { social: 1, perseverance: 1 }, trait: 'social' }
            ]
        },
        {
            id: 'q6',
            text: '老師說可以用零用錢投資學校的小農場計畫，你會？',
            answers: [
                { text: '投資一些，看看結果', effects: { wisdom: 2, luck: 1 }, trait: 'investor' },
                { text: '全部投資進去', effects: { luck: 2 }, trait: 'risk_taker' },
                { text: '先觀察別人怎麼做', effects: { wisdom: 1, perseverance: 1 }, trait: 'observer' },
                { text: '不投資，太冒險了', effects: { perseverance: 2 }, trait: 'conservative' }
            ]
        },
        {
            id: 'q7',
            text: '班上舉辦才藝表演，你會？',
            answers: [
                { text: '主動報名表演', effects: { social: 2, luck: 1 }, trait: 'performer' },
                { text: '幫忙佈置場地', effects: { perseverance: 1, social: 1 }, trait: 'helper' },
                { text: '擔任主持人', effects: { wisdom: 1, social: 2 }, trait: 'leader' },
                { text: '當觀眾就好', effects: { wisdom: 1 }, trait: 'observer' }
            ]
        },
        {
            id: 'q8',
            text: '如果你可以選擇一種超能力，你會選？',
            answers: [
                { text: '看穿未來', effects: { wisdom: 2, luck: 1 }, trait: 'visionary' },
                { text: '無限體力', effects: { perseverance: 3 }, trait: 'energetic' },
                { text: '讀心術', effects: { social: 2, wisdom: 1 }, trait: 'empathetic' },
                { text: '點石成金', effects: { luck: 3 }, trait: 'ambitious' }
            ]
        }
    ],

    // 投資選項（增加健康保險與財產保險）
    investments: [
        { id: 'savings', name: '🏦 銀行定存', returnRate: 0.02, risk: 'low', desc: '穩定安全，報酬較低' },
        { id: 'fund', name: '📈 指數基金', returnRate: 0.07, risk: 'medium', desc: '長期穩健，分散風險' },
        { id: 'stock', name: '📊 股票投資', returnRate: 0.12, risk: 'high', desc: '高風險高報酬' },
        { id: 'property', name: '🏢 房地產', returnRate: 0.05, risk: 'medium', desc: '穩定增值，需大筆資金', minAmount: 1000 }
    ],

    // 保險選項
    insurances: [
        { id: 'health', name: '🏥 健康保險', cost: 20, desc: '減少醫療支出', coverage: 'health' },
        { id: 'property', name: '🏠 財產保險', cost: 15, desc: '保障財物損失', coverage: 'property' },
        { id: 'life', name: '💖 人壽保險', cost: 25, desc: '全面保障', coverage: 'all' }
    ],

    // 隨機事件庫（大幅擴充）
    events: {
        positive: [
            { id: 'bonus', title: '🎁 獲得獎金', desc: '工作表現優異，獲得獎金！', effect: { cash: 100 } },
            { id: 'gift', title: '🎀 收到禮物', desc: '親戚送你一份現金禮物！', effect: { cash: 50 } },
            { id: 'invest_up', title: '📈 投資上漲', desc: '你的投資今天漲了不少！', effect: { investMultiplier: 1.1 } },
            { id: 'raise', title: '💰 加薪', desc: '老闆認可你的努力，幫你加薪！', effect: { incomeBonus: 20 } },
            { id: 'lucky', title: '🍀 幸運日', desc: '今天運氣特別好！', effect: { cash: 30, luck: 1 } },
            { id: 'scholarship', title: '🎓 獲得獎學金', desc: '成績優異，獲得獎學金！', effect: { cash: 200, wisdom: 1 } },
            { id: 'inheritance', title: '💎 意外遺產', desc: '遠房親戚留下一筆遺產。', effect: { cash: 300 } },
            { id: 'tax_refund', title: '💵 退稅', desc: '今年有退稅，收到意外之財！', effect: { cash: 80 } },
            { id: 'promotion', title: '📊 升職加薪', desc: '恭喜升職！薪水大幅增加。', effect: { incomeBonus: 50, social: 1 } },
            { id: 'side_income', title: '💼 額外收入', desc: '兼職工作帶來額外收入！', effect: { cash: 60 } },
            { id: 'friend_treat', title: '🍜 朋友請客', desc: '朋友心情好請你吃大餐！', effect: { social: 1 } },
            { id: 'market_boom', title: '🚀 市場大漲', desc: '股市大漲，你的投資翻倍！', effect: { investMultiplier: 1.2 } }
        ],
        negative: [
            { id: 'sick', title: '🏥 生病了', desc: '身體不舒服，需要看醫生。', effect: { cash: -80 }, category: 'health' },
            { id: 'broken', title: '🔧 東西壞了', desc: '手機螢幕摔破了，需要修理。', effect: { cash: -50 }, category: 'property' },
            { id: 'invest_down', title: '📉 投資下跌', desc: '市場不佳，投資虧損了一些。', effect: { investMultiplier: 0.9 } },
            { id: 'fine', title: '📝 繳交罰款', desc: '忘記繳費被罰款了。', effect: { cash: -30 } },
            { id: 'theft', title: '😱 遺失財物', desc: '不小心弄丟了錢包。', effect: { cash: -60 }, category: 'property' },
            { id: 'accident', title: '🚗 交通事故', desc: '發生小車禍，需要修車。', effect: { cash: -100 }, category: 'property' },
            { id: 'hospital', title: '🏨 住院治療', desc: '需要住院幾天，花費不少。', effect: { cash: -200 }, category: 'health' },
            { id: 'layoff', title: '📋 公司裁員', desc: '公司縮編，收入暫時減少。', effect: { incomeBonus: -30 } },
            { id: 'inflation', title: '📈 物價上漲', desc: '生活成本增加了。', effect: { expenseBonus: 10 } },
            { id: 'bad_investment', title: '💸 投資失利', desc: '一筆投資虧損了。', effect: { cash: -80 } },
            { id: 'family_emergency', title: '👨‍👩‍👧 家庭急事', desc: '家人需要幫忙，花費一筆錢。', effect: { cash: -70 } },
            { id: 'market_crash', title: '📉 市場崩盤', desc: '股市大跌，投資大幅縮水。', effect: { investMultiplier: 0.7 } }
        ],
        decision: [
            {
                id: 'side_job',
                title: '💼 兼職機會',
                desc: '朋友介紹一份兼職工作，要接受嗎？',
                choices: [
                    { text: '接受', effect: { incomeBonus: 30, perseverance: -1 } },
                    { text: '拒絕', effect: {}, missedOpportunity: true }
                ]
            },
            {
                id: 'health_insurance',
                title: '🏥 健康保險',
                desc: '保險公司推薦健康保險，每月 20 金幣。',
                choices: [
                    { text: '購買', effect: { expenseBonus: 20, hasHealthInsurance: true } },
                    { text: '不買', effect: {} }
                ]
            },
            {
                id: 'property_insurance',
                title: '🏠 財產保險',
                desc: '要買財產保險嗎？每月 15 金幣。',
                choices: [
                    { text: '購買', effect: { expenseBonus: 15, hasPropertyInsurance: true } },
                    { text: '不買', effect: {} }
                ]
            },
            {
                id: 'life_insurance',
                title: '💖 人壽保險',
                desc: '全面保障的人壽保險，每月 25 金幣。',
                choices: [
                    { text: '購買', effect: { expenseBonus: 25, hasInsurance: true } },
                    { text: '不買', effect: {} }
                ]
            },
            {
                id: 'invest_tip',
                title: '💡 神秘投資',
                desc: '陌生人說有個「穩賺不賠」的投資機會...',
                choices: [
                    { text: '相信他', effect: { cash: -100 }, isScam: true, scamChance: 0.7 },
                    { text: '不理會', effect: { wisdom: 1 }, scamAvoided: true }
                ]
            },
            {
                id: 'charity',
                title: '❤️ 慈善募款',
                desc: '學校舉辦愛心募款活動。',
                choices: [
                    { text: '捐款 50 金幣', effect: { cash: -50, social: 2, luck: 1 }, donation: 50 },
                    { text: '捐款 20 金幣', effect: { cash: -20, social: 1 }, donation: 20 },
                    { text: '不捐款', effect: {} }
                ]
            },
            {
                id: 'startup',
                title: '🚀 創業機會',
                desc: '朋友邀請你一起創業，需要投資 500 金幣。',
                choices: [
                    { text: '投資創業', effect: { cash: -500 }, startup: true, startupChance: 0.4 },
                    { text: '太冒險了', effect: {}, missedOpportunity: true }
                ]
            },
            {
                id: 'education',
                title: '📚 進修課程',
                desc: '有個專業進修課程，學費 100 金幣。',
                choices: [
                    { text: '報名學習', effect: { cash: -100, wisdom: 2, incomeBonus: 15 } },
                    { text: '自學就好', effect: { wisdom: 1 } }
                ]
            },
            {
                id: 'luxury',
                title: '🛍️ 奢侈品折扣',
                desc: '夢想中的奢侈品正在特價，要買嗎？',
                choices: [
                    { text: '買！人生苦短', effect: { cash: -200, social: 1 }, impulse: true },
                    { text: '不需要', effect: { perseverance: 1 } }
                ]
            },
            {
                id: 'wedding',
                title: '💒 朋友結婚',
                desc: '好朋友要結婚了，紅包要包多少？',
                choices: [
                    { text: '包 100 金幣（大方）', effect: { cash: -100, social: 2 }, donation: 100 },
                    { text: '包 50 金幣（適中）', effect: { cash: -50, social: 1 }, donation: 50 },
                    { text: '包 20 金幣（節省）', effect: { cash: -20 }, donation: 20 }
                ]
            },
            {
                id: 'house_buy',
                title: '🏠 買房機會',
                desc: '有便宜的房子出售，要貸款購買嗎？',
                choices: [
                    { text: '買房（貸款 2000）', effect: { debt: 2000, hasProperty: true } },
                    { text: '繼續租房', effect: {} }
                ]
            },
            {
                id: 'travel',
                title: '✈️ 旅遊邀約',
                desc: '朋友邀請一起出國旅遊，要去嗎？',
                choices: [
                    { text: '去！享受人生', effect: { cash: -300, social: 2, luck: 1 } },
                    { text: '太貴了不去', effect: {}, missedOpportunity: true }
                ]
            }
        ]
    },

    // 複利教學提示
    compoundTips: [
        '💡 複利就像滾雪球，越早開始滾，雪球越大！',
        '💡 愛因斯坦說：「複利是世界第八大奇蹟！」',
        '💡 每年 7% 的報酬率，10 年後資產會翻倍！',
        '💡 時間是複利最好的朋友，越早投資越好。',
        '💡 不要小看每一小筆投資，它們會慢慢成長。',
        '💡 72 法則：用 72 除以報酬率，就是翻倍所需年數！',
        '💡 定期定額投資，是最適合初學者的策略。',
        '💡 分散投資可以降低風險，不要把雞蛋放在同一個籃子。',
        '💡 長期投資比短期投機更穩健。',
        '💡 保險是風險管理的重要工具。'
    ],

    // 知識測驗題庫
    quizzes: [
        {
            question: '什麼是複利？',
            options: ['只有本金會產生利息', '利息也會再產生利息', '銀行收取的手續費', '政府收取的稅金'],
            correct: 1
        },
        {
            question: '以下哪種投資風險最低？',
            options: ['股票', '房地產', '銀行定存', '創業'],
            correct: 2
        },
        {
            question: '72 法則是用來計算什麼？',
            options: ['繳稅金額', '投資翻倍時間', '貸款利息', '保險費用'],
            correct: 1
        },
        {
            question: '分散投資的目的是？',
            options: ['增加報酬', '降低風險', '節省時間', '簡化管理'],
            correct: 1
        },
        {
            question: '什麼是「延遲滿足」？',
            options: ['立刻買想要的東西', '等待更好的時機再消費', '拒絕所有消費', '借錢消費'],
            correct: 1
        }
    ]
};
