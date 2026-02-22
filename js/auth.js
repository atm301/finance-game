/**
 * 財商小達人 - Firebase 認證 & 雲端成就儲存系統
 *
 * ══════════════════════════════════════════════
 *  如何啟用 Google 登入 + 雲端儲存：
 *  1. 前往 https://console.firebase.google.com/
 *  2. 新建專案（例：finance-game）
 *  3. 啟用 Authentication → Google 登入方式
 *  4. 啟用 Firestore Database（測試模式即可）
 *  5. 在專案設定 → 應用程式，複製 firebaseConfig
 *  6. 貼入下方 firebaseConfig（覆蓋 YOUR_... 部分）
 *  7. Firestore 安全規則：
 *     rules_version = '2';
 *     service cloud.firestore {
 *       match /databases/{database}/documents {
 *         match /players/{uid} {
 *           allow read, write: if request.auth != null && request.auth.uid == uid;
 *         }
 *       }
 *     }
 * ══════════════════════════════════════════════
 */

const Auth = {
    currentUser: null,
    isInitialized: false,
    db: null,

    // ★ 在此貼入您的 Firebase 設定
    firebaseConfig: {
        apiKey: "AIzaSyCFXwVaOTMgZPpeWgG3DliJOd6-Wa_0vBY",
        authDomain: "finance-game-c0f8d.firebaseapp.com",
        projectId: "finance-game-c0f8d",
        storageBucket: "finance-game-c0f8d.firebasestorage.app",
        messagingSenderId: "785765385470",
        appId: "1:785765385470:web:91bbaec6df5a66692051af",
        measurementId: "G-4Y32FM1331"
    },

    // 判斷是否已完整設定 Firebase
    isConfigured() {
        return !this.firebaseConfig.apiKey.includes('YOUR_');
    },

    // 初始化
    async init() {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK 未載入，使用本地存檔模式');
            this.useFallbackMode();
            return;
        }

        if (!this.isConfigured()) {
            console.warn('Firebase 尚未設定，使用本地存檔模式（見 js/auth.js 說明）');
            this.useFallbackMode();
            return;
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(this.firebaseConfig);
            }
            this.db = firebase.firestore();

            firebase.auth().onAuthStateChanged((user) => {
                this.currentUser = user;
                this.onAuthStateChanged(user);
            });

            this.isInitialized = true;
        } catch (error) {
            console.error('Firebase 初始化失敗:', error);
            this.useFallbackMode();
        }
    },

    // 本地模式（無 Firebase 或未設定時）
    useFallbackMode() {
        this.isInitialized = true;
        this.currentUser = this.getLocalUser();
        this.onAuthStateChanged(this.currentUser);
    },

    getLocalUser() {
        const saved = localStorage.getItem('financeGame_localUser');
        return saved ? JSON.parse(saved) : null;
    },

    // 認證狀態變更回調
    onAuthStateChanged(user) {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');

        if (loginBtn && userInfo) {
            if (user) {
                loginBtn.style.display = 'none';
                userInfo.style.display = 'flex';
                userInfo.innerHTML = `
                    <img src="${user.photoURL || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%220.9em%22 font-size=%2280%22>👤</text></svg>'}"
                         alt="avatar" class="user-avatar">
                    <span class="user-name">${user.displayName || user.email || '玩家'}</span>
                    <button class="btn btn-secondary btn-sm" onclick="Auth.logout()">登出</button>
                `;
            } else {
                loginBtn.style.display = 'inline-flex';
                userInfo.style.display = 'none';
            }
        }

        // 已登入：同步雲端資料
        if (user) {
            this.syncFromCloud(user.uid);
        }
    },

    // Google 登入
    async loginWithGoogle() {
        // 若未設定 Firebase，使用本地模擬登入
        if (!this.isConfigured() || typeof firebase === 'undefined') {
            const localUser = {
                uid: 'local_' + Date.now(),
                displayName: '本地玩家',
                email: 'local@game.com',
                photoURL: null
            };
            localStorage.setItem('financeGame_localUser', JSON.stringify(localUser));
            this.currentUser = localUser;
            this.onAuthStateChanged(localUser);
            if (typeof AudioManager !== 'undefined') AudioManager.play('success');
            return localUser;
        }

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebase.auth().signInWithPopup(provider);
            if (typeof AudioManager !== 'undefined') AudioManager.play('success');
            return result.user;
        } catch (error) {
            console.error('Google 登入失敗:', error);
            if (typeof AudioManager !== 'undefined') AudioManager.play('fail');
            // fallback 本地登入
            return this.loginAsLocal();
        }
    },

    // 本地臨時登入（無 Firebase 時使用）
    loginAsLocal() {
        const localUser = {
            uid: 'local_' + Date.now(),
            displayName: '本地玩家',
            email: null,
            photoURL: null
        };
        localStorage.setItem('financeGame_localUser', JSON.stringify(localUser));
        this.currentUser = localUser;
        this.onAuthStateChanged(localUser);
        return localUser;
    },

    // 登出
    async logout() {
        if (!this.isConfigured() || typeof firebase === 'undefined') {
            localStorage.removeItem('financeGame_localUser');
            this.currentUser = null;
            this.onAuthStateChanged(null);
            return;
        }
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.error('登出失敗:', error);
        }
    },

    // ─── 成就存儲（本地 + 雲端雙重備份）───────────────────

    /** 儲存成就到本地 + 雲端 */
    async saveAchievements(achievementData) {
        // 1. 永遠存本地
        const key = this.currentUser
            ? `financeGame_achievements_${this.currentUser.uid}`
            : 'financeGame_achievements_guest';
        localStorage.setItem(key, JSON.stringify({
            ...achievementData,
            savedAt: new Date().toISOString()
        }));

        // 2. 登入且有 Firebase 則同步雲端
        if (this.currentUser && this.db && this.isConfigured()) {
            try {
                await this.db.collection('players').doc(this.currentUser.uid).set({
                    achievements: achievementData,
                    lastSaved: firebase.firestore.FieldValue.serverTimestamp(),
                    playerName: this.currentUser.displayName || '玩家'
                }, { merge: true });
            } catch (err) {
                console.warn('雲端儲存成就失敗（使用本地備份）:', err.message);
            }
        }
    },

    /** 從本地 / 雲端讀取成就 */
    async loadAchievements() {
        const uid = this.currentUser?.uid;

        // 優先嘗試雲端
        if (uid && this.db && this.isConfigured()) {
            try {
                const doc = await this.db.collection('players').doc(uid).get();
                if (doc.exists && doc.data().achievements) {
                    const data = doc.data().achievements;
                    // 合併到本地
                    localStorage.setItem(`financeGame_achievements_${uid}`, JSON.stringify(data));
                    return data;
                }
            } catch (err) {
                console.warn('雲端讀取失敗，使用本地:', err.message);
            }
        }

        // 本地備份
        const localKey = uid
            ? `financeGame_achievements_${uid}`
            : 'financeGame_achievements_guest';
        const local = localStorage.getItem(localKey);
        return local ? JSON.parse(local) : null;
    },

    /** 登入後自動同步雲端成就到本地 */
    async syncFromCloud(uid) {
        if (!this.db || !this.isConfigured()) return;
        try {
            const doc = await this.db.collection('players').doc(uid).get();
            if (doc.exists && doc.data().achievements) {
                if (typeof achievementSystem !== 'undefined') {
                    achievementSystem.loadFromSave(doc.data().achievements);
                }
            }
        } catch (err) {
            console.warn('雲端同步失敗:', err.message);
        }
    },

    // ─── 存檔 ─────────────────────────────────────────────

    async saveCloudData(data) {
        if (!this.currentUser) return false;

        const saveData = {
            ...data,
            achievements: typeof achievementSystem !== 'undefined'
                ? achievementSystem.getSaveData() : {},
            lastSaved: new Date().toISOString()
        };

        // 本地備份
        localStorage.setItem(
            `financeGame_cloud_${this.currentUser.uid}`,
            JSON.stringify(saveData)
        );

        // 雲端同步
        if (this.db && this.isConfigured()) {
            try {
                await this.db.collection('players').doc(this.currentUser.uid)
                    .set(saveData, { merge: true });
            } catch (err) {
                console.warn('雲端存檔失敗:', err.message);
            }
        }

        return true;
    },

    async loadCloudData(uid) {
        // 嘗試雲端
        if (this.db && this.isConfigured()) {
            try {
                const doc = await this.db.collection('players').doc(uid).get();
                if (doc.exists) {
                    const data = doc.data();
                    if (typeof achievementSystem !== 'undefined') {
                        achievementSystem.loadFromSave(data);
                    }
                    return data;
                }
            } catch (err) {
                console.warn('雲端讀取失敗:', err.message);
            }
        }

        // 本地備份
        const local = localStorage.getItem(`financeGame_cloud_${uid}`);
        if (local) {
            const data = JSON.parse(local);
            if (typeof achievementSystem !== 'undefined') {
                achievementSystem.loadFromSave(data);
            }
            return data;
        }
        return null;
    },

    // ─── 獎勵 Email ───────────────────────────────────────

    async checkAndSendRewardEmail() {
        if (!this.currentUser || typeof achievementSystem === 'undefined') return false;
        if (!achievementSystem.hasAllPositive()) return false;

        const rewardKey = `financeGame_rewardSent_${this.currentUser.uid}`;
        if (localStorage.getItem(rewardKey)) return false;

        try {
            if (this.db && this.isConfigured() && typeof firebase !== 'undefined' && firebase.functions) {
                const sendReward = firebase.functions().httpsCallable('sendRewardEmail');
                await sendReward({
                    email: this.currentUser.email,
                    displayName: this.currentUser.displayName,
                    achievements: achievementSystem.getUnlockedAchievements()
                });
            }
            localStorage.setItem(rewardKey, 'true');
            return true;
        } catch (err) {
            console.warn('獎勵 Email 發送失敗:', err.message);
            return false;
        }
    },

    getUser() { return this.currentUser; },
    isLoggedIn() { return !!this.currentUser; }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
