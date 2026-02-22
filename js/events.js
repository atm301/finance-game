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
        // 60% 機率觸發事件（提高觸發率）
        if (Math.random() > 0.6) return null;

        // 特定人生里程碑強制觸發（確保玩家體驗到重要事件）
        const forced = this.tryForcedLifeEvent(player);
        if (forced) return forced;

        const eventType = this.getEventType(player);
        const events = GAME_DATA.events[eventType];

        if (!events || events.length === 0) return null;

        if (eventType === 'decision') {
            // 過濾有 condition 的事件，只選符合條件的
            const eligible = events.filter(e => {
                if (typeof e.condition === 'function') {
                    try { return e.condition(player); } catch { return false; }
                }
                return true;
            });
            if (eligible.length === 0) return null;
            const event = eligible[Math.floor(Math.random() * eligible.length)];
            return { ...event, type: eventType };
        }

        const event = events[Math.floor(Math.random() * events.length)];
        return { ...event, type: eventType };
    },

    /**
     * 根據回合/階段強制觸發重要人生事件
     * @param {Player} player
     * @returns {Object|null}
     */
    tryForcedLifeEvent(player) {
        const round = player.currentRound;
        const stage = player.currentStage;

        // 回合10~14：若還未結婚，40%機率觸發求婚事件
        if (round >= 10 && round <= 14 && player.familyStatus === 'single') {
            if (Math.random() < 0.4) {
                const ev = GAME_DATA.events.decision.find(e => e.id === 'marriage_proposal');
                if (ev) return { ...ev, type: 'decision' };
            }
        }

        // 回合15~19：若已婚且無小孩，40%機率觸發育兒事件
        if (round >= 15 && round <= 19 && player.familyStatus === 'married') {
            if (Math.random() < 0.4) {
                const ev = GAME_DATA.events.decision.find(e => e.id === 'baby_plan');
                if (ev) return { ...ev, type: 'decision' };
            }
        }

        // 每5回合有30%機率觸發健康相關事件（生病/住院）
        if (round % 5 === 0) {
            if (Math.random() < 0.3) {
                const healthEvents = GAME_DATA.events.negative.filter(e => e.category === 'health');
                if (healthEvents.length > 0) {
                    const ev = healthEvents[Math.floor(Math.random() * healthEvents.length)];
                    return { ...ev, type: 'negative' };
                }
            }
        }

        return null;
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

        // 處理現金按比例變動（如：cashPercent: -0.6 = 扣掉60%現金）
        if (effect.cashPercent !== undefined) {
            const amount = Math.floor(player.cash * effect.cashPercent);
            player.addCash(amount);
            result.cash = amount;
        }

        // 處理現金變動
        if (effect.cash) {
            player.addCash(effect.cash);
            result.cash = (result.cash || 0) + effect.cash;
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

        // 處理家庭狀態
        if (effect.familyStatus) {
            player.familyStatus = effect.familyStatus;
            result.familyStatus = effect.familyStatus;
        }

        // 處理資產
        if (effect.hasProperty) {
            player.hasProperty = true;
            result.hasProperty = true;
        }

        // 處理豪華資產收購
        if (effect.buyLuxury) {
            const luxury = GAME_DATA.luxuries.find(l => l.id === effect.buyLuxury);
            if (luxury && !player.luxuries.includes(luxury.id)) {
                player.luxuries.push(luxury.id);
                // 立即套用一次性效果（如果有）
                if (luxury.effect) {
                    for (const [stat, val] of Object.entries(luxury.effect)) {
                        player.addStat(stat, val);
                    }
                }
                result.buyLuxury = luxury.name;
            }
        }

        // 處理屬性變動
        for (const stat of ['wisdom', 'perseverance', 'social', 'luck']) {
            if (effect[stat]) {
                player.addStat(stat, effect[stat]);
                result[stat] = effect[stat];
            }
        }

        // 處理直接負債增加
        if (effect.debt) {
            player.debt += effect.debt;
            player.totalDebtTaken += effect.debt;
            if (player.debt > player.maxDebtReached) player.maxDebtReached = player.debt;
            result.debt = effect.debt;
        }

        // 處理提前還款（比例）
        if (effect.repayDebtPercent && player.debt > 0) {
            const repaid = Math.min(player.cash, Math.floor(player.debt * effect.repayDebtPercent));
            if (repaid > 0) {
                player.cash -= repaid;
                player.debt -= repaid;
                result.repaid = repaid;
            }
        }

        // 處理好友借款（50% 機率追不回）
        if (event.friendLoan) {
            if (Math.random() < 0.5) {
                result.friendLoanLost = true;
                result.friendLoanMessage = '💔 好友音訊全無，200 金幣追不回了！';
            } else {
                player.addCash(200);
                result.friendLoanMessage = '😊 好友如期還款，還多給了 10% 利息！';
                player.addCash(20);
            }
        }

        // 記錄事件到歷史（用於人生故事生成）
        if (event && event.id) {
            player.eventHistory = player.eventHistory || [];
            player.eventHistory.push({
                round: player.currentRound,
                eventId: event.id,
                title: event.title,
                type: event.type
            });
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

        if (result.familyStatus) {
            const familyName = { married: '邁入婚姻 💍', parent: '喜迎麟兒 🍼' };
            parts.push(familyName[result.familyStatus] || '家庭狀態變更');
        }

        if (result.buyLuxury) {
            parts.push(`獲得 ${result.buyLuxury} 💎`);
        }

        if (result.hasProperty) {
            parts.push('成功置產 🏠');
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
