/**
 * 財商小達人 - Firebase 認證系統
 * 
 * 注意：需要先在 Firebase Console 建立專案並啟用 Google 登入
 * 然後替換下方的 firebaseConfig
 */

const Auth = {
    currentUser: null,
    isInitialized: false,

    // Firebase 設定（需要替換為實際的專案設定）
    firebaseConfig: {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    },

    // 初始化
    async init() {
        // 檢查是否有 Firebase SDK
        if (typeof firebase === 'undefined') {
            console.log('Firebase SDK 未載入，使用本地存檔模式');
            this.useFallbackMode();
            return;
        }

        try {
            // 初始化 Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(this.firebaseConfig);
            }

            // 監聽認證狀態
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

    // 使用本地模式（無 Firebase）
    useFallbackMode() {
        this.isInitialized = true;
        this.currentUser = this.getLocalUser();
        this.onAuthStateChanged(this.currentUser);
    },

    // 取得本地使用者
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
                    <img src="${user.photoURL || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%220.9em%22 font-size=%2280%22>👤</text></svg>'}" alt="avatar" class="user-avatar">
                    <span class="user-name">${user.displayName || user.email || '玩家'}</span>
                    <button class="btn btn-secondary btn-sm" onclick="Auth.logout()">登出</button>
                `;
            } else {
                loginBtn.style.display = 'inline-flex';
                userInfo.style.display = 'none';
            }
        }

        // 載入雲端資料
        if (user) {
            this.loadCloudData(user.uid);
        }
    },

    // Google 登入
    async loginWithGoogle() {
        if (typeof firebase === 'undefined') {
            // 模擬登入（本地模式）
            const localUser = {
                uid: 'local_' + Date.now(),
                displayName: '本地玩家',
                email: 'local@game.com',
                photoURL: null
            };
            localStorage.setItem('financeGame_localUser', JSON.stringify(localUser));
            this.currentUser = localUser;
            this.onAuthStateChanged(localUser);
            AudioManager.play('success');
            return localUser;
        }

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebase.auth().signInWithPopup(provider);
            AudioManager.play('success');
            return result.user;
        } catch (error) {
            console.error('登入失敗:', error);
            AudioManager.play('fail');
            throw error;
        }
    },

    // 登出
    async logout() {
        if (typeof firebase === 'undefined') {
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

    // 儲存資料到雲端
    async saveCloudData(data) {
        if (!this.currentUser) return false;

        const saveData = {
            ...data,
            achievements: achievementSystem.getSaveData(),
            lastSaved: new Date().toISOString(),
            gamesCompleted: data.gamesCompleted || 0
        };

        if (typeof firebase !== 'undefined' && firebase.firestore) {
            try {
                await firebase.firestore()
                    .collection('players')
                    .doc(this.currentUser.uid)
                    .set(saveData, { merge: true });
                return true;
            } catch (error) {
                console.error('雲端儲存失敗:', error);
            }
        }

        // 本地備份
        localStorage.setItem(`financeGame_cloud_${this.currentUser.uid}`, JSON.stringify(saveData));
        return true;
    },

    // 從雲端載入資料
    async loadCloudData(uid) {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            try {
                const doc = await firebase.firestore()
                    .collection('players')
                    .doc(uid)
                    .get();

                if (doc.exists) {
                    const data = doc.data();
                    achievementSystem.loadFromSave(data);
                    return data;
                }
            } catch (error) {
                console.error('雲端載入失敗:', error);
            }
        }

        // 嘗試本地備份
        const local = localStorage.getItem(`financeGame_cloud_${uid}`);
        if (local) {
            const data = JSON.parse(local);
            achievementSystem.loadFromSave(data);
            return data;
        }

        return null;
    },

    // 檢查並發送獎勵 Email
    async checkAndSendRewardEmail() {
        if (!this.currentUser || !achievementSystem.hasAllPositive()) {
            return false;
        }

        // 檢查是否已發送過
        const rewardSent = localStorage.getItem(`financeGame_rewardSent_${this.currentUser.uid}`);
        if (rewardSent) return false;

        try {
            if (typeof firebase !== 'undefined' && firebase.functions) {
                const sendRewardEmail = firebase.functions().httpsCallable('sendRewardEmail');
                await sendRewardEmail({
                    email: this.currentUser.email,
                    displayName: this.currentUser.displayName,
                    achievements: achievementSystem.getUnlockedAchievements()
                });
            }

            localStorage.setItem(`financeGame_rewardSent_${this.currentUser.uid}`, 'true');
            return true;
        } catch (error) {
            console.error('發送獎勵 Email 失敗:', error);
            return false;
        }
    },

    // 取得使用者資訊
    getUser() {
        return this.currentUser;
    },

    // 是否已登入
    isLoggedIn() {
        return !!this.currentUser;
    }
};

// 初始化認證系統
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
