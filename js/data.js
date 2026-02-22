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

    // 職業系統 (Career System)
    careers: [
        { id: 'student', name: '學生', minWisdom: 0, baseSalary: 50, desc: '半工半讀，收入有限。' },
        { id: 'intern', name: '實習生', minWisdom: 3, baseSalary: 120, desc: '累積經驗中。' },
        { id: 'junior', name: '初級職員', minWisdom: 5, baseSalary: 250, desc: '穩定的職場起點。' },
        { id: 'senior', name: '高級專員', minWisdom: 8, minPerseverance: 5, baseSalary: 500, desc: '專業領域的佼佼者。' },
        { id: 'manager', name: '部門經理', minWisdom: 10, minSocial: 8, baseSalary: 1000, desc: '帶領團隊，高薪高壓。' },
        { id: 'entrepreneur', name: '創業者', minWisdom: 14, minLuck: 5, baseSalary: 1500, desc: '開創未來，收入浮動大。' },
        { id: 'cfo', name: '財務長 CFO', minWisdom: 15, minPerseverance: 10, minSocial: 12, baseSalary: 2500, desc: '主導企業財務策略，年薪優渥。' },
        { id: 'angel_investor', name: '天使投資人', minWisdom: 18, minPerseverance: 12, minSocial: 15, minLuck: 10, baseSalary: 4000, desc: '以資金扶持新創，分享高額報酬。' },
        { id: 'tycoon', name: '商業大亨', minWisdom: 20, minPerseverance: 15, minSocial: 18, minLuck: 12, baseSalary: 8000, desc: '站上商業頂峰，掌控市場。' }
    ],

    // 市場波動參數 (Market Volatility)
    market: {
        states: [
            { id: 'bear', name: '🐻 熊市 (低迷)', multiplier: 0.5, chance: 0.2, color: '#ef4444' },
            { id: 'stable', name: '⚖️ 平穩期', multiplier: 1.0, chance: 0.5, color: '#94a3b8' },
            { id: 'bull', name: '🐂 牛市 (繁榮)', multiplier: 1.5, chance: 0.3, color: '#10b981' }
        ]
    },

    // 角色特質系統 (Character Traits)
    traits: [
        { id: 'frugal', name: '💸 節儉者', desc: '每月支出減少 20%，但社交屬性成長減半。', effect: { expenseMultiplier: 0.8, socialRate: 0.5 } },
        { id: 'visionary', name: '🔭 遠見者', desc: '投資報酬潛力增加 10%，但主動收入略低。', effect: { investBonus: 1.1, incomeMultiplier: 0.95 } },
        { id: 'risk_taker', name: '🎲 冒險家', desc: '股市報酬增加 20%，但負面事件損失也增加 20%。', effect: { stockBonus: 1.2, negativeMultiplier: 1.2 } },
        { id: 'saver', name: '🐷 儲蓄達人', desc: '現金存款利息翻倍。', effect: { savingsRate: 2.0 } },
        { id: 'socialite', name: '🥂 社交達人', desc: '社交效果翻倍，且更容易觸發正面事件。', effect: { socialBonus: 2.0, luckBonus: 1 } }
    ],

    // 豪華物件/資產 (Luxuries & Assets)
    luxuries: [
        { id: 'sports_car', name: '🏎️ 豪華跑車', cost: 1500, loanOption: true, downPayment: 450, loanAmount: 1050, maintenance: 100, effect: { social: 2, luck: 1 }, desc: '身份的象徵，但維護費高。' },
        { id: 'luxury_watch', name: '⌚ 名貴腕錶', cost: 500, maintenance: 0, effect: { social: 1 }, desc: '提升品味，價值穩定。' },
        { id: 'mansion', name: '🏰 獨棟別墅', cost: 5000, loanOption: true, downPayment: 1000, loanAmount: 4000, maintenance: 200, effect: { social: 3, luck: 2 }, desc: '頂級居住體驗。' },
        { id: 'yacht', name: '🛥️ 豪華遊艇', cost: 8000, loanOption: true, downPayment: 2000, loanAmount: 6000, maintenance: 300, effect: { social: 4, luck: 3, wisdom: 1 }, desc: '財富的極致彰顯。' },
        { id: 'private_jet', name: '✈️ 私人飛機', cost: 20000, loanOption: true, downPayment: 5000, loanAmount: 15000, maintenance: 500, effect: { social: 5, luck: 4, wisdom: 2 }, desc: '全球商業往來的最高效工具。' }
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
            { id: 'market_boom', title: '🚀 市場大漲', desc: '股市大漲，你的投資翻倍！', effect: { investMultiplier: 1.2 } },
            { id: 'lucky_lottery', title: '🎰 幸運彩票', desc: '隨手買了張彩券，竟然中獎了！', effect: { cash: 500, luck: 2 } },
            { id: 'lucky_streak', title: '🍀 幸運連連', desc: '最近事事順心，運氣大提升！', effect: { luck: 3 } },
            { id: 'lucky_charm', title: '✨ 幸運符到手', desc: '朋友送你一個幸運護身符。', effect: { luck: 1 } },
            { id: 'wisdom_revelation', title: '💡 頓悟時刻', desc: '讀到一本理財好書，茅塞頓開！', effect: { wisdom: 2, cash: 0 } },
            { id: 'social_network', title: '🤝 拓展人脈', desc: '參加商業晚宴，結識多位貴人！', effect: { social: 2, incomeBonus: 30 } }
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
            { id: 'market_crash', title: '📉 市場崩盤', desc: '股市大跌，投資大幅縮水。', effect: { investMultiplier: 0.7 } },
            { id: 'credit_card_bill', title: '💳 信用卡爆表', desc: '信用卡帳單驚人，被迫借款支付！', effect: { cash: -300, debt: 300 } },
            { id: 'medical_emergency', title: '🚑 醫療緊急', desc: '突發重病！醫療費用高昂，現金不足只能舉債。', effect: { cash: -500, debt: 300, luck: -2 }, category: 'health' },
            { id: 'bad_luck_streak', title: '🌧️ 黴運連連', desc: '最近諸事不順，運氣大降。', effect: { luck: -2, cash: -50 } },
            { id: 'luxury_breakdown', title: '💔 豪車故障', desc: '豪華座駕突然拋錨，高額修繕費讓你措手不及！', effect: { cash: -500, debt: 200 }, requiresLuxury: true },
            { id: 'scam_loss', title: '🕵️ 遭受詐騙', desc: '不慎點進釣魚連結，帳戶被盜！', effect: { cash: -400, luck: -1 } },
            { id: 'court_fine', title: '⚖️ 法律糾紛', desc: '遭人提告，敗訴後需支付賠償金與律師費。', effect: { cash: -300, debt: 200, social: -1 } }
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
            },
            {
                id: 'marriage_proposal',
                title: '💍 談婚論嫁',
                desc: '與另一半感情穩定，考慮走入職場新階段（結婚）嗎？',
                choices: [
                    { text: '舉辦浪漫婚禮 (1000)', effect: { cash: -1000, familyStatus: 'married', incomeBonus: 200, expenseBonus: 150 } },
                    { text: '簡單公證 (200)', effect: { cash: -200, familyStatus: 'married', incomeBonus: 200, expenseBonus: 120 } },
                    { text: '再等一下', effect: {} }
                ]
            },
            {
                id: 'baby_plan',
                title: '🍼 育兒驚喜',
                desc: '迎接家中的新成員！雖然開銷會增加，但也會帶來動力。',
                choices: [
                    { text: '全力栽培', effect: { familyStatus: 'parent', expenseBonus: 300, perseverance: 3 } },
                    { text: '普通生活', effect: { familyStatus: 'parent', expenseBonus: 150, perseverance: 1 } }
                ],
                condition: (player) => player.familyStatus === 'married'
            },
            {
                id: 'luxury_opportunity',
                title: '🏎️ 夢想座駕',
                desc: '業務向你推薦一款限量版跑車，雖然價格昂貴，但能提升社交與運氣。',
                choices: [
                    { text: '全額買下 (1500)', effect: { cash: -1500, buyLuxury: 'sports_car' } },
                    { text: '分期付款 (首付 450，貸款 1050)', effect: { cash: -450, debt: 1050, buyLuxury: 'sports_car' } },
                    { text: '理性消費', effect: {} }
                ],
                condition: (player) => player.cash >= 450 && !player.luxuries.includes('sports_car')
            },
            {
                id: 'yacht_invitation',
                title: '🛥️ 豪華遊艇俱樂部',
                desc: '高端商業圈邀你加入遊艇俱樂部，一艘豪華遊艇象徵著頂尖身份。',
                choices: [
                    { text: '全額購入 (8000)', effect: { cash: -8000, buyLuxury: 'yacht' } },
                    { text: '分期付款 (首付 2000，貸款 6000)', effect: { cash: -2000, debt: 6000, buyLuxury: 'yacht' } },
                    { text: '婉拒', effect: { missedOpportunity: true } }
                ],
                condition: (player) => player.stats.social >= 12 && !player.luxuries.includes('yacht')
            },
            {
                id: 'loan_offer',
                title: '🏦 銀行貸款方案',
                desc: '銀行主動提供個人信用貸款方案，最高可借 1000 金幣，年利率 5%。',
                choices: [
                    { text: '借入 1000 金幣', effect: { cash: 1000, debt: 1000 } },
                    { text: '借入 500 金幣', effect: { cash: 500, debt: 500 } },
                    { text: '不需要', effect: {} }
                ]
            },
            {
                id: 'friend_borrow',
                title: '👤 好友借錢',
                desc: '多年好友說周轉不靈，想借 200 金幣，說下個月還。',
                choices: [
                    { text: '借出 200 金幣（50% 機率追不回）', effect: { cash: -200 }, friendLoan: true },
                    { text: '婉拒（保住現金）', effect: { social: -1 } }
                ]
            },
            {
                id: 'lucky_oracle',
                title: '🔮 神秘占星師',
                desc: '街頭占星師說花 50 金幣可以改變你的命運，要試試嗎？',
                choices: [
                    { text: '花錢改運 (50)', effect: { cash: -50, luck: 3 } },
                    { text: '不信這套', effect: { wisdom: 1 } }
                ]
            },
            {
                id: 'luxury_auction',
                title: '🔨 豪宅拍賣會',
                desc: '名人別墅以低價拍賣，這是千載難逢的機會！',
                choices: [
                    { text: '全額購入 (5000)', effect: { cash: -5000, buyLuxury: 'mansion' } },
                    { text: '分期付款 (首付 1000，貸款 4000)', effect: { cash: -1000, debt: 4000, buyLuxury: 'mansion' } },
                    { text: '放棄', effect: { missedOpportunity: true } }
                ],
                condition: (player) => player.cash >= 1000 && !player.luxuries.includes('mansion')
            },
            {
                id: 'repay_debt',
                title: '💳 提前還款優惠',
                desc: '銀行推出提前還款優惠，可免 10% 違約金。立刻還清部分負債嗎？',
                choices: [
                    { text: '還清 30% 負債', effect: { repayDebtPercent: 0.3 } },
                    { text: '繼續繳最低還款額', effect: {} }
                ],
                condition: (player) => player.debt > 0,
                knowledgeTip: '提前還清負債可節省未來的利息支出。但若利率低於投資報酬率，有時保留負債反而更有利。'
            },

            // ═══ 新增深度財商情境事件 ═══

            {
                id: 'stock_crash_child_sick',
                title: '📉 股市大崩盤，同時孩子生病',
                desc: '股市近期暴跌 40%，此時孩子突然生病，手術費需要你現有資金的 60%。你手上的股票若現在賣出會大幅虧損…',
                choices: [
                    { text: '🏥 賣股支付手術費（虧損但保命）', effect: { cashPercent: -0.6, investMultiplier: 0.6 } },
                    { text: '🏦 貸款支付（保住股票，增加負債）', effect: { debt: 800 }, dynamicDebt: true },
                    { text: '⏳ 先觀望股市回升再決定（風險高）', effect: { luck: -2, cash: -200 } }
                ],
                condition: (player) => player.familyStatus === 'parent',
                knowledgeTip: '🔑 緊急預備金的重要性！財務規劃中建議保留 3~6 個月生活費的現金作為緊急準備，避免在市場低點被迫賣出資產。這就是「流動性風險」的真實教訓。'
            },

            {
                id: 'housing_market_crash',
                title: '🏠 房市大跌 30%，你持有房產',
                desc: '全台房市因升息大跌 30%，你名下的房子市值縮水了，每月還要繳貸款。現在該怎麼辦？',
                choices: [
                    { text: '🏠 硬撐不賣（持有等待回升）', effect: { perseverance: 1 } },
                    { text: '📉 低價賣出止損，回收資金再投資', effect: { cash: 1500, debt: -2000 } },
                    { text: '🏘️ 轉為出租，每月收被動租金', effect: { incomeBonus: 80 } }
                ],
                condition: (player) => player.hasProperty,
                knowledgeTip: '🔑 房地產是「非流動資產」，不適合短期操作。好的策略是看現金流：若出租收益能覆蓋貸款利息，持有通常優於認賠賣出。資產 vs. 負債的關鍵在於它是否能為你帶來收入。'
            },

            {
                id: 'inflation_crisis',
                title: '📈 通膨飆升 8%，現金購買力大跌',
                desc: '近期通膨率高達 8%，你的現金存款每年實際上縮水 8%。該怎麼辦？',
                choices: [
                    { text: '💰 繼續放銀行定存（安全但虧損）', effect: { wisdom: -1 } },
                    { text: '📊 轉投資指數型基金（長期抗通膨）', effect: { cash: -300, wisdom: 2 }, startup: true, startupChance: 0.8 },
                    { text: '🥇 買黃金/實物資產保值', effect: { cash: -200, luck: 1, wisdom: 1 } }
                ],
                knowledgeTip: '🔑 通貨膨脹是儲蓄者的隱形敵人。若年通膨 8%，放在銀行利率 1% 的錢，實際購買力每年縮水約 7%。長期持有股票指數基金（如 ETF）的年報酬率歷史上平均約 7~10%，是對抗通膨的好工具。'
            },

            {
                id: 'crypto_crash',
                title: '💸 虛擬貨幣暴跌 80%',
                desc: '你的朋友極力推薦的虛擬貨幣，昨天突然暴跌 80%。你之前也跟著買了一些，現在怎麼辦？',
                choices: [
                    { text: '🔥 全部賣出認賠（拿回剩餘資金）', effect: { cash: 100, investMultiplier: 0.2, wisdom: 1 } },
                    { text: '📈 繼續持有賭反彈（高風險）', effect: { luck: -1 } },
                    { text: '🤦 加倉攤平（危險操作）', effect: { cash: -300, luck: -2 } }
                ],
                knowledgeTip: '🔑 加密貨幣屬於高波動性投機資產，不適合作為主要投資組合。投資前問自己：如果這筆錢歸零，我能接受嗎？「不要投入你輸不起的錢」是最基本的投資原則，分散投資可降低單一資產崩盤的衝擊。'
            },

            {
                id: 'parents_retirement',
                title: '👴 父母宣布退休，需要子女贍養',
                desc: '父母同時退休，每月需要你提供生活費補貼約 150 金幣。這會大幅影響你的財務規劃…',
                choices: [
                    { text: '💖 全力支援（每月 150 金幣）', effect: { expenseBonus: 150, social: 2, perseverance: 1 } },
                    { text: '🤝 協商減少（每月 80 金幣）', effect: { expenseBonus: 80, social: 1 } },
                    { text: '😔 說明自己財務困難，暫緩', effect: { social: -1, perseverance: 1 } }
                ],
                knowledgeTip: '🔑 「三明治世代」是指同時要養育子女又要贍養父母的族群。財務規劃時，需要提前考慮父母的養老費用，並建議父母在有工作時即開始規劃退休金（如勞保老年給付、退休帳戶），減輕子女未來的壓力。'
            },

            {
                id: 'job_loss_medical',
                title: '😰 突然失業，同時面對醫療費用',
                desc: '公司突然倒閉讓你失業，同一週你又被診斷出需要一筆治療費用。雙重衝擊下，你手上的積蓄能撐多久？',
                choices: [
                    { text: '🏥 優先處理醫療，動用積蓄', effect: { cashPercent: -0.5, wisdom: 1 } },
                    { text: '🔍 先找工作，醫療分期付款', effect: { debt: 400, incomeBonus: -50 }, startupChance: 0.6, startup: true },
                    { text: '📑 申請政府補助（失業給付+健保）', effect: { cash: 200, wisdom: 2 } }
                ],
                knowledgeTip: '🔑 緊急預備金與保險是財務安全網的兩大支柱。建議持有 3~6 個月生活費的流動資金，並確保有健保（重大疾病險）與失業保險的保障。失業時可申請勞保失業給付，最長可領 6 個月。'
            },

            {
                id: 'earthquake_damage',
                title: '🏚️ 地震造成房屋損壞',
                desc: '一場地震讓你的房屋牆壁出現裂縫，修繕費用估計要 600 金幣。有買地震險嗎？',
                choices: [
                    { text: '✅ 有買地震險，申請理賠', effect: { cash: 300, wisdom: 1 } },
                    { text: '💸 沒有保險，自費修繕', effect: { cash: -600 } },
                    { text: '⏳ 先暫時居住，延後修繕', effect: { luck: -1, cash: -100 } }
                ],
                knowledgeTip: '🔑 台灣位於地震帶，地震險是相當重要的保障。「住宅地震基本保險」每年保費不到 2000 元，最高理賠 150 萬，是高CP值的保險。保險的核心邏輯是：用小額固定支出，換取低機率但高損失風險的保障。'
            },

            {
                id: 'startup_failure',
                title: '💀 創業失敗，債主上門',
                desc: '你投資的朋友創業公司宣告倒閉，除了損失投入的資金，還有你保證的連帶債務需要處理…',
                choices: [
                    { text: '⚖️ 與律師協商，制定還款計畫', effect: { cash: -200, debt: 600, wisdom: 2 } },
                    { text: '🏃 用積蓄快速償清債務', effect: { cashPercent: -0.4, debt: 0 } },
                    { text: '📋 申請個人破產保護（最後手段）', effect: { debt: -1000, cash: -500, social: -3, wisdom: 3 } }
                ],
                knowledgeTip: '🔑 投資前做好盡職調查（Due Diligence）！對他人貸款或當保人風險極高——別人倒了，你也要負責。創業投資應有「最多損失全部」的心理準備，並設定停損點。不要投入超過你能承受損失的金額。'
            },

            {
                id: 'tax_audit',
                title: '🔍 稅務稽查，有未申報收入',
                desc: '國稅局寄來稽查通知，指出你有未申報的兼職收入，需要補繳稅款加上罰款。',
                choices: [
                    { text: '📝 誠實補繳稅款（罰款較低）', effect: { cash: -300, wisdom: 2 } },
                    { text: '👨‍⚖️ 聘請稅務律師協商', effect: { cash: -200, wisdom: 1 } },
                    { text: '😤 硬撐不繳（後果嚴重）', effect: { cash: -600, social: -2, luck: -2 } }
                ],
                knowledgeTip: '🔑 誠實報稅是公民義務，也是財務健全的基礎。各類收入（薪資、兼職、投資利得）都需申報。合法節稅和逃稅是完全不同的概念：前者是善用法規（如退休金、捐款抵稅）；後者面臨法律風險。聘請合格會計師可幫你合法省稅。'
            },

            {
                id: 'unexpected_pregnancy',
                title: '🍼 意外迎來新生命',
                desc: '計劃外的寶寶即將誕生！孕期與育兒費用預估需要 800 金幣，同時你的工作也需要調整。',
                choices: [
                    { text: '❤️ 全心迎接，調整財務計畫', effect: { cash: -400, familyStatus: 'parent', expenseBonus: 200, perseverance: 3 } },
                    { text: '📊 仔細規劃，申請育兒補助', effect: { cash: -200, familyStatus: 'parent', expenseBonus: 150, wisdom: 2 } }
                ],
                knowledgeTip: '🔑 迎接新生命前，建議評估「生育成本」：台灣一個孩子從出生到大學的養育費用估計超過 500 萬元。政府有多項育兒補助可申請（育兒津貼、育嬰假、托育補助），善用這些資源可大幅減輕負擔。'
            },

            {
                id: 'divorce_cost',
                title: '💔 婚姻關係出現危機',
                desc: '婚姻觸礁，可能面臨離婚。除了情感衝擊，財產分配、子女監護費用也需要考慮。',
                choices: [
                    { text: '🤝 協議離婚（較省費用）', effect: { cash: -500, familyStatus: 'single', expenseBonus: -100, social: -1 } },
                    { text: '👨‍👩‍👧 尋求家庭諮商，努力修復', effect: { cash: -200, social: 2, wisdom: 1 } },
                    { text: '⚖️ 訴訟離婚（費時費錢）', effect: { cash: -1000, familyStatus: 'single', debt: 500, wisdom: 2 } }
                ],
                condition: (player) => player.familyStatus === 'married',
                knowledgeTip: '🔑 婚前財產協議（婚前協議書）可以清楚界定財產歸屬，降低離婚糾紛。婚後建議夫妻共同規劃財務，分配家庭帳戶（生活費）、個人帳戶（自由支配）和投資帳戶，培養財務透明度。'
            },

            {
                id: 'market_bubble_warning',
                title: '⚠️ 分析師警告市場泡沫',
                desc: '知名分析師發出警告，認為股市可能存在泡沫即將破裂，但也有人認為牛市仍將持續。你選擇？',
                choices: [
                    { text: '📉 相信預警，出售部分股票保守操作', effect: { investMultiplier: 0.8, wisdom: 1 }, startup: true, startupChance: 0.5 },
                    { text: '📊 維持現有配置，長期持有不動', effect: { perseverance: 2 } },
                    { text: '🚀 逆向思考，加碼買進', effect: { cash: -400 }, startup: true, startupChance: 0.4 }
                ],
                knowledgeTip: '🔑 「市場時機」是投資中最難的事！研究顯示，長期投資者試圖「逃頂進谷」往往比不上持續定期定額投資。巴菲特名言：「在別人恐懼時貪婪，在別人貪婪時恐懼。」長期投資最重要的是「時間在市場」，而非「擇時進出市場」。'
            },

            {
                id: 'inheritance_dispute',
                title: '💎 意外繼承遺產，但有糾紛',
                desc: '遠親過世，留下一筆遺產，但其他親屬也有繼承權，可能需要對簿公堂才能獲得你的份額。',
                choices: [
                    { text: '⚖️ 聘請律師爭取完整繼承', effect: { cash: -300, wisdom: 1 }, startup: true, startupChance: 0.6 },
                    { text: '🤝 協議均分，快速了結', effect: { cash: 400, social: 1 } },
                    { text: '💸 放棄繼承（省去麻煩）', effect: { wisdom: 1, luck: -1 } }
                ],
                knowledgeTip: '🔑 遺產規劃的重要性！立遺囑可以清楚說明財產分配意願，避免後代紛爭。台灣《民法》有「特留分」制度保障繼承人的最低繼承比例。贈與稅、遺產稅的合法安排，可大幅減少財富移轉的稅務成本。'
            },

            {
                id: 'passive_income_opportunity',
                title: '💡 創造被動收入的機會',
                desc: '朋友介紹你購買出租套房，頭期款 800 金幣，每月可收取租金 100 金幣，投資報酬率約 15%。',
                choices: [
                    { text: '🏘️ 投資出租套房（需要頭期款）', effect: { cash: -800, incomeBonus: 100 }, condition: (p) => p.cash >= 800 },
                    { text: '📖 先研究房地產投資學習', effect: { wisdom: 2, cash: -50 } },
                    { text: '⏳ 等待更好的機會', effect: {} }
                ],
                condition: (player) => player.currentRound >= 12,
                knowledgeTip: '🔑 被動收入是財務自由的關鍵！當被動收入 > 生活支出，你就達到「財務自由」。常見種類：租金收入、股息、版稅、網路廣告收入。出租房產的「租金投報率」=每年租金淨收入÷購買成本，台灣平均約 2~3%，需仔細評估。'
            },

            {
                id: 'college_fund_dilemma',
                title: '🎓 孩子的大學教育基金',
                desc: '孩子還有 10 年就要上大學，大學四年費用估計需要 600 金幣。現在就要開始存嗎？',
                choices: [
                    { text: '📊 現在開始每月定期定額投資（100/月）', effect: { expenseBonus: 100, wisdom: 2, perseverance: 2 } },
                    { text: '🏦 一次存入教育基金帳戶（500）', effect: { cash: -500, wisdom: 3 }, condition: (p) => p.cash >= 500 },
                    { text: '⏳ 等以後收入更多再說', effect: { luck: -1 } }
                ],
                condition: (player) => player.familyStatus === 'parent',
                knowledgeTip: '🔑 複利的威力！現在每月投資 100 金幣，10 年後（假設年報酬 7%）將成長為約 1740 金幣。等 5 年後才開始存，同樣每月 100 金幣，只能累積約 732 金幣。「越早開始，越少痛苦」是複利的精髓。'
            },

            {
                id: 'windfall_decision',
                title: '🎰 意外獲得一大筆橫財',
                desc: '你购彩中了大獎！獲得 2000 金幣的意外之財。這筆錢應該怎麼用最聰明？',
                choices: [
                    { text: '🎉 全部揮霍享受人生（消費）', effect: { cash: 2000, social: 3, luck: -1 } },
                    { text: '📊 50%投資 + 30%還債 + 20%消費', effect: { cash: 400, debt: -600 }, startup: true, startupChance: 0.7 },
                    { text: '💰 全部存入投資帳戶（長期增值）', effect: { wisdom: 3, perseverance: 2 }, startup: true, startupChance: 0.8 }
                ],
                knowledgeTip: '🔑 橫財管理 50/30/20 法則的應用：遇到意外之財，推薦：50%用於投資/理財→長期增值；30%用於還清高利率負債→節省利息；20%放鬆享受→心理健康。「享樂主義適應」告訴我們，消費帶來的快樂往往快速消退，而投資的複利效果是永久的。'
            },

            {
                id: 'retirement_plan',
                title: '🏖️ 規劃退休時間表',
                desc: '你開始認真思考退休計畫。根據目前的財務狀況，你打算如何規劃退休？',
                choices: [
                    { text: '📊 按 4% 法則計算，積極存退休金', effect: { expenseBonus: 200, perseverance: 3, wisdom: 2 } },
                    { text: '🏠 買房出租，靠租金退休', effect: { cash: -500, incomeBonus: 80, wisdom: 1 } },
                    { text: '💰 開始購買年金保險', effect: { expenseBonus: 100, luck: 1, wisdom: 1 } }
                ],
                condition: (player) => player.currentRound >= 18,
                knowledgeTip: '🔑「4% 法則」：若你的資產是年支出的 25 倍，你可以每年提取 4% 生活，歷史上資金能支撐 30 年以上。例如：年支出 60 萬，需儲蓄 1500 萬。這說明了財務獨立/提早退休（FIRE 運動）的核心邏輯：降低支出和提高儲蓄率，是最有效的加速方式。'
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
        { question: '什麼是複利？', options: ['只有本金會產生利息', '利息也會再產生利息', '銀行收取的手續費', '政府收取的稅金'], correct: 1 },
        { question: '以下哪種投資風險最低？', options: ['股票', '房地產', '銀行定存', '創業'], correct: 2 },
        { question: '72 法則是用來計算什麼？', options: ['繳稅金額', '投資翻倍時間', '貸款利息', '保險費用'], correct: 1 },
        { question: '分散投資的目的是？', options: ['增加報酬', '降低風險', '節省時間', '簡化管理'], correct: 1 },
        { question: '什麼是「延遲滿足」？', options: ['立刻買想要的東西', '等待更好的時機再消費', '拒絕所有消費', '借錢消費'], correct: 1 }
    ],

    // 每回合問答題庫（依照期數）
    roundQuizzes: [
        // 早期（回合 1-10）
        { round: 'early', question: '儲蓄的最大好處是？', options: ['立即享受', '應急與累積財富', '讓朋友羨慕', '減少工作壓力'], correct: 1, reward: { stat: 'wisdom', value: 1 } },
        { round: 'early', question: '月收入比月支出多，稱為？', options: ['赤字', '平衡', '盈餘', '負債'], correct: 2, reward: { stat: 'wisdom', value: 1 } },
        { round: 'early', question: '信用卡若每月只還「最低還款額」會怎樣？', options: ['沒問題', '累積高額利息', '提升信用評分', '獲得獎勵點數'], correct: 1, reward: { stat: 'perseverance', value: 1 } },
        { round: 'early', question: '緊急預備金建議存多少月份的生活費？', options: ['1 個月', '3-6 個月', '12 個月以上', '可以不存'], correct: 1, reward: { stat: 'wisdom', value: 1 } },
        { round: 'early', question: '下列哪項是「負債」？', options: ['銀行存款', '股票', '信用卡欠款', '薪水'], correct: 2, reward: { stat: 'wisdom', value: 1 } },
        // 中期（回合 11-20）
        { round: 'mid', question: 'ETF 指數基金最大的優點是？', options: ['保證獲利', '分散風險且費用低', '不需要任何本金', '可以隨時贖回不虧損'], correct: 1, reward: { stat: 'wisdom', value: 1 } },
        { round: 'mid', question: '「複利」的關鍵要素是？', options: ['高報酬率', '時間', '大量資金', '專業知識'], correct: 1, reward: { stat: 'wisdom', value: 1 } },
        { round: 'mid', question: '牛市通常代表什麼？', options: ['股市下跌趨勢', '股市上漲趨勢', '市場低迷', '政治動盪'], correct: 1, reward: { stat: 'luck', value: 1 } },
        { round: 'mid', question: '資產配置的目的是？', options: ['追求最高報酬', '降低整體風險', '規避所有稅務', '快速致富'], correct: 1, reward: { stat: 'wisdom', value: 1 } },
        { round: 'mid', question: '通貨膨脹對現金儲蓄者的影響是？', options: ['購買力提升', '購買力下降', '沒有影響', '讓存款利息增加'], correct: 1, reward: { stat: 'perseverance', value: 1 } },
        // 晚期（回合 21-25）
        { round: 'late', question: '退休規劃中「4% 法則」指的是？', options: ['每年存收入的4%', '每年從資產提取4%生活費', '投資報酬率要達到4%', '退休年齡的4倍存款'], correct: 1, reward: { stat: 'wisdom', value: 2 } },
        { round: 'late', question: '被動收入超過生活支出，代表達成了什麼？', options: ['財務破產', '財務自由', '財務危機', '財務保守'], correct: 1, reward: { stat: 'wisdom', value: 2 } },
        { round: 'late', question: '公司的「本益比（P/E）」越高，通常代表？', options: ['股票便宜', '市場對未來成長有較高期待', '公司快要倒閉', '股息發得越多'], correct: 1, reward: { stat: 'wisdom', value: 2 } },
        { round: 'late', question: '遺產規劃的核心目的是？', options: ['逃稅', '確保財富按意願傳承', '讓後代不用工作', '秘密藏錢'], correct: 1, reward: { stat: 'social', value: 1 } },
        { round: 'late', question: '「再平衡（Rebalancing）」投資組合的意思是？', options: ['賣掉所有投資', '定期調整回目標資產配置比例', '增加高風險投資', '換一個銀行帳戶'], correct: 1, reward: { stat: 'wisdom', value: 2 } }
    ]
};
