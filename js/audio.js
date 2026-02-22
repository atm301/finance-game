/**
 * 財商小達人 - 音效系統（多風格 BGM）
 */

const AudioManager = {
    bgm: null,
    sounds: {},
    isMuted: false,
    isPlayingBGM: false,
    bgmVolume: 0.3,
    sfxVolume: 0.5,
    currentBGMStyle: 'cozy',  // cozy / lofi / upbeat / tense / epic
    bgmTimeout: null,
    audioContext: null,

    bgmStyles: {
        cozy: { label: '☕ 輕鬆爵士', desc: '溫馨和弦，適合一般遊玩' },
        lofi: { label: '🎧 Lo-Fi 氛圍', desc: '低頻慢節奏，沉浸學習感' },
        upbeat: { label: '🎉 歡快旋律', desc: '大調活潑，適合牛市時期' },
        tense: { label: '⚡ 緊張刺激', desc: '半音進行，適合熊市危機' },
        epic: { label: '🏆 史詩宏大', desc: '磅礴和弦，財富巔峰時刻' }
    },

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API 不支援');
        }
        const savedMute = localStorage.getItem('financeGame_muted');
        const savedStyle = localStorage.getItem('financeGame_bgmStyle');
        this.isMuted = savedMute === 'true';
        if (savedStyle && this.bgmStyles[savedStyle]) this.currentBGMStyle = savedStyle;
    },

    // 播放音效
    play(soundName) {
        if (this.isMuted || !this.audioContext) return;
        switch (soundName) {
            case 'click': this.playTone(800, 0.08, 'square'); break;
            case 'coin':
                this.playTone(1200, 0.12, 'sine');
                setTimeout(() => this.playTone(1500, 0.15, 'sine'), 100);
                break;
            case 'success':
                [523, 659, 784].forEach((f, i) => setTimeout(() => this.playTone(f, 0.18, 'sine'), i * 100));
                break;
            case 'fail':
                this.playTone(400, 0.2, 'sawtooth');
                setTimeout(() => this.playTone(280, 0.3, 'sawtooth'), 150);
                break;
            case 'achievement':
                [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.playTone(f, 0.15, 'sine'), i * 80));
                break;
            case 'levelup':
                [440, 554, 659, 880].forEach((f, i) => setTimeout(() => this.playTone(f, 0.15, 'sine'), i * 100));
                break;
        }
    },

    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext || this.isMuted) return;
        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.type = type;
            osc.frequency.value = frequency;
            gain.gain.setValueAtTime(this.sfxVolume * 0.6, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + duration + 0.01);
        } catch (e) { }
    },

    // ── BGM 系統 ──────────────────────────────────────────

    playBGM() {
        if (this.isMuted || this.isPlayingBGM || !this.audioContext) return;
        this.isPlayingBGM = true;
        this._runBGM();
    },

    stopBGM() {
        if (this.bgmTimeout) { clearTimeout(this.bgmTimeout); this.bgmTimeout = null; }
        this.isPlayingBGM = false;
    },

    // 切換 BGM 風格（可在設定選單呼叫）
    setBGMStyle(style) {
        if (!this.bgmStyles[style]) return;
        this.currentBGMStyle = style;
        localStorage.setItem('financeGame_bgmStyle', style);
        if (this.isPlayingBGM) {
            this.stopBGM();
            setTimeout(() => this.playBGM(), 200);
        }
    },

    _runBGM() {
        if (this.isMuted || !this.isPlayingBGM) return;
        switch (this.currentBGMStyle) {
            case 'cozy': this._bgmCozy(); break;
            case 'lofi': this._bgmLofi(); break;
            case 'upbeat': this._bgmUpbeat(); break;
            case 'tense': this._bgmTense(); break;
            case 'epic': this._bgmEpic(); break;
            default: this._bgmCozy();
        }
    },

    _scheduleNote(freq, startSec, dur, vol = 0.08, type = 'sine') {
        if (!this.audioContext || this.isMuted) return;
        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain); gain.connect(this.audioContext.destination);
            osc.type = type; osc.frequency.value = freq;
            const t = this.audioContext.currentTime + startSec;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(this.bgmVolume * vol, t + 0.05);
            gain.gain.linearRampToValueAtTime(0, t + dur);
            osc.start(t); osc.stop(t + dur + 0.05);
        } catch (e) { }
    },

    // ☕ Cozy Jazz — C-Dm-F-G 和弦循環
    _bgmCozy() {
        const chords = [[261, 329, 392], [293, 369, 440], [349, 440, 523], [392, 493, 587]];
        const dur = 1.8;
        chords.forEach((chord, ci) => {
            chord.forEach(freq => this._scheduleNote(freq, ci * dur, dur * 0.85, 0.15));
        });
        this.bgmTimeout = setTimeout(() => { if (!this.isMuted && this.isPlayingBGM) this._bgmCozy(); }, chords.length * dur * 1000);
    },

    // 🎧 Lo-Fi — 低頻慢速三和弦 + 細微雜訊感
    _bgmLofi() {
        const notes = [[196, 246, 293], [220, 261, 329], [174, 220, 261]];
        const dur = 2.5;
        notes.forEach((chord, ci) => {
            chord.forEach((freq, fi) => {
                this._scheduleNote(freq, ci * dur + fi * 0.02, dur * 0.9, 0.12, 'sine');
            });
        });
        this.bgmTimeout = setTimeout(() => { if (!this.isMuted && this.isPlayingBGM) this._bgmLofi(); }, notes.length * dur * 1000);
    },

    // 🎉 Upbeat — 大調歡快旋律
    _bgmUpbeat() {
        const melody = [523, 587, 659, 698, 784, 698, 659, 587]; // C5大調音階
        const dur = 0.3;
        melody.forEach((freq, i) => this._scheduleNote(freq, i * dur, dur * 0.8, 0.18, 'triangle'));
        // 低音伴奏
        [261, 293, 349, 392].forEach((freq, i) => this._scheduleNote(freq, i * dur * 2, dur * 1.8, 0.1));
        this.bgmTimeout = setTimeout(() => { if (!this.isMuted && this.isPlayingBGM) this._bgmUpbeat(); }, melody.length * dur * 1000);
    },

    // ⚡ Tense — 緊張半音下行
    _bgmTense() {
        const seq = [440, 415, 391, 369, 349, 329, 311, 293];
        const dur = 0.5;
        seq.forEach((f, i) => {
            this._scheduleNote(f, i * dur, dur * 0.7, 0.15, 'sawtooth');
            this._scheduleNote(f * 0.5, i * dur, dur * 0.9, 0.08, 'square');
        });
        this.bgmTimeout = setTimeout(() => { if (!this.isMuted && this.isPlayingBGM) this._bgmTense(); }, seq.length * dur * 1000);
    },

    // 🏆 Epic — 宏大大和弦弦律
    _bgmEpic() {
        const chords = [[130, 164, 196, 261], [146, 184, 220, 293], [174, 220, 261, 349], [196, 246, 293, 392]];
        const dur = 2.2;
        chords.forEach((chord, ci) => {
            chord.forEach((freq, fi) => {
                this._scheduleNote(freq, ci * dur + fi * 0.03, dur * 0.9, fi === 0 ? 0.18 : 0.12, 'sine');
            });
        });
        this.bgmTimeout = setTimeout(() => { if (!this.isMuted && this.isPlayingBGM) this._bgmEpic(); }, chords.length * dur * 1000);
    },

    // ── 其他控制 ─────────────────────────────────────────

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('financeGame_muted', this.isMuted);
        if (this.isMuted) { this.stopBGM(); } else { this.playBGM(); }
        return this.isMuted;
    },

    setVolume(type, value) {
        if (type === 'bgm') this.bgmVolume = parseFloat(value);
        else this.sfxVolume = parseFloat(value);
    },

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                if (this.isPlayingBGM && !this.isMuted) this._runBGM();
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => { AudioManager.init(); });
document.addEventListener('click', () => { AudioManager.resume(); }, { once: true });
