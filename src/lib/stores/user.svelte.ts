// src/lib/stores/user.svelte.ts
import { browser } from '$app/environment';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'merchant';
}

class UserState {
    // $state: Menyimpan token & user. Jika berubah, UI otomatis update.
    token = $state<string | null>(null);
    user = $state<User | null>(null);

    constructor() {
        if (browser) {
            // Ambil dari localStorage saat aplikasi dimuat
            this.token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.user = JSON.parse(storedUser);
            }
        }
    }

    // Method login: simpan ke state & localStorage
    login(token: string, userData: User) {
        this.token = token;
        this.user = userData;
        
        if (browser) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    }

    // Method logout: hapus data
    logout() {
        this.token = null;
        this.user = null;
        if (browser) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    // Getter untuk mengecek apakah sedang login
    get isAuthenticated() {
        return !!this.token;
    }
}

// Export sebagai singleton
export const userState = new UserState();