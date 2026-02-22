/**
 * 財商小達人 - UI 控制器
 */

const UI = {
    elements: {},
    animationLayer: null,

    init() {
        // 快取 DOM 元素
        this.elements = {
            screens: {
                start: document.getElementById('start-screen'),
                character: document.getElementById('character-screen'),
                game: document.getElementById('game-screen'),
                achievements: document.getElementById('achievements-screen'),
                result: document.getElementById('result-screen')
            },
            buttons: {
                start: document.getElementById('start-btn'),
                continue: document.getElementById('continue-btn'),
                menu: document.getElementById('menu-btn'),
                nextRound: document.getElementById('next-round-btn'),
                restart: document.getElementById('restart-btn')
            },
            character: {
                questionContainer: document.getElementById('question-container'),
                questionProgress: document.getElementById('question-progress'),
                questionCounter: document.getElementById('question-counter'),
                previewWisdom: document.getElementById('preview-wisdom'),
                previewPerseverance: document.getElementById('preview-perseverance'),
                previewSocial: document.getElementById('preview-social'),
                previewLuck: document.getElementById('preview-luck')
            },
            game: {
                currentStage: document.getElementById('current-stage'),
                currentRound: document.getElementById('current-round'),
                playerName: document.getElementById('player-name'),
                playerAge: document.getElementById('player-age'),
                statWisdom: document.getElementById('stat-wisdom'),
                statWisdomNum: document.getElementById('stat-wisdom-num'),
                statPerseverance: document.getElementById('stat-perseverance'),
                statPerseveranceNum: document.getElementById('stat-perseverance-num'),
                statSocial: document.getElementById('stat-social'),
                statSocialNum: document.getElementById('stat-social-num'),
                statLuck: document.getElementById('stat-luck'),
                statLuckNum: document.getElementById('stat-luck-num'),
                cash: document.getElementById('cash'),
                investments: document.getElementById('investments'),
                debt: document.getElementById('debt'),
                netWorth: document.getElementById('net-worth'),
                monthlyIncome: document.getElementById('monthly-income'),
                monthlyExpense: document.getElementById('monthly-expense'),
                eventArea: document.getElementById('event-area'),
                actionArea: document.getElementById('action-area')
            },
            result: {
                finalNetWorth: document.getElementById('final-net-worth'),
                totalInvestmentReturn: document.getElementById('total-investment-return'),
                achievements: document.getElementById('achievements'),
                compoundLesson: document.getElementById('compound-lesson-text')
            },
            modal: document.getElementById('modal'),
            modalContent: document.getElementById('modal-content')
        };

        this.animationLayer = document.getElementById('animation-layer');
    },

    // 切換畫面
    showScreen(screenName) {
        Object.values(this.elements.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        if (this.elements.screens[screenName]) {
            this.elements.screens[screenName].classList.add('active');
        }
    },

    // 顯示問題
    showQuestion(question, index, total) {
        const container = this.elements.character.questionContainer;
        const progress = ((index + 1) / total) * 100;

        this.elements.character.questionProgress.style.width = `${progress}%`;
        this.elements.character.questionCounter.textContent = `問題 ${index + 1}/${total}`;

        container.innerHTML = `
            <p class="question-text">${question.text}</p>
            <div class="answer-options">
                ${question.answers.map((answer, i) => `
                    <button class="answer-btn" data-index="${i}">
                        <span class="answer-letter">${String.fromCharCode(65 + i)}</span>
                        <span>${answer.text}</span>
                    </button>
                `).join('')}
            </div>
        `;
    },

    // 更新屬性預覽
    updateStatsPreview(stats) {
        const elements = {
            wisdom: this.elements.character.previewWisdom,
            perseverance: this.elements.character.previewPerseverance,
            social: this.elements.character.previewSocial,
            luck: this.elements.character.previewLuck
        };

        for (const [stat, el] of Object.entries(elements)) {
            const newValue = stats[stat];
            const currentValue = parseInt(el.textContent) || 0;

            if (newValue > currentValue) {
                el.classList.add('animate');
                setTimeout(() => el.classList.remove('animate'), 500);
            }
            el.textContent = newValue;
        }
    },

    // 更新遊戲主介面
    updateGameUI(player) {
        const g = this.elements.game;
        const stageData = GAME_DATA.stages[player.currentStage];

        // 更新階段與回合
        g.currentStage.textContent = stageData ? stageData.name : '';
        g.currentRound.textContent = player.currentRound;

        // 更新玩家資訊
        g.playerName.textContent = player.name;
        g.playerAge.textContent = `${player.age} 歲`;

        // 更新屬性條
        const maxStat = 10;
        g.statWisdom.style.width = `${(player.stats.wisdom / maxStat) * 100}%`;
        g.statWisdomNum.textContent = player.stats.wisdom;
        g.statPerseverance.style.width = `${(player.stats.perseverance / maxStat) * 100}%`;
        g.statPerseveranceNum.textContent = player.stats.perseverance;
        g.statSocial.style.width = `${(player.stats.social / maxStat) * 100}%`;
        g.statSocialNum.textContent = player.stats.social;
        g.statLuck.style.width = `${(player.stats.luck / maxStat) * 100}%`;
        g.statLuckNum.textContent = player.stats.luck;

        // 更新財務
        g.cash.textContent = Finance.formatMoney(Math.round(player.cash));
        g.investments.textContent = Finance.formatMoney(Math.round(player.getTotalInvestments()));
        g.debt.textContent = Finance.formatMoney(Math.round(player.debt));
        g.netWorth.textContent = Finance.formatMoney(Math.round(player.getNetWorth()));
        g.monthlyIncome.textContent = `+${player.getMonthlyIncome()}`;
        g.monthlyExpense.textContent = `-${player.getMonthlyExpense()}`;
    },

    // 顯示事件卡片
    showEvent(event) {
        const eventArea = this.elements.game.eventArea;
        let html = `
            <div class="event-card">
                <div class="event-icon">${this.getEventIcon(event)}</div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.desc}</p>
        `;

        // 決策事件顯示選項
        if (event.type === 'decision' && event.choices) {
            html += `<div class="decision-choices" style="margin-top: 20px;">`;
            event.choices.forEach((choice, i) => {
                html += `
                    <button class="btn btn-secondary decision-btn" data-choice="${i}" style="margin: 8px;">
                        ${choice.text}
                    </button>
                `;
            });
            html += `</div>`;
        }

        // 保險提示
        if (event.insured) {
            html += `<p style="color: var(--accent-green); margin-top: 12px;">🛡️ 保險已減輕損失！</p>`;
        }

        html += `</div>`;
        eventArea.innerHTML = html;
    },

    // 顯示回合結算
    showRoundSummary(result, event) {
        const eventArea = this.elements.game.eventArea;
        let html = `
            <div class="event-card">
                <div class="event-icon">📊</div>
                <h3 class="event-title">回合結算</h3>
                <div class="round-summary" style="text-align: left; margin-top: 16px;">
                    <p>📥 收入：<span style="color: var(--accent-green);">+${result.income}</span> 金幣</p>
                    <p>📤 支出：<span style="color: var(--accent-red);">-${result.expense}</span> 金幣</p>
                    <p>📈 投資收益：<span style="color: var(--accent-gold);">+${Math.round(result.interest)}</span> 金幣</p>
                </div>
            </div>
        `;
        eventArea.innerHTML = html;
    },

    // 取得事件圖標
    getEventIcon(event) {
        const icons = {
            positive: '🎉',
            negative: '⚠️',
            decision: '🤔'
        };
        return icons[event.type] || '📢';
    },

    // 顯示彈窗
    showModal(content) {
        this.elements.modalContent.innerHTML = content;
        this.elements.modal.classList.add('active');
    },

    // 隱藏彈窗
    hideModal() {
        this.elements.modal.classList.remove('active');
    },

    // 顯示投資選項彈窗
    showInvestModal(player) {
        const maxInvest = Math.floor(player.cash);
        let html = `
            <div class="modal-header">
                <div class="modal-icon">📈</div>
                <h3 class="modal-title">選擇投資項目</h3>
            </div>
            <div class="modal-body">
                <div class="investment-options">
                    ${GAME_DATA.investments.map(inv => `
                        <div class="investment-option" data-id="${inv.id}" ${inv.minAmount && maxInvest < inv.minAmount ? 'style="opacity: 0.5;"' : ''}>
                            <span class="investment-icon">${inv.name.split(' ')[0]}</span>
                            <div class="investment-info">
                                <div class="investment-name">${inv.name.split(' ').slice(1).join(' ')}</div>
                                <div class="investment-desc">${inv.desc}</div>
                                ${inv.minAmount ? `<div style="color: var(--accent-gold); font-size: 0.8rem;">最低 ${inv.minAmount} 金幣</div>` : ''}
                            </div>
                            <div class="investment-return">
                                <div class="return-rate">年報酬 ${Math.round(inv.returnRate * 100)}%</div>
                                <div class="return-risk">風險：${inv.risk === 'low' ? '低' : inv.risk === 'medium' ? '中' : '高'}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="invest-amount">
                    <label>投資金額（可用：${maxInvest} 金幣）</label>
                    <div class="amount-input-group">
                        <input type="number" id="invest-amount-input" min="1" max="${maxInvest}" value="${Math.min(100, maxInvest)}" placeholder="輸入金額">
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" id="cancel-invest-btn">取消</button>
                <button class="btn btn-primary" id="confirm-invest-btn">確認投資</button>
            </div>
        `;
        this.showModal(html);
    },

    // 顯示結算畫面
    showResult(player) {
        this.showScreen('result');

        const r = this.elements.result;
        r.finalNetWorth.textContent = `💎 ${Finance.formatMoney(Math.round(player.getNetWorth()))}`;
        r.totalInvestmentReturn.textContent = `💎 ${Finance.formatMoney(Math.round(player.investmentReturn))}`;

        // 檢查成就
        const earnedAchievements = GAME_DATA.achievements.filter(a => a.condition(player));
        r.achievements.innerHTML = `
            <h3>🏆 獲得成就</h3>
            <div class="achievement-list">
                ${earnedAchievements.map(a => `
                    <div class="achievement-badge">
                        <span>${a.name}</span>
                    </div>
                `).join('')}
                ${earnedAchievements.length === 0 ? '<p style="color: var(--text-muted);">繼續努力！</p>' : ''}
            </div>
        `;

        // 複利教學總結
        const comparison = Finance.compareInvestment(500, 0.07, 25);
        r.compoundLesson.innerHTML = `
            如果從一開始就把 500 金幣投資（年報酬 7%），經過 25 回合後，你的資產會變成 <strong style="color: var(--accent-gold);">${Finance.formatMoney(comparison.withInvest)}</strong> 金幣！
            這就是複利的威力 — 你的錢會幫你賺更多錢！💰
        `;
    },

    // 金幣飛入動畫
    animateCoinGain(amount, x, y) {
        if (!this.animationLayer) return;

        const coin = document.createElement('div');
        coin.className = 'coin-animation';
        coin.textContent = '💎';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;

        this.animationLayer.appendChild(coin);

        setTimeout(() => coin.remove(), 1000);

        // 數字動畫
        const valueEl = document.createElement('div');
        valueEl.className = `value-change ${amount > 0 ? 'positive' : 'negative'}`;
        valueEl.textContent = `${amount > 0 ? '+' : ''}${amount}`;
        valueEl.style.left = `${x + 30}px`;
        valueEl.style.top = `${y}px`;

        this.animationLayer.appendChild(valueEl);

        setTimeout(() => valueEl.remove(), 1500);
    }
};
