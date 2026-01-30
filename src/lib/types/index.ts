// 1. Tipe Data Merchant (Perusahaan)
export interface Merchant {
    id: number;
    user_id: number;
    company_name: string;
    slug: string;
    is_verified: boolean;
    plan_type: 'basic' | 'pro' | 'enterprise'; // Penting untuk label paket
    subscription_expires_at?: string;
    logo_url?: string;
}

// 2. Tipe Data User (Sekarang memuat data Merchant)
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'merchant';
    // Tambahkan ini agar kita bisa akses userState.user.merchant.plan_type
    merchant?: Merchant; 
}

// 3. Tipe Data Produk
export interface Product {
    id: number;
    name: string;
    sku: string;
    image_url: string;
    active: boolean;
    merchant_id?: number;
}

// 4. Tipe Data Response Dashboard (Analytics)
export interface AnalyticsSummary {
    total_products: number;
    total_batches: number;
    total_scans: number;
    suspicious_scans: number;
    quota_used: number;
    quota_limit: number;
    plan_type: string;
    recent_scans: Array<{
        product: string;
        location: string;
        time: string;
        status: 'valid' | 'suspicious';
    }>;
    chart_data: number[];
}

// 5. Tipe Data Hasil Verifikasi (Untuk halaman Scan)
export interface VerificationResult {
    status: 'authentic' | 'suspicious' | 'fake' | 'invalid'; // Sesuaikan dengan controller backend
    message: string;
    scan_count?: number;
    product?: {
        name: string;
        image_url: string;
        description: string;
        batch: string;
        merchant: {
            company_name: string;
            is_verified: boolean;
            logo_url?: string;
        };
    };
}