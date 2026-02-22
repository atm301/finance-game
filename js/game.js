/**
 * 財商小達人 v3.2 - 主遊戲控制器
 */

// 全域實例以便跨模組存取
window.game = null;

class Game {
    constructor() {
        this.player = null;
        this.currentQuestionIndex = 0;
        this.selectedQuestions = [];
        this.currentEvent = null;
        this.growthChart = null;
        this.growthHistory = [];
        this.tutorialShown = false;
        this.previousScreen = 'start'; // 記住從哪裡進入成就畫面
        this.quizStarted = false;      // 是否已開始問答
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

        // 從成就返回（記住來源畫面）
        const backBtn = document.getElementById('back-from-achievements');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                AudioManager.play('click');
                UI.showScreen(this.previousScreen);
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

        // 人生故事頁面
        const viewStoryBtn = document.getElementById('view-story-btn');
        if (viewStoryBtn) {
            viewStoryBtn.addEventListener('click', () => {
                AudioManager.play('click');
                this.showStoryScreen();
            });
        }
        const backFromStory = document.getElementById('back-from-story');
        if (backFromStory) {
            backFromStory.addEventListener('click', () => {
                AudioManager.play('click');
                UI.showScreen('result');
            });
        }
        const storyRestart = document.getElementById('story-restart-btn');
        if (storyRestart) {
            storyRestart.addEventListener('click', () => {
                AudioManager.play('click');
                this.restartGame();
            });
        }

        // 齒輪設定選單
        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                AudioManager.play('click');
                this.showSettingsMenu();
            });
        }

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
        localStorage.removeItem('financeGame_tutorialDone');
        this.tutorialShown = false;
        this.quizStarted = false;

        this.player = new Player('小明');
        this.currentQuestionIndex = 0;
        this.growthHistory = [this.player.getNetWorth()];
        this.selectedQuestions = this.shuffleArray([...GAME_DATA.questions]).slice(0, 5);

        UI.showScreen('character');

        // 顯示名字輸入區，隱藏問答區
        const nameArea = document.getElementById('name-input-area');
        const quizArea = document.getElementById('quiz-area');
        if (nameArea) nameArea.style.display = 'block';
        if (quizArea) quizArea.style.display = 'none';

        const nameInput = document.getElementById('player-name-input');
        if (nameInput) { nameInput.value = ''; setTimeout(() => nameInput.focus(), 300); }

        UI.updateStatsPreview(this.player.stats);

        // 確認名字後進入問答
        const confirmBtn = document.getElementById('confirm-name-btn');
        if (confirmBtn) {
            // 移除舊的事件（避免重複綁定）
            const newBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

            const startQuiz = () => {
                if (this.quizStarted) return;
                const val = (document.getElementById('player-name-input')?.value || '').trim();
                this.player.name = val || '小明';
                this.quizStarted = true;
                if (nameArea) nameArea.style.display = 'none';
                if (quizArea) quizArea.style.display = 'block';
                UI.showQuestion(this.selectedQuestions[0], 0, this.selectedQuestions.length);
            };

            newBtn.addEventListener('click', startQuiz);

            const inp = document.getElementById('player-name-input');
            if (inp) {
                const keyHandler = (e) => { if (e.key === 'Enter') startQuiz(); };
                inp.removeEventListener('keydown', keyHandler);
                inp.addEventListener('keydown', keyHandler);
            }
        }
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
        localStorage.removeItem('financeGame_tutorialDone');
        this.tutorialShown = false;
        this.quizStarted = false;
        achievementSystem.reset();

        // 強制隱藏人生故事畫面（避免再玩一次後重疊）
        const storyScreen = document.getElementById('story-screen');
        if (storyScreen) storyScreen.classList.remove('active');

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
                // 分配隨機特質
                const randomTrait = GAME_DATA.traits[Math.floor(Math.random() * GAME_DATA.traits.length)];
                this.player.traits = [randomTrait.id];

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
        this.updateActionButtons(); // 確保行動次數初始顯示正確(=2)
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
            this.showMessage('❗ 行動次數不足', '本回合行動次數已用完！請推進到下一回合。');
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

            // 後期解鎖行動
            case 'loan':
                this.handleLoan();
                break;
            case 'repay':
                this.handleRepayDebt();
                break;
            case 'lecture':
                this.handleLecture();
                break;
            case 'research':
                this.handleResearch();
                break;
            case 'fundraise':
                this.handleFundraise();
                break;

            default:
                this.player.actionsThisRound--; // 退回行動次數
        }

        this.updateActionButtons(); // 統一行動次數顯示
    }

    handleLoan() {
        const p = this.player;
        const loanAmount = 500;
        p.cash += loanAmount;
        p.debt += loanAmount;
        p.totalDebtTaken = (p.totalDebtTaken || 0) + loanAmount;
        if (p.debt > (p.maxDebtReached || 0)) p.maxDebtReached = p.debt;
        p.actionHistory = p.actionHistory || [];
        p.actionHistory.push({ round: p.currentRound, action: 'loan', amount: loanAmount });
        this.showMessage('🏦 報名貸款成功', `借入 ${loanAmount} 金幣，負債年利 5%。記得攖時還款！`);
        AudioManager.play('coin');
        UI.updateGameUI(p);
    }

    handleRepayDebt() {
        const p = this.player;
        if (p.debt <= 0) {
            this.showMessage('✅ 無負債', '你目前沒有任何負債，繼續保持良好財務狀態！');
            p.actionsThisRound--;
            this.updateActionButtons();
            return;
        }
        if (p.cash <= 0) {
            this.showMessage('💸 現金不足', '現金不足以還款，先儲蓄更多再還。');
            p.actionsThisRound--;
            UI.updateActionsRemaining(p);
            return;
        }

        const maxRepay = Math.min(p.cash, p.debt);
        // 彈出還款 Modal，讓玩家自訂金額
        UI.showModal(`
            <div class="modal-header">
                <div class="modal-icon">💳</div>
                <h3 class="modal-title">還款視窗</h3>
            </div>
            <div class="modal-body">
                <p style="margin-bottom:8px;">目前負債：<strong style="color:var(--accent-red)">${Finance.formatMoney(Math.round(p.debt))} 金幣</strong></p>
                <p style="margin-bottom:16px;">可用現金：<strong style="color:var(--accent-green)">${Finance.formatMoney(Math.round(p.cash))} 金幣</strong></p>
                <label style="display:block;margin-bottom:8px;color:var(--accent-gold);">輸入還款金額：</label>
                <input id="repay-amount-input" type="number" min="1" max="${Math.floor(maxRepay)}" value="${Math.floor(maxRepay)}"
                    style="width:100%;padding:10px;border-radius:10px;border:2px solid var(--primary-color);background:rgba(255,255,255,0.08);color:var(--text-primary);font-size:1rem;text-align:center;margin-bottom:12px;">
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    <button id="repay-all-btn" class="btn btn-primary" style="flex:1;">💸 全部還清 (${Finance.formatMoney(Math.floor(maxRepay))})</button>
                    <button id="repay-confirm-btn" class="btn btn-secondary" style="flex:1;">✅ 確認還款</button>
                </div>
            </div>
        `);

        // 全部還清
        setTimeout(() => {
            const allBtn = document.getElementById('repay-all-btn');
            const confirmBtn = document.getElementById('repay-confirm-btn');
            if (allBtn) allBtn.addEventListener('click', () => {
                const amount = Math.min(Math.floor(p.cash), Math.ceil(p.debt));
                if (amount > 0) { p.cash -= amount; p.debt = Math.max(0, p.debt - amount); }
                UI.hideModal();
                this.showMessage('💸 全額還款', `還清 ${Finance.formatMoney(amount)} 金幣，剩餘負債：${Finance.formatMoney(Math.round(p.debt))} 金幣`);
                UI.updateGameUI(p);
            });
            if (confirmBtn) confirmBtn.addEventListener('click', () => {
                const input = document.getElementById('repay-amount-input');
                let amount = parseInt(input?.value) || 0;
                amount = Math.min(amount, Math.floor(p.cash), Math.ceil(p.debt));
                if (amount <= 0) { alert('請輸入有效金額！'); return; }
                p.cash -= amount; p.debt = Math.max(0, p.debt - amount);
                UI.hideModal();
                this.showMessage('💸 還款成功', `還清 ${Finance.formatMoney(amount)} 金幣，剩餘負債：${Finance.formatMoney(Math.round(p.debt))} 金幣`);
                UI.updateGameUI(p);
            });
        }, 100);
    }

    handleLecture() {
        const p = this.player;
        if (p.stats.social < 12) {
            this.showMessage('🚧 社交不足', '需要社交屬性至少 12 才能主辦演講。');
            p.actionsThisRound--;
            return;
        }
        const reward = 200 + Math.floor(p.stats.social * 20);
        p.addCash(reward);
        p.addStat('social', 1);
        p.addStat('wisdom', 1);
        this.showMessage('🎤 演講成功', `你的演講受到熱烈回響！獲得 ${reward} 金幣報酬及屬性成長。`);
        AudioManager.play('coin');
        UI.updateGameUI(p);
    }

    handleResearch() {
        const p = this.player;
        if (p.stats.wisdom < 15) {
            this.showMessage('🚧 智慧不足', '需要智慧屬性至少 15 才能進行深度研究。');
            p.actionsThisRound--;
            return;
        }
        p.addStat('wisdom', 2);
        p.addStat('perseverance', 1);
        p.incomeBonus += 30;
        this.showMessage('🔬 研究成果', '深入研究讓你洞悉市場規律！智慧大增，未來收入提升 30。');
        UI.updateGameUI(p);
    }

    handleFundraise() {
        const p = this.player;
        if (p.currentCareer !== 'entrepreneur' && p.currentCareer !== 'cfo' && p.currentCareer !== 'angel_investor' && p.currentCareer !== 'tycoon') {
            this.showMessage('🚧 職業不符', '只有創業者、CFO 以上職業才能從事商業募資。');
            p.actionsThisRound--;
            return;
        }
        const success = Math.random() < 0.6 + (p.stats.social - 10) * 0.02;
        if (success) {
            const amount = 1000 + Math.floor(Math.random() * 500);
            p.addCash(amount);
            p.addStat('social', 1);
            this.showMessage('🎉 募資成功', `投資人對你的視野充滿信心！獲得 ${amount} 金幣資金且社交屬性提升。`);
            AudioManager.play('coin');
        } else {
            p.addStat('perseverance', 1);
            this.showMessage('👊 募資失敗', '投資人暂時不感興趣。不用氣館，毅力尌強！');
        }
        UI.updateGameUI(p);
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
        }

        // 檢查職業晉升並顯示通知
        const currentCareerId = this.player.currentCareer;
        // 注意：player.processRound() 內部已經呼叫了 checkCareerPromotion
        // 所以這裡我們可以直接檢查目前的職業名稱
        const careerData = GAME_DATA.careers.find(c => c.id === currentCareerId);

        // 為了記錄上一次的職業，我們可以在這裡檢查 UI 顯示是否與目前一致
        const careerDisplay = UI.elements.game.playerCareer.textContent;
        if (careerData && !careerDisplay.includes(careerData.name)) {
            UI.showPromotionModal(careerData);
            AudioManager.play('levelup');
        }

        UI.updateGameUI(this.player);
        this.updateActionButtons();

        this.player.save();

        // 每回合問答觸發（10% 機率）
        if (Math.random() < 0.1) {
            this.triggerRoundQuiz();
        }

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
        // 記住目前畫面，供返回按鈕使用
        const activeScreens = Object.entries(UI.elements.screens)
            .filter(([, el]) => el && el.classList.contains('active'));
        if (activeScreens.length > 0) {
            this.previousScreen = activeScreens[0][0];
        }

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

        // 個人化複利小教室
        this.generatePersonalizedLesson();
    }

    generatePersonalizedLesson() {
        const p = this.player;
        const lesson = document.getElementById('compound-lesson-text');
        if (!lesson) return;

        const totalInvest = p.getTotalInvestments();
        const investReturn = Math.round(p.investmentReturn);
        const netWorth = Math.round(p.getNetWorth());
        const comparison = Finance.compareInvestment(500, 0.07, 25);

        let tips = [];

        // 根據投資行為給個人化建議
        if (!p.hasEverInvested) {
            tips.push(`📌 <strong>未曾投資</strong>：這次你沒有進行任何投資。若把初始 500 金幣以年報酬 7% 複利計算，25 回合後可成長到 <strong style="color:var(--accent-gold)">${Finance.formatMoney(comparison.withInvest)}</strong> 金幣！`);
        } else if (totalInvest < 200) {
            tips.push(`📌 <strong>投資金額偏低</strong>：本次你持有約 ${Finance.formatMoney(totalInvest)} 金幣的投資資產。建議每回合至少投入現金的 30%，讓複利效果更明顯！`);
        } else {
            tips.push(`✅ <strong>投資習慣良好</strong>：你的投資帶來了 ${Finance.formatMoney(investReturn)} 金幣的報酬！持續堅持，複利的威力會隨時間倍增。`);
        }

        if (p.spendCount > p.saveCount + p.learnCount) {
            tips.push(`💡 <strong>消費過多</strong>：這次消費次數 (${p.spendCount}) 偏高。適當娛樂是好的，但要注意「先理財，再享受」的原則！`);
        }

        if (p.debt > 0) {
            tips.push(`⚠️ <strong>負債管理</strong>：遊戲結束時仍有 ${Finance.formatMoney(Math.round(p.debt))} 金幣負債。現實中，高利貸或信用卡循環利息會侵蝕你的財富。優先還清高利率債務！`);
        }

        if (p.investmentLoss > 500) {
            tips.push(`📉 <strong>風險控制</strong>：本次投資損失較大 (${Finance.formatMoney(Math.round(p.investmentLoss))})。分散投資、不要把所有資金放在高風險標的上，可以降低損失。`);
        }

        if (netWorth < 1000) {
            tips.push(`🎯 <strong>財富積累建議</strong>：最終淨值 ${Finance.formatMoney(netWorth)} 尚有進步空間。試試「每回合先儲蓄或投資，再做其他行動」的策略！`);
        } else {
            tips.push(`🌟 <strong>出色的財務管理</strong>：最終淨值 ${Finance.formatMoney(netWorth)} 相當可觀！你已掌握了基本的財務管理技巧。`);
        }

        lesson.innerHTML = tips.join('<br><br>');
    }

    showSettingsMenu() {
        const slots = Player.getSaveSlots();
        const slotHTML = slots.map(s => {
            if (s.isEmpty) return `<button class="btn btn-secondary save-slot-btn" data-slot="${s.slotId}" style="opacity:0.6;">📁 存檔槽 ${s.slotId}（空）</button>`;
            const d = new Date(s.savedAt);
            const timeStr = isNaN(d) ? '' : ` - ${d.toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}`;
            return `<button class="btn btn-secondary save-slot-btn" data-slot="${s.slotId}">💾 存檔槽 ${s.slotId}：${s.label}${timeStr}<br><small style="color:var(--accent-gold);">淨值 ${Math.round(s.netWorth)}</small></button>`;
        }).join('');

        // BGM 風格選項
        const bgmStyles = AudioManager.bgmStyles || {};
        const currentStyle = AudioManager.currentBGMStyle || 'cozy';
        const bgmOptions = Object.entries(bgmStyles).map(([id, info]) =>
            `<option value="${id}" ${id === currentStyle ? 'selected' : ''}>${info.label} — ${info.desc}</option>`
        ).join('');

        UI.showModal(`
            <h3 style="text-align:center; margin-bottom:20px;">⚙️ 設定選單</h3>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <h4 style="color:var(--accent-gold); margin:0;">🎵 背景音樂風格</h4>
                <select id="bgm-style-select" style="padding:10px; border-radius:10px; border:2px solid var(--primary-color); background:rgba(255,255,255,0.08); color:var(--text-primary); font-size:0.9rem;">
                    ${bgmOptions}
                </select>
                <hr style="border-color:rgba(255,255,255,0.1);">
                <h4 style="color:var(--accent-gold); margin:0;">💾 手動存檔</h4>
                ${slotHTML}
                <hr style="border-color:rgba(255,255,255,0.1);">
                <button class="btn btn-secondary" id="settings-restart-btn">🔄 重新開始遊戲</button>
                <button class="btn btn-secondary" id="settings-tutorial-btn">📖 重新觀看教學</button>
                <button class="btn btn-secondary" id="settings-achievements-btn">🏆 查看成就</button>
                <button class="btn" style="background: rgba(255,255,255,0.1);" id="settings-close-btn">✖ 關閉</button>
            </div>
        `);

        setTimeout(() => {
            // BGM 風格切換
            document.getElementById('bgm-style-select')?.addEventListener('change', (e) => {
                AudioManager.setBGMStyle(e.target.value);
                AudioManager.play('click');
            });

            document.querySelectorAll('.save-slot-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const slotId = parseInt(btn.dataset.slot);
                    this.player.save(slotId);
                    btn.textContent = `✅ 已存入存檔槽 ${slotId}`;
                    AudioManager.play('coin');
                });
            });
            document.getElementById('settings-restart-btn')?.addEventListener('click', () => {
                UI.hideModal();
                if (confirm('確定要重新開始嗎？請先手動存檔！')) {
                    this.restartGame();
                }
            });
            document.getElementById('settings-tutorial-btn')?.addEventListener('click', () => {
                UI.hideModal();
                Tutorial.reset();
                Tutorial.start();
            });
            document.getElementById('settings-achievements-btn')?.addEventListener('click', () => {
                UI.hideModal();
                this.showAchievementsScreen();
            });
            document.getElementById('settings-close-btn')?.addEventListener('click', () => {
                UI.hideModal();
            });
        }, 100);
    }

    showStoryScreen() {
        if (!this.player) return;
        const storyEl = document.getElementById('story-content');
        const adviceEl = document.getElementById('story-advice');
        if (storyEl && typeof Story !== 'undefined') {
            storyEl.innerHTML = Story.generate(this.player);
        }
        if (adviceEl && typeof Story !== 'undefined') {
            adviceEl.innerHTML = Story.generateAdvice(this.player);
        }
        UI.showScreen('story');
    }

    triggerRoundQuiz() {
        const p = this.player;
        const quizPool = GAME_DATA.roundQuizzes || [];
        let stage = 'early';
        if (p.currentRound > 20) stage = 'late';
        else if (p.currentRound > 10) stage = 'mid';

        const candidates = quizPool.filter(q => q.round === stage);
        if (candidates.length === 0) return;

        const quiz = candidates[Math.floor(Math.random() * candidates.length)];

        const optionHTML = quiz.options.map((opt, i) =>
            `<button class="btn btn-secondary round-quiz-btn" data-idx="${i}" style="margin:4px 0; text-align:left; width:100%; font-size:0.88rem;">${String.fromCharCode(65 + i)}. ${opt}</button>`
        ).join('');

        UI.showModal(`
            <h3 style="text-align:center; margin-bottom:16px;">🧠 財務問答挑戰</h3>
            <p style="margin-bottom:16px; font-size:0.95rem; font-weight:600; color:var(--accent-gold);">${quiz.question}</p>
            <div id="quiz-options">${optionHTML}</div>
            <p id="quiz-result" style="margin-top:12px; min-height:20px;"></p>
        `);

        setTimeout(() => {
            document.querySelectorAll('.round-quiz-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.idx);
                    const isCorrect = idx === quiz.correct;
                    const resultEl = document.getElementById('quiz-result');
                    document.querySelectorAll('.round-quiz-btn').forEach((b, i) => {
                        b.disabled = true;
                        if (i === quiz.correct) b.style.background = 'rgba(16,185,129,0.3)';
                        else if (i === idx && !isCorrect) b.style.background = 'rgba(239,68,68,0.3)';
                    });
                    if (isCorrect) {
                        p.addStat(quiz.reward.stat, quiz.reward.value);
                        p.quizzesPassed = (p.quizzesPassed || 0) + 1;
                        resultEl.innerHTML = `<span style="color:#10b981;">✅ 答對了！${quiz.reward.stat === 'wisdom' ? '智慧' : quiz.reward.stat === 'luck' ? '運氣' : quiz.reward.stat === 'social' ? '社交' : '毅力'} +${quiz.reward.value}</span>`;
                        AudioManager.play('coin');
                    } else {
                        p.addCash(-50);
                        resultEl.innerHTML = `<span style="color:#ef4444;">❌ 答錯了！損失 50 金幣。正確答案：${String.fromCharCode(65 + quiz.correct)}。</span>`;
                        AudioManager.play('fail');
                    }
                    setTimeout(() => UI.hideModal(), 2000);
                });
            });
        }, 100);
    }

    updateActionButtons() {
        if (!this.player) return;
        const p = this.player;
        const round = p.currentRound;

        // 貸款（回合 11 起顯示）
        const loanBtn = document.getElementById('action-loan');
        if (loanBtn) loanBtn.style.display = round >= 11 ? '' : 'none';

        // 還債（有負債才顯示）
        const repayBtn = document.getElementById('action-repay');
        if (repayBtn) repayBtn.style.display = (round >= 11 && p.debt > 0) ? '' : 'none';

        // 演講（社交 ≥ 12）
        const lectureBtn = document.getElementById('action-lecture');
        if (lectureBtn) lectureBtn.style.display = p.stats.social >= 12 ? '' : 'none';

        // 研究（智慧 ≥ 15）
        const researchBtn = document.getElementById('action-research');
        if (researchBtn) researchBtn.style.display = p.stats.wisdom >= 15 ? '' : 'none';

        // 募資（創業者或以上職業）
        const advancedCareers = ['entrepreneur', 'cfo', 'angel_investor', 'tycoon'];
        const fundraiseBtn = document.getElementById('action-fundraise');
        if (fundraiseBtn) fundraiseBtn.style.display = advancedCareers.includes(p.currentCareer) ? '' : 'none';
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
            this.growthChart.setData(
                this.growthHistory,
                this.player.passiveIncomeHistory,
                this.player.expenseHistory
            );
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
    window.game = new Game();
    window.game.init();
});
