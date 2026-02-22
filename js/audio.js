/**
 * 財商小達人 - 音效系統
 */

const AudioManager = {
    bgm: null,
    sounds: {},
    isMuted: false,
    bgmVolume: 0.3,
    sfxVolume: 0.5,

    // 初始化音效
    init() {
        // 使用 Web Audio API 生成簡單音效
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 載入設定
        const savedMute = localStorage.getItem('financeGame_muted');
        this.isMuted = savedMute === 'true';
    },

    // 播放音效
    play(soundName) {
        if (this.isMuted) return;

        switch (soundName) {
            case 'click':
                this.playTone(800, 0.1, 'square');
                break;
            case 'coin':
                this.playTone(1200, 0.15, 'sine');
                setTimeout(() => this.playTone(1500, 0.15, 'sine'), 100);
                break;
            case 'success':
                this.playTone(523, 0.15, 'sine');
                setTimeout(() => this.playTone(659, 0.15, 'sine'), 100);
                setTimeout(() => this.playTone(784, 0.2, 'sine'), 200);
                break;
            case 'fail':
                this.playTone(400, 0.2, 'sawtooth');
                setTimeout(() => this.playTone(300, 0.3, 'sawtooth'), 150);
                break;
            case 'achievement':
                this.playTone(523, 0.1, 'sine');
                setTimeout(() => this.playTone(659, 0.1, 'sine'), 80);
                setTimeout(() => this.playTone(784, 0.1, 'sine'), 160);
                setTimeout(() => this.playTone(1047, 0.3, 'sine'), 240);
                break;
            case 'levelup':
                this.playTone(440, 0.1, 'sine');
                setTimeout(() => this.playTone(554, 0.1, 'sine'), 100);
                setTimeout(() => this.playTone(659, 0.1, 'sine'), 200);
                setTimeout(() => this.playTone(880, 0.3, 'sine'), 300);
                break;
        }
    },

    // 使用 Web Audio API 播放音調
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext || this.isMuted) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(this.sfxVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    // 播放背景音樂
    playBGM() {
        if (this.isMuted || this.bgm) return;

        // 使用簡單的音樂生成
        this.startAmbientMusic();
    },

    // 生成環境音樂
    startAmbientMusic() {
        if (!this.audioContext || this.isMuted) return;

        const playNote = (freq, time, dur) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(this.bgmVolume * 0.3, time + 0.1);
            gain.gain.linearRampToValueAtTime(0, time + dur);

            osc.start(time);
            osc.stop(time + dur);
        };

        // 簡單的和弦進行
        const chords = [
            [261, 329, 392], // C
            [293, 369, 440], // Dm
            [349, 440, 523], // F
            [392, 493, 587]  // G
        ];

        let time = this.audioContext.currentTime;
        const noteDur = 2;

        const playSequence = () => {
            if (this.isMuted) return;

            time = this.audioContext.currentTime;
            chords.forEach((chord, i) => {
                chord.forEach(freq => {
                    playNote(freq, time + i * noteDur, noteDur * 0.9);
                });
            });

            this.bgmTimeout = setTimeout(playSequence, chords.length * noteDur * 1000);
        };

        playSequence();
    },

    // 停止背景音樂
    stopBGM() {
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
    },

    // 切換靜音
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('financeGame_muted', this.isMuted);

        if (this.isMuted) {
            this.stopBGM();
        }

        return this.isMuted;
    },

    // 設定音量
    setVolume(type, value) {
        if (type === 'bgm') {
            this.bgmVolume = value;
        } else {
            this.sfxVolume = value;
        }
    },

    // 恢復音訊上下文（某些瀏覽器需要用戶互動後才能播放音訊）
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    AudioManager.init();
});

// 首次用戶互動時恢復音訊
document.addEventListener('click', () => {
    AudioManager.resume();
}, { once: true });
