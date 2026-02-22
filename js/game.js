/**
 * 財商小達人 v2.0 - 主遊戲控制器
 */

class Game {
    constructor() {
        this.player = null;
        this.currentQuestionIndex = 0;
        this.selectedQuestions = [];
        this.currentEvent = null;
        this.growthChart = null;
        this.growthHistory = [];
        this.tutorialShown = false;
    }

    init() {
        UI.init();
        this.bindEvents();
        this.checkSavedGame();
        this.growthChart = new GrowthChart('growth-canvas');
        this.initDecorations();
    }

    initDecorations() {
        // 浮動裝飾已在 HTML 中初始化
    }

    bindEvents() {
        // 開始按鈕
        UI.elements.buttons.start.addEventListener('click', () => {
            AudioManager.play('click');
            this.startNewGame();
        });

        // 繼續遊戲按鈕
        UI.elements.buttons.continue.addEventListener('click', () => {
            AudioManager.play('click');
            this.continueGame();
        });

        // 下一回合按鈕
        UI.elements.buttons.nextRound.addEventListener('click', () => {
            AudioManager.play('click');
            this.nextRound();
        });

        // 手機版下一回合
        const mobileNextBtn = document.getElementById('mobile-next-round-btn');
        if (mobileNextBtn) {
            mobileNextBtn.addEventListener('click', () => {
                AudioManager.play('click');
                this.nextRound();
            });
        }

        // 重新開始按鈕
        UI.elements.buttons.restart.addEventListener('click', () => {
            AudioManager.play('click');
            this.restartGame();
        });

        // 成就按鈕
        const achievementsBtn = document.getElementById('achievements-btn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                AudioManager.play('click');
                this.showAchievementsScreen();
            });
        }

        // 從成就返回
        const backBtn = document.getElementById('back-from-achievements');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                AudioManager.play('click');
                UI.showScreen('start');
            });
        }

        // 成就標籤切換
        document.querySelectorAll('.achievement-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                AudioManager.play('click');
                document.querySelectorAll('.achievement-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.renderAchievements(e.target.dataset.tab);
            });
        });

        // 查看全部成就
        const viewAllBtn = document.getElementById('view-all-achievements-btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                AudioManager.play('click');
                this.showAchievementsScreen();
            });
        }

        // 音效切換
        const soundBtn = document.getElementById('sound-btn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                const muted = AudioManager.toggleMute();
                soundBtn.textContent = muted ? '🔇' : '🔊';
            });
        }

        const soundToggle = document.getElementById('sound-toggle-btn');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                const muted = AudioManager.toggleMute();
                soundToggle.textContent = muted ? '🔇' : '🔊';
            });
        }

        // 行動按鈕
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                AudioManager.play('click');
                const action = e.currentTarget.dataset.action;
                this.handleAction(action);
            });
        });

        // 彈窗點擊外部關閉
        UI.elements.modal.addEventListener('click', (e) => {
            if (e.target === UI.elements.modal) {
                UI.hideModal();
            }
        });

        // 動態綁定事件委派
        document.addEventListener('click', (e) => {
            if (e.target.closest('.answer-btn')) {
                const index = parseInt(e.target.closest('.answer-btn').dataset.index);
                this.answerQuestion(index);
            }

            if (e.target.closest('.decision-btn')) {
                const choice = parseInt(e.target.closest('.decision-btn').dataset.choice);
                this.handleDecision(choice);
            }

            if (e.target.closest('.investment-option')) {
                document.querySelectorAll('.investment-option').forEach(opt => opt.classList.remove('selected'));
                e.target.closest('.investment-option').classList.add('selected');
            }

            if (e.target.id === 'cancel-invest-btn') {
                UI.hideModal();
            }

            if (e.target.id === 'confirm-invest-btn') {
                this.confirmInvestment();
            }
        });
    }

    checkSavedGame() {
        const savedPlayer = Player.load();
        if (savedPlayer) {
            UI.elements.buttons.continue.style.display = 'inline-flex';
        }
    }

    startNewGame() {
        Player.clearSave();
        this.player = new Player('小明');
        this.currentQuestionIndex = 0;
        this.growthHistory = [this.player.getNetWorth()];

        // 隨機選擇5個問題
        this.selectedQuestions = this.shuffleArray([...GAME_DATA.questions]).slice(0, 5);

        UI.showScreen('character');
        UI.showQuestion(this.selectedQuestions[0], 0, this.selectedQuestions.length);
        UI.updateStatsPreview(this.player.stats);
    }

    continueGame() {
        this.player = Player.load();
        if (this.player) {
            this.growthHistory = [this.player.getNetWorth()];
            UI.showScreen('game');
            UI.updateGameUI(this.player);
            this.updateGrowthChart();
        }
    }

    restartGame() {
        Player.clearSave();
        achievementSystem.reset();
        this.startNewGame();
    }

    answerQuestion(answerIndex) {
        const question = this.selectedQuestions[this.currentQuestionIndex];
        const answer = question.answers[answerIndex];

        // 套用效果
        for (const [stat, value] of Object.entries(answer.effects)) {
            this.player.addStat(stat, value);
        }

        // 記錄特質
        if (answer.trait) {
            this.player.addTrait(answer.trait);
        }

        // 更新預覽
        UI.updateStatsPreview(this.player.stats);

        // 標記選中
        document.querySelectorAll('.answer-btn').forEach((btn, i) => {
            btn.classList.toggle('selected', i === answerIndex);
            btn.disabled = true;
        });

        AudioManager.play('success');

        // 延遲後進入下一題
        setTimeout(() => {
            this.currentQuestionIndex++;

            if (this.currentQuestionIndex >= this.selectedQuestions.length) {
                this.startGameplay();
            } else {
                UI.showQuestion(
                    this.selectedQuestions[this.currentQuestionIndex],
                    this.currentQuestionIndex,
                    this.selectedQuestions.length
                );
            }
        }, 800);
    }

    startGameplay() {
        UI.showScreen('game');
        UI.updateGameUI(this.player);
        this.showWelcomeEvent();
        this.updateGrowthChart();

        // 顯示教學
        if (!this.tutorialShown && !localStorage.getItem('financeGame_tutorialDone')) {
            setTimeout(() => {
                Tutorial.start();
                this.tutorialShown = true;
            }, 500);
        }

        AudioManager.playBGM();
    }

    showWelcomeEvent() {
        UI.elements.game.eventArea.innerHTML = `
            <div class="event-card">
                <div class="event-icon">🎮</div>
                <h3 class="event-title">歡迎來到財商小達人！</h3>
                <p class="event-description">
                    你的人生旅程即將開始！<br>
                    每回合你可以選擇 2 個行動，做出明智的決策，累積財富吧！<br><br>
                    💡 <strong>小提示：</strong>越早開始投資，複利效果越明顯！
                </p>
            </div>
        `;
    }

    handleAction(action) {
        if (!this.player.useAction()) {
            this.showMessage('⚠️ 這回合的行動已用完！', '請點擊「進入下一回合」繼續。');
            return;
        }

        switch (action) {
            case 'save':
                this.handleSave();
                break;
            case 'invest':
                this.handleInvest();
                break;
            case 'spend':
                this.handleSpend();
                break;
            case 'learn':
                this.handleLearn();
                break;
        }

        this.updateActionButtons();
        this.checkAchievements();
    }

    handleSave() {
        const saveAmount = Math.floor(this.player.cash * 0.1);
        if (saveAmount > 0) {
            const interest = Math.floor(saveAmount * 0.01);
            this.player.addCash(interest);
            this.player.addStat('perseverance', 0.5);
            this.player.saveCount++;
            this.showMessage('💰 儲蓄成功！', `你決定存下一些錢，獲得 ${interest} 金幣利息。`);
            AudioManager.play('coin');
        } else {
            this.showMessage('💰 沒有足夠的錢儲蓄', '繼續努力吧！');
        }
        UI.updateGameUI(this.player);
    }

    handleInvest() {
        if (this.player.cash < 10) {
            this.showMessage('⚠️ 現金不足', '至少需要 10 金幣才能投資。');
            return;
        }
        UI.showInvestModal(this.player);
    }

    confirmInvestment() {
        const selectedOption = document.querySelector('.investment-option.selected');
        const amountInput = document.getElementById('invest-amount-input');

        if (!selectedOption) {
            alert('請選擇投資項目！');
            return;
        }

        const investType = selectedOption.dataset.id;
        const amount = parseInt(amountInput.value) || 0;

        if (amount <= 0 || amount > this.player.cash) {
            alert('請輸入有效金額！');
            return;
        }

        const investOption = GAME_DATA.investments.find(i => i.id === investType);
        if (investOption.minAmount && amount < investOption.minAmount) {
            alert(`此投資項目最低需要 ${investOption.minAmount} 金幣！`);
            return;
        }

        if (this.player.invest(investType, amount)) {
            UI.hideModal();
            this.showMessage('📈 投資成功！', `你投資了 ${amount} 金幣到${investOption.name}。`);
            this.player.addStat('wisdom', 0.5);
            AudioManager.play('success');
            UI.updateGameUI(this.player);
            this.updateGrowthChart();
            this.checkAchievements();
        }
    }

    handleSpend() {
        const spendAmount = Math.min(50, Math.floor(this.player.cash * 0.2));
        if (spendAmount > 0) {
            this.player.addCash(-spendAmount);
            this.player.addStat('social', 0.5);
            this.player.spendCount++;
            this.player.recordImpulseBuy(spendAmount);
            this.showMessage('🛒 消費完成！', `你花了 ${spendAmount} 金幣享受生活，心情愉快！`);
            AudioManager.play('coin');
        } else {
            this.showMessage('🛒 沒有錢可以消費', '先賺點錢吧！');
        }
        UI.updateGameUI(this.player);
    }

    handleLearn() {
        const cost = 20;
        if (this.player.cash >= cost) {
            this.player.addCash(-cost);
            this.player.addStat('wisdom', 1);
            this.player.learnCount++;
            this.showMessage('📚 學習成功！', `你花了 ${cost} 金幣學習新知識，智慧+1！`);
            AudioManager.play('success');
        } else {
            this.player.addStat('wisdom', 0.3);
            this.player.learnCount++;
            this.showMessage('📚 自學中...', '你用網路資源自學，智慧略有提升。');
        }
        UI.updateGameUI(this.player);
    }

    updateActionButtons() {
        const remaining = this.player.maxActionsPerRound - this.player.actionsThisRound;
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.toggle('disabled', remaining <= 0);
        });

        const actionsRemaining = document.getElementById('actions-remaining');
        if (actionsRemaining) {
            actionsRemaining.textContent = remaining;
            actionsRemaining.classList.add('bounce-number');
            setTimeout(() => actionsRemaining.classList.remove('bounce-number'), 500);
        }
    }

    nextRound() {
        const result = this.player.processRound();

        this.growthHistory.push(Math.round(this.player.getNetWorth()));
        this.updateGrowthChart();

        let event = Events.triggerRandomEvent(this.player);

        if (event) {
            event = Events.mitigateWithInsurance(this.player, event);
            this.currentEvent = event;

            if (event.type !== 'decision') {
                const effectResult = Events.applyEventEffect(this.player, event);

                // 追蹤健康損失
                if (event.category === 'health' && effectResult.cash < 0) {
                    this.player.healthLoss += Math.abs(effectResult.cash);
                }

                UI.showEvent({ ...event, effectResult });

                if (effectResult.cash > 0) {
                    AudioManager.play('coin');
                } else if (effectResult.cash < 0) {
                    AudioManager.play('fail');
                }
            } else {
                UI.showEvent(event);
            }
        } else {
            UI.showRoundSummary(result, event);
            this.showCompoundTip();
        }

        UI.updateGameUI(this.player);
        this.updateActionButtons();

        this.player.save();

        // 檢查成就
        this.checkAchievements();

        // 階段轉換提示
        if (this.player.currentRound === 6 || this.player.currentRound === 11 ||
            this.player.currentRound === 16 || this.player.currentRound === 21) {
            AudioManager.play('levelup');
        }

        // 遊戲結束
        if (this.player.currentRound > 25) {
            this.player.completeGame();
            this.player.save();

            setTimeout(() => {
                this.endGame();
            }, 1000);
        }
    }

    handleDecision(choiceIndex) {
        if (!this.currentEvent) return;

        const choice = this.currentEvent.choices[choiceIndex];
        const result = Events.applyEventEffect(this.player, this.currentEvent, choiceIndex);

        // 追蹤決策結果
        if (choice.missedOpportunity) {
            this.player.missedOpportunities++;
        }
        if (choice.donation) {
            this.player.totalDonations += choice.donation;
        }
        if (choice.scamAvoided) {
            this.player.scamAvoided++;
        }
        if (result.isScam) {
            this.player.scammedCount++;
        }
        if (choice.impulse) {
            this.player.recordImpulseBuy(Math.abs(choice.effect.cash || 0));
        }
        if (choice.effect && choice.effect.hasProperty) {
            this.player.hasProperty = true;
        }

        const desc = Events.getEffectDescription(result);

        let message = choice.text;
        if (result.message) {
            message = result.message;
        } else if (desc) {
            message += `：${desc}`;
        }

        this.showMessage('✅ 決定完成', message);
        this.currentEvent = null;

        if (result.cash > 0) {
            AudioManager.play('coin');
        } else if (result.cash < 0) {
            AudioManager.play('fail');
        }

        UI.updateGameUI(this.player);
        this.checkAchievements();
    }

    checkAchievements() {
        const newAchievements = achievementSystem.checkAchievements(this.player);

        newAchievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showAchievementNotification(achievement);
            }, index * 1500);
        });

        // 檢查是否完成所有正面成就
        if (achievementSystem.hasAllPositive()) {
            Auth.checkAndSendRewardEmail();
        }
    }

    showAchievementNotification(achievement) {
        const container = document.getElementById('achievement-notifications');

        const notification = document.createElement('div');
        notification.className = `achievement-notification ${achievement.type === 'negative' ? 'negative' : ''}`;
        notification.innerHTML = `
            <div class="achievement-header">
                <span class="achievement-icon">${achievement.icon}</span>
                <span class="achievement-label">${achievement.type === 'negative' ? '負面成就' : achievement.type === 'hidden' ? '隱藏成就' : '成就解鎖'}</span>
            </div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.desc}</div>
        `;

        container.appendChild(notification);

        // 顯示大圖標
        const effect = document.createElement('div');
        effect.className = 'achievement-unlock-effect';
        effect.textContent = achievement.icon;
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    showAchievementsScreen() {
        UI.showScreen('achievements');

        const progress = achievementSystem.getPositiveProgress();
        document.getElementById('achievements-progress').textContent =
            `正面成就：${progress.unlocked}/${progress.total} (${progress.percentage}%)`;

        this.renderAchievements('positive');
    }

    renderAchievements(type) {
        const panel = document.getElementById('achievements-panel');
        const achievements = ACHIEVEMENTS[type] || [];
        const unlocked = achievementSystem.unlockedAchievements[type] || [];

        panel.innerHTML = achievements.map(a => {
            const isUnlocked = unlocked.includes(a.id);
            const isHidden = a.hidden && !isUnlocked;

            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${type === 'negative' && isUnlocked ? 'negative' : ''}">
                    <div class="icon">${isHidden ? '❓' : a.icon}</div>
                    <div class="name">${isHidden ? '???' : a.name.replace(a.icon, '').trim()}</div>
                    <div class="desc">${isHidden ? '達成特殊條件解鎖' : a.desc}</div>
                </div>
            `;
        }).join('');
    }

    endGame() {
        UI.showResult(this.player);
        AudioManager.play('achievement');
        AudioManager.stopBGM();

        // 顯示獲得的成就
        this.checkAchievements();

        const resultAchievements = document.getElementById('result-achievements');
        const allAchievements = achievementSystem.getUnlockedAchievements();

        resultAchievements.innerHTML = `
            <h3>🏆 獲得成就 (${allAchievements.length})</h3>
            <div class="achievement-list">
                ${allAchievements.slice(0, 6).map(a => `
                    <div class="achievement-badge ${a.type === 'negative' ? 'negative' : ''}">
                        <span>${a.icon}</span>
                        <span>${a.name.replace(a.icon, '').trim()}</span>
                    </div>
                `).join('')}
                ${allAchievements.length > 6 ? `<div class="achievement-badge">+${allAchievements.length - 6} 更多...</div>` : ''}
            </div>
        `;
    }

    showCompoundTip() {
        const tips = GAME_DATA.compoundTips;
        const tip = tips[Math.floor(Math.random() * tips.length)];

        const tipEl = document.querySelector('.compound-tip');
        if (tipEl) {
            tipEl.textContent = tip;
        }
    }

    updateGrowthChart() {
        if (this.growthChart && this.growthHistory.length > 0) {
            this.growthChart.setData(this.growthHistory);
        }
    }

    showMessage(title, text) {
        UI.elements.game.eventArea.innerHTML = `
            <div class="event-card slide-enter">
                <div class="event-icon">📢</div>
                <h3 class="event-title">${title}</h3>
                <p class="event-description">${text}</p>
            </div>
        `;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// 初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
