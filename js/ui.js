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
                actionArea: document.getElementById('action-area'),
                marketStatus: document.getElementById('market-status'),
                playerCareer: document.getElementById('player-career'),
                playerFamily: document.getElementById('player-family'),
                playerTraits: document.getElementById('player-traits'),
                luxuryList: document.getElementById('luxury-list'),
                eventArea: document.getElementById('event-area')
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
        // 隱藏所有已登記的畫面
        Object.values(this.elements.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // 嘗試透過已登記物件切換
        if (this.elements.screens[screenName]) {
            this.elements.screens[screenName].classList.add('active');
            return;
        }

        // 後備：直接找 id="{screenName}-screen" 的元素
        const el = document.getElementById(`${screenName}-screen`);
        if (el) el.classList.add('active');
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
        g.netWorth.textContent = Finance.formatMoney(Math.round(player.getNetWorth())); // 新增淨值更新
        g.monthlyIncome.textContent = `+${player.getMonthlyIncome()}`;
        g.monthlyExpense.textContent = `-${player.getMonthlyExpense()}`;

        // 更新職業與市場
        const careerData = GAME_DATA.careers.find(c => c.id === player.currentCareer);
        g.playerCareer.textContent = `${careerData ? careerData.name : player.currentCareer}`;

        const marketData = GAME_DATA.market.states.find(s => s.id === player.currentMarketState);
        if (marketData) {
            g.marketStatus.textContent = marketData.name;
            g.marketStatus.style.color = marketData.color;
        }

        // 更新特質顯示
        g.playerTraits.innerHTML = player.traits.map(tId => {
            const trait = GAME_DATA.traits.find(t => t.id === tId);
            return trait ? `<span class="badge" style="background: var(--primary-color); font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; color: white;">${trait.name}</span>` : '';
        }).join('');

        // 更新家庭狀態
        const familyText = { single: '💍 單身', married: '👨‍👩‍👧 已婚', parent: '👶 育兒中' };
        g.playerFamily.textContent = familyText[player.familyStatus] || '💍 單身';

        // 更新豪華資產
        if (player.luxuries.length > 0) {
            g.luxuryList.innerHTML = player.luxuries.map(lId => {
                const item = GAME_DATA.luxuries.find(lux => lux.id === lId);
                return item ? `<span class="badge" style="background: rgba(251, 191, 36, 0.1); color: var(--accent-gold); font-size: 0.7rem; padding: 2px 6px; border: 1px solid var(--accent-gold); border-radius: 4px;">${item.name}</span>` : '';
            }).join('');
        } else {
            g.luxuryList.innerHTML = '<span style="font-size: 0.8rem; color: var(--text-muted);">尚無資產</span>';
        }

        // 更新圖表（包含主動、被動收入與支出歷史）
        if (window.game && window.game.growthChart) {
            window.game.growthChart.setData(
                window.game.growthHistory,
                player.passiveIncomeHistory,
                player.expenseHistory
            );
        }
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

    showInvestModal(player) {
        const investments = GAME_DATA.investments;
        const currentHoldings = player.investments;

        const optionsHTML = investments.map(inv => {
            const held = Math.round(currentHoldings[inv.id] || 0);
            const returnPct = (inv.returnRate * 100).toFixed(1);
            const riskColor = inv.risk === 'high' ? 'var(--accent-red, #ef4444)' : inv.risk === 'medium' ? 'var(--accent-gold)' : 'var(--accent-green)';
            const riskLabel = inv.risk === 'high' ? '高風險' : inv.risk === 'medium' ? '中風險' : '低風險';
            return `
                <div class="investment-option" data-id="${inv.id}" style="border: 2px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.2s;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${inv.icon || '📊'} ${inv.name}</strong>
                        <span style="font-size:0.75rem; color:${riskColor}; padding: 2px 8px; border: 1px solid ${riskColor}; border-radius:20px;">${riskLabel}</span>
                    </div>
                    <div style="font-size:0.8rem; color: var(--text-secondary); margin: 6px 0;">${inv.desc || ''}</div>
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                        <span style="color: var(--accent-green);">年報酬率約 ${returnPct}%</span>
                        ${inv.minAmount ? `<span style="color: var(--text-muted);">最低 ${inv.minAmount} 金幣</span>` : ''}
                    </div>
                    ${held > 0 ? `<div style="margin-top:6px; font-size:0.8rem; color: var(--accent-gold);">💼 目前持有：${Finance.formatMoney(held)} 金幣</div>` : ''}
                </div>
            `;
        }).join('');

        const html = `
            <div class="modal-header">
                <div class="modal-icon">📈</div>
                <h3 class="modal-title">選擇投資項目</h3>
            </div>
            <div class="modal-body">
                <p style="color: var(--text-secondary); margin-bottom: 12px;">💰 可用現金：<strong style="color: var(--accent-green);">${Finance.formatMoney(Math.round(player.cash))} 金幣</strong></p>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
                    ${optionsHTML}
                </div>
                <div style="margin-top: 12px;">
                    <label style="display:block; margin-bottom:6px; font-size:0.9rem;">投資金額（金幣）：</label>
                    <input type="number" id="invest-amount-input" min="1" max="${Math.floor(player.cash)}"
                        value="${Math.min(100, Math.floor(player.cash))}"
                        style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: var(--text-primary); font-size:1rem;">
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" id="cancel-invest-btn">取消</button>
                <button class="btn btn-primary" id="confirm-invest-btn">確認投資 📈</button>
            </div>
        `;
        this.showModal(html);

        // 選項高亮樣式
        document.querySelectorAll('.investment-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.investment-option').forEach(o => {
                    o.style.borderColor = 'rgba(255,255,255,0.1)';
                    o.style.background = '';
                });
                opt.style.borderColor = 'var(--primary-color)';
                opt.style.background = 'rgba(99, 102, 241, 0.15)';
                opt.classList.add('selected');
            });
        });
    },

    // 顯示晉升彈窗
    showPromotionModal(career) {
        const html = `
            <div class="modal-header">
                <div class="modal-icon">🎊</div>
                <h3 class="modal-title">職位晉升通知</h3>
            </div>
            <div class="modal-body" style="text-align: center;">
                <p>恭喜！由於你的努力與成長，你已晉升為：</p>
                <h2 style="color: var(--accent-gold); margin: 16px 0;">${career.name}</h2>
                <p style="color: var(--text-secondary);">${career.desc}</p>
                <div style="margin-top: 20px; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 12px;">
                    <span style="color: var(--accent-green);">💰 基礎薪資提升至：${career.baseSalary} 金幣</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" id="promotion-confirm-btn">太棒了！</button>
            </div>
        `;
        this.showModal(html);
        document.getElementById('promotion-confirm-btn').addEventListener('click', () => this.hideModal());
    },

    // 顯示結算畫面
    showResult(player) {
        this.showScreen('result');

        const r = this.elements.result;
        r.finalNetWorth.textContent = `💎 ${Finance.formatMoney(Math.round(player.getNetWorth()))}`;
        r.totalInvestmentReturn.textContent = `💎 ${Finance.formatMoney(Math.round(player.investmentReturn))}`;

        // 財務自由檢查
        const lastPassive = player.passiveIncomeHistory[player.passiveIncomeHistory.length - 1] || 0;
        const lastExpense = player.expenseHistory[player.expenseHistory.length - 1] || 1;
        const isFinanciallyFree = lastPassive > lastExpense;
        const freeStatusHtml = isFinanciallyFree
            ? `<div class="badge" style="background: var(--accent-gold); color: #000; padding: 10px; margin: 10px 0; border-radius: 8px;">🕊️ 恭喜！你達成了財務自由！</div>`
            : `<div class="badge" style="background: rgba(255,255,255,0.1); padding: 10px; margin: 10px 0; border-radius: 8px;">還沒達成財務自由，繼續努力！</div>`;

        // 取得成就
        const earnedAchievements = achievementSystem.getUnlockedAchievements();
        r.achievements.innerHTML = `
            ${freeStatusHtml}
            <div style="margin: 15px 0; font-size: 0.9rem; color: var(--text-secondary);">
                <span>🎭 特質：${player.traits.map(tId => GAME_DATA.traits.find(t => t.id === tId)?.name).join(', ')}</span><br>
                <span>👪 最終狀態：${player.familyStatus === 'parent' ? '喜獲至寶' : player.familyStatus === 'married' ? '甜蜜家庭' : '自由單身'}</span>
            </div>
            <h3>🏆 獲得成就 (${earnedAchievements.length})</h3>
            <div class="achievement-list">
                ${earnedAchievements.slice(0, 10).map(a => `
                    <div class="achievement-badge ${a.type === 'negative' ? 'negative' : ''}">
                        <span>${a.icon} ${a.name}</span>
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
