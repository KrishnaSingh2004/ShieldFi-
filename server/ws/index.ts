import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import type { WebSocketMessage } from '@shared/types';
 
interface ConnectedClient {
  id: string;
  socket: WebSocket;
  lastSeen: Date;
}
 
class WSManager {
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, ConnectedClient>();
 
  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      clientTracking: true 
    });
 
    this.wss.on('connection', (socket, request) => {
      const clientId = this.generateClientId();
      const client: ConnectedClient = {
        id: clientId,
        socket,
        lastSeen: new Date()
      };
 
      this.clients.set(clientId, client);
      console.log(`WebSocket client connected: ${clientId}`);
 
      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection_status',
        data: { connected: true, clientId }
      });
 
      socket.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error('Invalid WebSocket message:', error);
        }
      });
 
      socket.on('close', () => {
        this.clients.delete(clientId);
        console.log(`WebSocket client disconnected: ${clientId}`);
      });
 
      socket.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
 
      // Heartbeat
      socket.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.lastSeen = new Date();
        }
      });
    });
 
    // Clean up stale connections every 30 seconds
    setInterval(() => {
      this.cleanupStaleConnections();
    }, 30000);
 
    console.log('WebSocket server initialized on /ws');
  }
 
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
 
  private handleClientMessage(clientId: string, message: any) {
    console.log(`Message from client ${clientId}:`, message);
    // Handle client messages if needed
  }
 
  private cleanupStaleConnections() {
    const now = new Date();
    const staleThreshold = 60000; // 1 minute
 
    for (const [clientId, client] of Array.from(this.clients.entries())) {
      if (now.getTime() - client.lastSeen.getTime() > staleThreshold) {
        if (client.socket.readyState === WebSocket.OPEN) {
          client.socket.ping();
        } else {
          this.clients.delete(clientId);
          console.log(`Removed stale client: ${clientId}`);
        }
      }
    }
  }
 
  broadcast(message: WebSocketMessage) {
    if (!this.wss) return;
 
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(messageStr);
      }
    });
  }
 
  sendToClient(clientId: string, message: WebSocketMessage) {
    const client = this.clients.get(clientId);
    if (client && client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(JSON.stringify(message));
    }
  }
 
  getConnectedClients(): number {
    return this.clients.size;
  }
}
 
export const wsManager = new WSManager();
