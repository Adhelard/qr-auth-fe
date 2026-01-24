// src/lib/services/api.ts
import { userState } from '$lib/stores/user.svelte';
import { goto } from '$app/navigation';

// Ganti URL ini sesuai backend Laravel-mu
const BASE_URL = 'http://localhost:8000/api'; // Pastikan ada /api

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function api(endpoint: string, options: FetchOptions = {}) {
    // Gabungkan path
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    // Default Headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
    };

    // Auto-inject Token jika ada
    if (userState.token) {
        headers['Authorization'] = `Bearer ${userState.token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    // Handle 401 Unauthorized (Token expired)
    if (response.status === 401) {
        userState.logout();
        goto('/login');
        throw new Error('Session expired');
    }

    // Kembalikan JSON response (atau throw error jika !ok)
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server');
    }

    return data;
}