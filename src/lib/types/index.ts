export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'merchant';
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    image_url: string;
    active: boolean;
}


// src/lib/types/index.ts
export interface VerificationResult {
    status: 'valid' | 'already_scanned' | 'invalid';
    message: string;
    product?: {
        name: string;
        image_url: string;
        description: string;
        merchant: {
            company_name: string;
            is_verified: boolean;
        };
    };
    scan_data?: {
        scan_count: number;
        first_scanned_at: string;
        last_scanned_at: string;
    };
}