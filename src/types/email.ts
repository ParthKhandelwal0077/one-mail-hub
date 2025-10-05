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

export interface EmailFilter {
  category: EmailCategory | null;
  searchQuery: string;
  sender: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}
