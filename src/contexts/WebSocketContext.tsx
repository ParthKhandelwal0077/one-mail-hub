import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { websocketService } from '@/services/websocketService';
import { EmailMessage, SyncStatus } from '@/types/email';

interface WebSocketContextType {
  isConnected: boolean;
  emails: EmailMessage[];
  currentSyncStatus: SyncStatus | null;
  syncEmail: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [currentSyncStatus, setCurrentSyncStatus] = useState<SyncStatus | null>(null);
  const [syncEmail, setSyncEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect WebSocket if user is not authenticated
      websocketService.disconnect();
      setIsConnected(false);
      setEmails([]);
      return;
    }

    // Check WebSocket status when user logs in/signs up
    const checkWebSocketStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('http://localhost:5001/api/websocket/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          toast({
            title: "WebSocket Status Error",
            description: "Failed to check WebSocket status.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking WebSocket status:', error);
        toast({
          title: "Connection Error",
          description: "Failed to check WebSocket status.",
          variant: "destructive",
        });
      }
    };

    // Connect WebSocket when user is authenticated
    checkWebSocketStatus();
    
    websocketService.connect({
      onConnect: () => {
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "WebSocket connected successfully.",
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onError: () => {
        toast({
          title: "Connection Error",
          description: "Failed to connect to WebSocket.",
          variant: "destructive",
        });
      },
      onNewEmail: (email: EmailMessage, userId: string, timestamp: Date) => {
        if (userId === user.id) {
          setEmails((prev) => [email, ...prev]);
          toast({
            title: "New Email",
            description: email.subject,
          });
        }
      },
      onSyncStatus: (status: SyncStatus, userId: string, email?: string, error?: string, timestamp?: Date) => {
        if (userId === user.id) {
          setCurrentSyncStatus(status);
          setSyncEmail(email || null);

          // Show toast based on status
          if (status === 'syncing' && email) {
            toast({
              title: "Syncing Emails",
              description: `Syncing email: ${email}`,
            });
          } else if (status === 'error' && error) {
            toast({
              title: "Sync Error",
              description: error,
              variant: "destructive",
            });
          } else if (status === 'stopped') {
            toast({
              title: "Sync Stopped",
              description: "Email sync has stopped.",
            });
          } else if (status === 'idle') {
            toast({
              title: "Sync Idle",
              description: "Email sync is idle.",
            });
          }
        }
      },
    });

    // Cleanup on unmount or when user changes
    return () => {
      websocketService.disconnect();
    };
  }, [isAuthenticated, user, toast]);

  const value: WebSocketContextType = {
    isConnected,
    emails,
    currentSyncStatus,
    syncEmail,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

