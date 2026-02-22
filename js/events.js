/**
 * 財商小達人 - 事件系統
 */

const Events = {
    /**
     * 根據機率觸發隨機事件
     * @param {Player} player - 玩家實例
     * @returns {Object|null} 事件物件或 null
     */
    triggerRandomEvent(player) {
        // 40% 機率觸發事件
        if (Math.random() > 0.4) return null;

        const eventType = this.getEventType(player);
        const events = GAME_DATA.events[eventType];

        if (!events || events.length === 0) return null;

        const event = events[Math.floor(Math.random() * events.length)];
        return { ...event, type: eventType };
    },

    /**
     * 決定事件類型
     * @param {Player} player - 玩家實例
     * @returns {string} 事件類型
     */
    getEventType(player) {
        const luck = player.stats.luck;
        const roll = Math.random() * 100;

        // 運氣影響正面/負面事件比例
        const positiveChance = 30 + luck * 3;
        const negativeChance = 30 - luck * 2;

        if (roll < positiveChance) {
            return 'positive';
        } else if (roll < positiveChance + negativeChance) {
            return 'negative';
        } else {
            return 'decision';
        }
    },

    /**
     * 處理事件效果
     * @param {Player} player - 玩家實例
     * @param {Object} event - 事件物件
     * @param {number} choiceIndex - 選擇的選項索引（決策事件用）
     * @returns {Object} 效果結果
     */
    applyEventEffect(player, event, choiceIndex = 0) {
        let effect = event.effect;

        // 處理決策事件
        if (event.type === 'decision' && event.choices) {
            const choice = event.choices[choiceIndex];
            if (!choice) return {};

            effect = choice.effect;

            // 處理詐騙事件
            if (choice.isScam) {
                const isScammed = Math.random() < choice.scamChance;
                if (isScammed) {
                    return {
                        cash: effect.cash,
                        message: '😱 糟糕！這是詐騙！你損失了金幣。',
                        isScam: true
                    };
                } else {
                    return {
                        cash: Math.abs(effect.cash) * 2,
                        message: '🍀 幸運！這次賺到了！',
                        isScam: false
                    };
                }
            }
        }

        if (!effect) return {};

        const result = {};

        // 處理現金變動
        if (effect.cash) {
            player.addCash(effect.cash);
            result.cash = effect.cash;
        }

        // 處理投資乘數
        if (effect.investMultiplier) {
            for (const type of Object.keys(player.investments)) {
                player.investments[type] *= effect.investMultiplier;
            }
            result.investMultiplier = effect.investMultiplier;
        }

        // 處理收入加成
        if (effect.incomeBonus) {
            player.incomeBonus += effect.incomeBonus;
            result.incomeBonus = effect.incomeBonus;
        }

        // 處理支出加成
        if (effect.expenseBonus) {
            player.expenseBonus += effect.expenseBonus;
            result.expenseBonus = effect.expenseBonus;
        }

        // 處理保險
        if (effect.hasInsurance !== undefined) {
            player.hasInsurance = effect.hasInsurance;
            result.hasInsurance = effect.hasInsurance;
        }

        // 處理屬性變動
        for (const stat of ['wisdom', 'perseverance', 'social', 'luck']) {
            if (effect[stat]) {
                player.addStat(stat, effect[stat]);
                result[stat] = effect[stat];
            }
        }

        return result;
    },

    /**
     * 生成事件描述
     * @param {Object} result - 效果結果
     * @returns {string} 效果描述
     */
    getEffectDescription(result) {
        const parts = [];

        if (result.cash) {
            const sign = result.cash > 0 ? '+' : '';
            parts.push(`現金 ${sign}${result.cash} 💎`);
        }

        if (result.investMultiplier) {
            const percent = Math.round((result.investMultiplier - 1) * 100);
            const sign = percent > 0 ? '+' : '';
            parts.push(`投資資產 ${sign}${percent}%`);
        }

        if (result.incomeBonus) {
            parts.push(`月收入 +${result.incomeBonus}`);
        }

        if (result.expenseBonus) {
            parts.push(`月支出 +${result.expenseBonus}`);
        }

        if (result.hasInsurance) {
            parts.push('獲得保險保障 🛡️');
        }

        const statNames = { wisdom: '智慧', perseverance: '毅力', social: '社交', luck: '運氣' };
        for (const [stat, name] of Object.entries(statNames)) {
            if (result[stat]) {
                const sign = result[stat] > 0 ? '+' : '';
                parts.push(`${name} ${sign}${result[stat]}`);
            }
        }

        return parts.join('、');
    },

    /**
     * 減輕負面事件（如果有保險）
     * @param {Player} player - 玩家實例
     * @param {Object} event - 事件物件
     * @returns {Object} 修改後的事件
     */
    mitigateWithInsurance(player, event) {
        if (!player.hasInsurance || event.type !== 'negative') {
            return event;
        }

        // 保險減輕 50% 損失
        const mitigatedEvent = { ...event };
        if (mitigatedEvent.effect && mitigatedEvent.effect.cash < 0) {
            mitigatedEvent.effect = {
                ...mitigatedEvent.effect,
                cash: Math.floor(mitigatedEvent.effect.cash * 0.5)
            };
            mitigatedEvent.insured = true;
        }

        return mitigatedEvent;
    }
};
