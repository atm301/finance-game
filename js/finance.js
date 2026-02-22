/**
 * 財商小達人 - 財務計算模組
 */

const Finance = {
    /**
     * 計算複利終值
     * @param {number} principal - 本金
     * @param {number} rate - 年利率
     * @param {number} years - 年數
     * @returns {number} 終值
     */
    compoundInterest(principal, rate, years) {
        return principal * Math.pow(1 + rate, years);
    },

    /**
     * 計算複利成長數據（用於繪製圖表）
     * @param {number} principal - 本金
     * @param {number} rate - 年利率
     * @param {number} years - 年數
     * @returns {Array} 每年的金額陣列
     */
    getGrowthData(principal, rate, years) {
        const data = [principal];
        let current = principal;
        for (let i = 1; i <= years; i++) {
            current = current * (1 + rate);
            data.push(Math.round(current));
        }
        return data;
    },

    /**
     * 比較投資 vs 不投資的差異
     * @param {number} principal - 本金
     * @param {number} rate - 年利率
     * @param {number} years - 年數
     * @returns {Object} { withInvest, withoutInvest, difference }
     */
    compareInvestment(principal, rate, years) {
        const withInvest = this.compoundInterest(principal, rate, years);
        const withoutInvest = principal; // 不投資就維持原本金額
        return {
            withInvest: Math.round(withInvest),
            withoutInvest: withoutInvest,
            difference: Math.round(withInvest - withoutInvest),
            multiplier: (withInvest / withoutInvest).toFixed(2)
        };
    },

    /**
     * 計算達到目標金額需要的時間
     * @param {number} principal - 本金
     * @param {number} target - 目標金額
     * @param {number} rate - 年利率
     * @returns {number} 需要的年數
     */
    yearsToTarget(principal, target, rate) {
        if (rate <= 0) return Infinity;
        return Math.ceil(Math.log(target / principal) / Math.log(1 + rate));
    },

    /**
     * 格式化金額顯示
     * @param {number} amount - 金額
     * @returns {string} 格式化後的字串
     */
    formatMoney(amount) {
        if (amount >= 10000) {
            return (amount / 10000).toFixed(1) + '萬';
        }
        return amount.toLocaleString();
    },

    /**
     * 計算風險調整後的報酬
     * @param {string} riskLevel - 風險等級 (low/medium/high)
     * @param {number} baseReturn - 基礎報酬率
     * @returns {number} 實際報酬率
     */
    getRiskAdjustedReturn(riskLevel, baseReturn) {
        const volatility = {
            low: 0.1,
            medium: 0.3,
            high: 0.5
        };
        const vol = volatility[riskLevel] || 0.2;
        const randomFactor = (Math.random() - 0.5) * 2 * vol;
        return baseReturn * (1 + randomFactor);
    }
};

/**
 * 圖表繪製類別
 */
class GrowthChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.data = [];
    }

    resize() {
        if (!this.canvas) return;
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }

    setData(data) {
        this.data = data;
        this.draw();
    }

    draw() {
        if (!this.ctx || this.data.length === 0) return;

        this.resize();
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 30;

        // 清空畫布
        ctx.clearRect(0, 0, width, height);

        // 計算比例
        const maxValue = Math.max(...this.data);
        const minValue = Math.min(...this.data);
        const valueRange = maxValue - minValue || 1;
        const xStep = (width - padding * 2) / (this.data.length - 1 || 1);

        // 繪製網格
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (height - padding * 2) * (i / 4);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // 繪製曲線
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');

        ctx.beginPath();
        ctx.moveTo(padding, height - padding);

        this.data.forEach((value, index) => {
            const x = padding + index * xStep;
            const y = height - padding - ((value - minValue) / valueRange) * (height - padding * 2);
            ctx.lineTo(x, y);
        });

        // 填充區域
        ctx.lineTo(padding + (this.data.length - 1) * xStep, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // 繪製線條
        ctx.beginPath();
        this.data.forEach((value, index) => {
            const x = padding + index * xStep;
            const y = height - padding - ((value - minValue) / valueRange) * (height - padding * 2);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 繪製點
        this.data.forEach((value, index) => {
            const x = padding + index * xStep;
            const y = height - padding - ((value - minValue) / valueRange) * (height - padding * 2);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#10b981';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // 顯示最後一個值
        if (this.data.length > 0) {
            const lastValue = this.data[this.data.length - 1];
            const lastX = padding + (this.data.length - 1) * xStep;
            const lastY = height - padding - ((lastValue - minValue) / valueRange) * (height - padding * 2);

            ctx.font = '12px "Noto Sans TC"';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText(Finance.formatMoney(lastValue), lastX, lastY - 10);
        }
    }
}
