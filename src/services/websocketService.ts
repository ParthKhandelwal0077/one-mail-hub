import { EmailMessage, SyncStatus, WebSocketMessage } from '@/types/email';
import { tokenStorage } from '@/lib/auth';

export type WebSocketCallback = {
  onNewEmail?: (email: EmailMessage, userId: string, timestamp: Date) => void;
  onSyncStatus?: (status: SyncStatus, userId: string, email?: string, error?: string, timestamp?: Date) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
};

class WebSocketService {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketCallback = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isManuallyClosed = false;
  private readonly wsUrl = 'ws://localhost:5001';
  private statusCheckInterval: NodeJS.Timeout | null = null;

  connect(callbacks: WebSocketCallback) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.callbacks = callbacks;
    this.isManuallyClosed = false;
    this.establishConnection();
    this.startStatusCheck();
  }

  private establishConnection() {
    try {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        console.error('No access token available for WebSocket connection');
        this.callbacks.onError?.(new Event('Authentication required'));
        return;
      }

      // Connect to WebSocket with token as query parameter or in headers
      this.ws = new WebSocket(`${this.wsUrl}?token=${token}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.callbacks.onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.callbacks.onError?.(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.callbacks.onDisconnect?.();
        
        // Attempt to reconnect if not manually closed
        if (!this.isManuallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.establishConnection(), this.reconnectDelay);
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.callbacks.onError?.(new Event('Connection failed'));
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'new_email':
        if ('email' in message.data && 'userId' in message.data && 'timestamp' in message.data) {
          this.callbacks.onNewEmail?.(
            message.data.email,
            message.data.userId,
            new Date(message.data.timestamp)
          );
        }
        break;

      case 'sync_status':
        if ('userId' in message.data && 'status' in message.data && 'timestamp' in message.data) {
          this.callbacks.onSyncStatus?.(
            message.data.status,
            message.data.userId,
            message.data.email,
            message.data.error,
            new Date(message.data.timestamp)
          );
        }
        break;

      default:
        console.warn('Unknown message type:', message);
    }
  }

  private async startStatusCheck() {
    // Check WebSocket status every 30 seconds
    this.statusCheckInterval = setInterval(async () => {
      if (this.isManuallyClosed) return;
      
      try {
        const token = tokenStorage.getAccessToken();
        if (!token) return;

        const response = await fetch('http://localhost:5001/api/websocket/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.error('WebSocket status check failed');
        }
      } catch (error) {
        console.error('Error checking WebSocket status:', error);
      }
    }, 30000);
  }

  private stopStatusCheck() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }

  disconnect() {
    this.isManuallyClosed = true;
    this.stopStatusCheck();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getConnectionState(): number | null {
    return this.ws?.readyState ?? null;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();

