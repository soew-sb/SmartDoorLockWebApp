export interface AccessRecord {
    id: number;
    action: 'PIN_ENTRY' | 'TIMEOUT' | 'MASTER_RESET';
    success: boolean;
    pin?: string;
    timestamp: string;
    device_id?: string;
    created_at: string;
  }
  
  export interface OtpRecord {
    id: number;
    otp: string;
    status: 'pending' | 'verified' | 'failed';
    device_id?: string;
    created_at: string;
  }
  