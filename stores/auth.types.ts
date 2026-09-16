export interface CurrentUser {
    id: string;
    email: string;
    name: string;
    planType?: 'FREE' | 'PRO'; // Optional since visitor might not have a planType
    role: string;
    permissions: string[];
}