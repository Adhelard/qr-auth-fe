import { browser } from '$app/environment';
// Import User dari file types agar sinkron
import type { User } from '$lib/types'; 

class UserState {
    // State: Menyimpan token & user. 
    token = $state<string | null>(null);
    user = $state<User | null>(null); // Sekarang User ini punya properti .merchant

    constructor() {
        if (browser) {
            this.token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    this.user = JSON.parse(storedUser);
                } catch (e) {
                    console.error("Gagal parse user data", e);
                    this.logout(); // Reset jika data corrupt
                }
            }
        }
    }

    login(token: string, userData: User) {
        this.token = token;
        this.user = userData;
        
        if (browser) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        if (browser) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    get isAuthenticated() {
        return !!this.token;
    }
    
    // Helper untuk mengambil plan type dengan aman
    get currentPlan() {
        return this.user?.merchant?.plan_type || 'basic';
    }
}

export const userState = new UserState();