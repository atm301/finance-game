/**
 * 財商小達人 v4.0 - 人生故事生成器
 * 根據玩家的實際行動和事件，生成個人化的小說風格故事
 */

const Story = {
    /**
     * 根據玩家數據生成完整人生故事
     * @param {Player} player - 玩家實例
     * @returns {string} HTML 格式的故事內容
     */
    generate(player) {
        const stageNames = ['學生時期', '大學時期', '職場新鮮人', '事業發展期', '退休準備期'];
        const sections = [];

        const p = player;
        const name = p.name || '你';
        const netWorth = Math.round(p.getNetWorth());
        const finalCareer = GAME_DATA.careers.find(c => c.id === p.currentCareer);
        const careerName = finalCareer ? finalCareer.name : '工作者';

        // ── 序章 ──
        sections.push(this._renderSection('📖 序章：人生的起點', `
            ${name}，一個平凡卻充滿可能的人，帶著 <strong>500 金幣</strong>的口袋，踏上了這場長達 25 個回合的人生旅途。
            ${p.traits.length > 0 ? `從一開始，你就展現了 <em>${p.traits.slice(0, 2).join('、')}</em> 的特質，這將深刻影響你未來的每一個決策。` : ''}
            沒有人知道前方等待著什麼——機遇、風險、愛情，還是挫折。只有時間，才能給出答案。
        `));

        // ── 第一章：學生與青春 ──
        const earlyEvents = (p.eventHistory || []).filter(e => e.round <= 10);
        const studyVerb = p.learnCount > 5 ? '如饑似渴地學習' : p.spendCount > 5 ? '盡情享受青春' : '穩健地探索';
        sections.push(this._renderSection('🎒 第一章：青春歲月（學生 → 大學）', `
            年輕的 ${name} ${studyVerb}，用每一個選擇塑造著未來的樣貌。
            ${p.stats.wisdom >= 8 ? `你的智慧屬性高達 <strong>${p.stats.wisdom}</strong>，顯示你從未停下求知的腳步。` : ''}
            ${p.saveCount > 0 ? `那些把零用錢存入小豬撲滿的日子，埋下了理財意識的種子。` : ''}
            ${earlyEvents.length > 0 ? `印象最深的是「${earlyEvents[0].title}」這件事，深深影響了你的財務觀念。` : ''}
            ${p.stats.luck >= 5 ? '上天似乎特別眷顧你，幸運的巧合一次次在你身邊發生。' : ''}
        `));

        // ── 第二章：踏入職場 ──
        const midEvents = (p.eventHistory || []).filter(e => e.round > 10 && e.round <= 20);
        const investDesc = p.hasEverInvested
            ? `你做出了改變命運的決定——開始投資，${Finance.formatMoney(Math.round(p.totalInvested))} 金幣注入市場`
            : '你選擇把錢放在口袋裡，錯過了複利增長的黃金期';
        sections.push(this._renderSection('💼 第二章：踏入職場（職場新鮮人時期）', `
            告別學生身份，${name} 以 <strong>${this._getInitialCareer(p)}</strong> 的身份踏入社會。
            ${investDesc}。
            ${p.debt > 500 ? `人生有些壓力是難免的——<strong style="color:#ef4444">${Finance.formatMoney(Math.round(p.debt))}</strong> 的負債如影隨形，提醒著你謹慎的重要。` : ''}
            ${midEvents.length > 0 ? `「${midEvents[0].title}」讓你深刻體會到，人生的轉折往往在意料之外。` : ''}
            ${p.luxuries.length > 0 ? `你也犒賞了自己——${p.luxuries.map(id => GAME_DATA.luxuries.find(l => l.id === id)?.name).filter(Boolean).join('、')}，成為你身份的象徵。` : ''}
        `));

        // ── 第三章：事業黃金期 ──
        const lateEvents = (p.eventHistory || []).filter(e => e.round > 20);
        sections.push(this._renderSection('📈 第三章：事業巔峰（事業發展期 → 退休準備）', `
            歲月如梭，${name} 如今已是 <strong>${careerName}</strong>，月薪 ${Finance.formatMoney(finalCareer?.baseSalary || 0)} 金幣。
            ${p.investmentReturn > 1000 ? `這些年的投資沒有白費，累積報酬高達 <strong style="color:#10b981">${Finance.formatMoney(Math.round(p.investmentReturn))}</strong> 金幣！複利的魔力讓你深感震撼。` : ''}
            ${p.familyStatus !== 'single' ? `在事業之外，你也建立了自己的家庭，多了一份責任，也多了一份溫暖。` : ''}
            ${lateEvents.length > 0 ? `「${lateEvents[0].title}」，是你在人生後期永遠難忘的一刻。` : ''}
            ${p.totalDonations > 0 ? `你沒有忘記回饋社會，累計捐款 ${Finance.formatMoney(p.totalDonations)} 金幣，善意在世間流轉。` : ''}
        `));

        // ── 尾聲：人生總結 ──
        const evalText = netWorth >= 50000 ? '財富自由的傳說人物' :
            netWorth >= 20000 ? '出色的財務管理者' :
                netWorth >= 5000 ? '辛勤積累的普通人' : '在財務上仍有很多功課要做的學習者';
        sections.push(this._renderSection('🌅 尾聲：歲月的禮物', `
            當帷幕緩緩落下，${name} 的人生給出了它的答案——最終淨值 
            <strong style="color:var(--accent-gold)">${Finance.formatMoney(netWorth)}</strong> 金幣，
            你是一位 <strong>${evalText}</strong>。
            <br><br>
            ${p.hadNegativeNetWorth ? '你曾跌到人生谷底，但你站了起來。這份韌性，比任何財富都珍貴。' : ''}
            ${p.scamAvoided > 0 ? '你成功識破了詐騙，保護了自己辛苦累積的財富。' : ''}
            ${p.gamesCompleted > 1 ? `這已經是你第 ${p.gamesCompleted + 1} 次踏上這段旅途，每一次都讓你更加智慧。` : ''}
            <br><br>
            <em>「人生最好的投資，是投資自己的知識與品格。」</em>
        `));

        return sections.join('');
    },

    /**
     * 渲染故事段落
     */
    _renderSection(title, content) {
        return `
            <div style="margin-bottom: 28px; padding: 20px; background: rgba(255,255,255,0.04); border-left: 3px solid var(--primary-color); border-radius: 0 12px 12px 0;">
                <h4 style="color: var(--accent-gold); margin-bottom: 12px; font-size: 1rem;">${title}</h4>
                <p style="line-height: 1.8; color: var(--text-secondary); font-size: 0.9rem;">${content.trim()}</p>
            </div>
        `;
    },

    /**
     * 取得玩家的初始職業判斷
     */
    _getInitialCareer(player) {
        if (player.careerHistory && player.careerHistory.length > 0) {
            return player.careerHistory[0].name || '初級職員';
        }
        return '初級職員';
    },

    /**
     * 生成財務建議摘要
     * @param {Player} player
     * @returns {string} HTML
     */
    generateAdvice(player) {
        const p = player;
        const tips = [];
        const netWorth = Math.round(p.getNetWorth());

        if (!p.hasEverInvested) {
            const comparison = Finance.compareInvestment ? Finance.compareInvestment(500, 0.07, 25) : null;
            tips.push(`📌 <strong>從未投資</strong>：若把初始 500 金幣以年報酬 7% 複利計算 25 回合，可成長至 ${comparison ? Finance.formatMoney(comparison.withInvest) : '數倍'}！<span style="color:var(--text-muted)">▶ 建議：及早開始定期定額投資。</span>`);
        } else if (p.totalInvested < 300) {
            tips.push(`📌 <strong>投資金額偏低（${Finance.formatMoney(Math.round(p.totalInvested))}）</strong>：複利需要足夠本金才能顯現威力。<span style="color:var(--text-muted)">▶ 建議：每回合至少投入現金的 30%。</span>`);
        } else {
            tips.push(`✅ <strong>投資表現出色</strong>：累積投資報酬 ${Finance.formatMoney(Math.round(p.investmentReturn))} 金幣！<span style="color:var(--text-muted)">▶ 繼續保持長期投資習慣。</span>`);
        }

        if (p.debt > 1000) {
            tips.push(`⚠️ <strong>高負債警報（${Finance.formatMoney(Math.round(p.debt))}）</strong>：負債每回合以 5% 利息滾動，侵蝕財富。<span style="color:var(--text-muted)">▶ 建議：優先還清高利率負債，避免雪球效應。</span>`);
        } else if (p.debt > 0) {
            tips.push(`💡 <strong>輕微負債（${Finance.formatMoney(Math.round(p.debt))}）</strong>：尚在可控範圍，但宜盡早清償。<span style="color:var(--text-muted)">▶ 建議：善用「還債」行動降低利息損失。</span>`);
        }

        if (p.spendCount > 12) {
            tips.push(`🛒 <strong>消費偏高（${p.spendCount} 次）</strong>：享受生活是必要的，但過度消費會縮短財務跑道。<span style="color:var(--text-muted)">▶ 建議：先儲蓄/投資，再用剩餘資金消費。</span>`);
        }

        if (p.luxuries.length > 2 && p.debt > 2000) {
            tips.push(`🏎️ <strong>豪華陷阱</strong>：擁有 ${p.luxuries.length} 件豪華資產，但負債仍高。維護費可能持續拖累財務。<span style="color:var(--text-muted)">▶ 建議：考慮出售部分資產償還負債。</span>`);
        }

        if (netWorth < 2000) {
            tips.push(`🎯 <strong>財富積累建議</strong>：最終淨值 ${Finance.formatMoney(netWorth)}，距離財務自由還有段距離。<span style="color:var(--text-muted)">▶ 建議：下次嘗試「每回合先投資，再做其他行動」的策略！</span>`);
        } else if (netWorth >= 50000) {
            tips.push(`🌟 <strong>卓越成就！</strong>：最終淨值 ${Finance.formatMoney(netWorth)}，你已達到財務自由里程碑！<span style="color:var(--text-muted)">▶ 挑戰：下次嘗試達到商業大亨職稱！</span>`);
        }

        return tips.map(t => `<div style="margin-bottom:12px; padding:12px 16px; background:rgba(99,102,241,0.08); border-radius:10px; font-size:0.88rem; line-height:1.7;">${t}</div>`).join('');
    }
};
