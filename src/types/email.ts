export type EmailCategory = 
  | "interested" 
  | "meeting" 
  | "not-interested" 
  | "spam" 
  | "ooo" 
  | "uncategorized";

export interface Email {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  preview: string;
  body: string;
  date: Date;
  category: EmailCategory;
  account: string;
  isRead: boolean;
  hasAttachments: boolean;
}

export interface EmailMessage {
  userId: string;
  uid: string;
  subject: string;
  from: string;
  date: Date;
  body: string;
  folder: string;
  email: string;
  isRead?: boolean;
  isStarred?: boolean;
  category: EmailCategory;
  categorizedAt?: Date;
}

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'stopped';

export interface SyncStatusMessage {
  userId: string;
  status: SyncStatus;
  email?: string;
  error?: string;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'new_email' | 'sync_status';
  data: {
    email: EmailMessage;
    userId: string;
    timestamp: Date;
  } | {
    userId: string;
    status: SyncStatus;
    email?: string;
    error?: string;
    timestamp: Date;
  };
}

export interface EmailFilter {
  category: EmailCategory | null;
  searchQuery: string;
  sender: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}
