export type visitor = {
    id: number;
    name: string;
    purpose: string;
    contact: string;
    entry_time: string;
    exit_time: string;
    approver_id: number;
    approver:   string | null;
    status: string;
    created_at: string;
    updated_at: string;
    qr_code: string;
    scan_count: number;
    date: string;
};
