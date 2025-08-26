import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types";

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private eventListeners: Map<string, Function[]> = new Map();

  public connect(token: string): void {
    if (this.socket?.connected) {
      this.disconnect();
    }

    this.token = token;

    this.socket = io(
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000",
      {
        auth: {
          token,
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
      }
    );

    this.setupEventHandlers();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
      this.reconnectAttempts = 0;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public getSocket(): Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null {
    return this.socket;
  }

  // Board operations
  public joinBoard(boardId: string): void {
    this.socket?.emit("board:join", boardId);
  }

  public leaveBoard(boardId: string): void {
    this.socket?.emit("board:leave", boardId);
  }

  public updateBoard(boardId: string, updates: any): void {
    this.socket?.emit("board:update", boardId, updates);
  }

  // Task operations
  public createTask(taskData: any): void {
    this.socket?.emit("task:create", taskData);
  }

  public updateTask(taskId: string, updates: any): void {
    this.socket?.emit("task:update", taskId, updates);
  }

  public deleteTask(taskId: string): void {
    this.socket?.emit("task:delete", taskId);
  }

  public moveTask(taskId: string, toColumnId: string, position: number): void {
    this.socket?.emit("task:move", taskId, toColumnId, position);
  }

  // Column operations
  public createColumn(columnData: any): void {
    this.socket?.emit("column:create", columnData);
  }

  public updateColumn(columnId: string, updates: any): void {
    this.socket?.emit("column:update", columnId, updates);
  }

  public deleteColumn(columnId: string): void {
    this.socket?.emit("column:delete", columnId);
  }

  // Chat operations
  public sendMessage(message: any): void {
    this.socket?.emit("chat:send", message);
  }

  public startTyping(): void {
    this.socket?.emit("chat:typing");
  }

  public stopTyping(): void {
    this.socket?.emit("chat:stop-typing");
  }

  // User presence
  public updateCursor(cursor: { x: number; y: number }): void {
    this.socket?.emit("user:cursor", cursor);
  }

  // Event subscription methods
  public on<K extends keyof ServerToClientEvents>(
    event: K,
    listener: ServerToClientEvents[K]
  ): void {
    if (!this.socket) return;

    this.socket.on(event, listener);

    // Store listener for cleanup
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  public off<K extends keyof ServerToClientEvents>(
    event: K,
    listener?: ServerToClientEvents[K]
  ): void {
    if (!this.socket) return;

    if (listener) {
      this.socket.off(event, listener);

      // Remove from stored listeners
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      this.socket.off(event);
      this.eventListeners.delete(event);
    }
  }

  public once<K extends keyof ServerToClientEvents>(
    event: K,
    listener: ServerToClientEvents[K]
  ): void {
    this.socket?.once(event, listener);
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);

      if (reason === "io server disconnect") {
        // Server disconnected, don't reconnect automatically
        return;
      }

      // Attempt to reconnect
      this.attemptReconnect();
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.attemptReconnect();
    });

    // Error handling
    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Notification handling
    this.socket.on("notification", (notification) => {
      console.log("Notification:", notification);
      // You can integrate with a toast notification system here
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
    );

    setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, delay);
  }

  public cleanup(): void {
    // Remove all event listeners
    this.eventListeners.forEach((listeners, event) => {
      listeners.forEach((listener) => {
        this.socket?.off(event, listener);
      });
    });

    this.eventListeners.clear();
    this.disconnect();
  }
}

// Create singleton instance
export const socketService = new SocketService();
