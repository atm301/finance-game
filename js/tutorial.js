/**
 * 財商小達人 - 教學引導系統
 */

const Tutorial = {
    steps: [
        {
            id: 'welcome',
            title: '👋 歡迎來到財商小達人！',
            content: '這是一款幫助你學習理財的遊戲。透過模擬人生，你將體驗從學生到退休的財務旅程。',
            highlight: null,
            position: 'center'
        },
        {
            id: 'character',
            title: '🌟 創建你的角色',
            content: '回答問題來決定你的初始屬性：智慧、毅力、社交、運氣。這些屬性會影響你的收入和機會！',
            highlight: '.stats-preview',
            position: 'right'
        },
        {
            id: 'finance',
            title: '💰 財務面板',
            content: '這裡顯示你的財務狀況：現金、投資、負債和淨值。注意觀察你的月收入與支出！',
            highlight: '.finance-panel',
            position: 'left'
        },
        {
            id: 'actions',
            title: '🎮 選擇行動',
            content: '每回合你可以選擇 2 個行動：儲蓄、投資、消費或學習。做出明智的選擇！',
            highlight: '.action-buttons',
            position: 'top'
        },
        {
            id: 'invest',
            title: '📈 投資與複利',
            content: '投資是讓錢生錢的方法！越早開始投資，複利效果越強大。看看右邊的成長曲線！',
            highlight: '.compound-panel',
            position: 'left'
        },
        {
            id: 'events',
            title: '🎲 隨機事件',
            content: '遊戲中會發生各種事件：有好有壞！保險可以減輕意外損失。',
            highlight: '.event-area',
            position: 'bottom'
        },
        {
            id: 'compound',
            title: '✨ 複利的威力',
            content: '愛因斯坦說：「複利是世界第八大奇蹟！」假設你每年投資報酬 7%，10年後你的錢會翻倍！',
            highlight: null,
            position: 'center',
            animation: 'compound'
        },
        {
            id: 'start',
            title: '🚀 準備開始！',
            content: '現在你已經了解基本規則了。記住：越早投資越好，但也要平衡生活！祝你成為財商小達人！',
            highlight: null,
            position: 'center'
        }
    ],

    currentStep: 0,
    isActive: false,
    overlay: null,
    popup: null,

    // 開始教學
    start() {
        if (localStorage.getItem('financeGame_tutorialDone')) {
            return false;
        }

        this.currentStep = 0;
        this.isActive = true;
        this.createOverlay();
        this.showStep(0);
        return true;
    },

    // 建立遮罩
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.innerHTML = `
            <div class="tutorial-popup" id="tutorial-popup">
                <div class="tutorial-header">
                    <h3 class="tutorial-title"></h3>
                    <button class="tutorial-skip">跳過</button>
                </div>
                <div class="tutorial-content"></div>
                <div class="tutorial-animation" id="tutorial-animation"></div>
                <div class="tutorial-footer">
                    <div class="tutorial-dots"></div>
                    <button class="tutorial-next btn btn-primary">下一步 ➡️</button>
                </div>
            </div>
            <div class="tutorial-highlight" id="tutorial-highlight"></div>
        `;

        document.body.appendChild(this.overlay);
        this.popup = document.getElementById('tutorial-popup');

        // 綁定事件
        this.overlay.querySelector('.tutorial-skip').addEventListener('click', () => this.finish());
        this.overlay.querySelector('.tutorial-next').addEventListener('click', () => this.next());

        // 渲染步驟指示點
        this.renderDots();
    },

    // 渲染步驟點
    renderDots() {
        const dotsContainer = this.overlay.querySelector('.tutorial-dots');
        dotsContainer.innerHTML = this.steps.map((_, i) =>
            `<span class="tutorial-dot ${i === 0 ? 'active' : ''}"></span>`
        ).join('');
    },

    // 顯示步驟
    showStep(index) {
        const step = this.steps[index];
        if (!step) return;

        this.currentStep = index;

        // 更新內容
        this.popup.querySelector('.tutorial-title').textContent = step.title;
        this.popup.querySelector('.tutorial-content').textContent = step.content;

        // 更新按鈕
        const nextBtn = this.popup.querySelector('.tutorial-next');
        nextBtn.textContent = index === this.steps.length - 1 ? '開始遊戲 🎮' : '下一步 ➡️';

        // 更新點
        this.overlay.querySelectorAll('.tutorial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // 高亮元素
        const highlight = document.getElementById('tutorial-highlight');
        if (step.highlight) {
            const target = document.querySelector(step.highlight);
            if (target) {
                const rect = target.getBoundingClientRect();
                highlight.style.display = 'block';
                highlight.style.top = `${rect.top - 5}px`;
                highlight.style.left = `${rect.left - 5}px`;
                highlight.style.width = `${rect.width + 10}px`;
                highlight.style.height = `${rect.height + 10}px`;

                // 調整彈窗位置
                this.positionPopup(step.position, rect);
            }
        } else {
            highlight.style.display = 'none';
            this.popup.style.top = '50%';
            this.popup.style.left = '50%';
            this.popup.style.transform = 'translate(-50%, -50%)';
        }

        // 播放動畫
        this.playAnimation(step.animation);
    },

    // 調整彈窗位置
    positionPopup(position, targetRect) {
        const popup = this.popup;
        popup.style.transform = 'none';

        switch (position) {
            case 'top':
                popup.style.top = `${targetRect.top - popup.offsetHeight - 20}px`;
                popup.style.left = `${targetRect.left + targetRect.width / 2 - popup.offsetWidth / 2}px`;
                break;
            case 'bottom':
                popup.style.top = `${targetRect.bottom + 20}px`;
                popup.style.left = `${targetRect.left + targetRect.width / 2 - popup.offsetWidth / 2}px`;
                break;
            case 'left':
                popup.style.top = `${targetRect.top + targetRect.height / 2 - popup.offsetHeight / 2}px`;
                popup.style.left = `${targetRect.left - popup.offsetWidth - 20}px`;
                break;
            case 'right':
                popup.style.top = `${targetRect.top + targetRect.height / 2 - popup.offsetHeight / 2}px`;
                popup.style.left = `${targetRect.right + 20}px`;
                break;
            case 'center':
            default:
                popup.style.top = '50%';
                popup.style.left = '50%';
                popup.style.transform = 'translate(-50%, -50%)';
        }
    },

    // 播放教學動畫
    playAnimation(type) {
        const container = document.getElementById('tutorial-animation');
        container.innerHTML = '';

        if (type === 'compound') {
            // 複利動畫
            container.innerHTML = `
                <div class="compound-demo">
                    <div class="compound-bar" style="--height: 20%">Year 0<br>💎100</div>
                    <div class="compound-bar" style="--height: 40%">Year 5<br>💎140</div>
                    <div class="compound-bar" style="--height: 60%">Year 10<br>💎197</div>
                    <div class="compound-bar" style="--height: 80%">Year 15<br>💎276</div>
                    <div class="compound-bar" style="--height: 100%">Year 20<br>💎387</div>
                </div>
            `;
        }
    },

    // 下一步
    next() {
        AudioManager.play('click');

        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.finish();
        }
    },

    // 完成教學
    finish() {
        this.isActive = false;
        localStorage.setItem('financeGame_tutorialDone', 'true');

        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }

        AudioManager.play('success');
    },

    // 重置教學
    reset() {
        localStorage.removeItem('financeGame_tutorialDone');
    }
};
