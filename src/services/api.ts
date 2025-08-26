import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Board,
  Column,
  Task,
  CreateBoardRequest,
  UpdateBoardRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  ChatMessage,
  ApiResponse,
} from "@/types";

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public clearToken(): void {
    this.token = null;
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Request failed" }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth endpoints
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.error || "Login failed");
  }

  public async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.error || "Registration failed");
  }

  public async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await this.request<{ token: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.error || "Token refresh failed");
  }

  public async logout(): Promise<void> {
    await this.request("/auth/logout", {
      method: "POST",
    });
    this.clearToken();
  }

  // Board endpoints
  public async getBoards(): Promise<Board[]> {
    const response = await this.request<Board[]>("/boards");

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to fetch boards");
  }

  public async getBoard(boardId: string): Promise<Board> {
    const response = await this.request<Board>(`/boards/${boardId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to fetch board");
  }

  public async createBoard(data: CreateBoardRequest): Promise<Board> {
    const response = await this.request<Board>("/boards", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to create board");
  }

  public async updateBoard(
    boardId: string,
    data: UpdateBoardRequest
  ): Promise<Board> {
    const response = await this.request<Board>(`/boards/${boardId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to update board");
  }

  public async deleteBoard(boardId: string): Promise<void> {
    const response = await this.request(`/boards/${boardId}`, {
      method: "DELETE",
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to delete board");
    }
  }

  // Column endpoints
  public async getColumns(boardId: string): Promise<Column[]> {
    const response = await this.request<Column[]>(`/boards/${boardId}/columns`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to fetch columns");
  }

  public async createColumn(
    boardId: string,
    data: { title: string; position?: number }
  ): Promise<Column> {
    const response = await this.request<Column>(`/boards/${boardId}/columns`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to create column");
  }

  public async updateColumn(
    columnId: string,
    data: { title?: string; position?: number }
  ): Promise<Column> {
    const response = await this.request<Column>(`/columns/${columnId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to update column");
  }

  public async deleteColumn(columnId: string): Promise<void> {
    const response = await this.request(`/columns/${columnId}`, {
      method: "DELETE",
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to delete column");
    }
  }

  public async reorderColumns(
    boardId: string,
    columnIds: string[]
  ): Promise<void> {
    const response = await this.request(`/boards/${boardId}/columns/reorder`, {
      method: "PUT",
      body: JSON.stringify({ columnIds }),
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to reorder columns");
    }
  }

  // Task endpoints
  public async getTasks(columnId: string): Promise<Task[]> {
    const response = await this.request<Task[]>(`/columns/${columnId}/tasks`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to fetch tasks");
  }

  public async getBoardTasks(boardId: string): Promise<Task[]> {
    const response = await this.request<Task[]>(`/boards/${boardId}/tasks`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to fetch board tasks");
  }

  public async createTask(
    columnId: string,
    data: CreateTaskRequest
  ): Promise<Task> {
    const response = await this.request<Task>(`/columns/${columnId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to create task");
  }

  public async updateTask(
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<Task> {
    const response = await this.request<Task>(`/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to update task");
  }

  public async deleteTask(taskId: string): Promise<void> {
    const response = await this.request(`/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to delete task");
    }
  }

  public async moveTask(
    taskId: string,
    toColumnId: string,
    position: number
  ): Promise<Task> {
    const response = await this.request<Task>(`/tasks/${taskId}/move`, {
      method: "POST",
      body: JSON.stringify({ toColumnId, position }),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to move task");
  }

  // Chat endpoints
  public async getChatMessages(
    boardId: string,
    limit = 50,
    skip = 0
  ): Promise<ChatMessage[]> {
    const response = await this.request<ChatMessage[]>(
      `/boards/${boardId}/chat?limit=${limit}&skip=${skip}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || "Failed to fetch chat messages");
  }

  // Health check
  public async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseUrl.replace("/api", "")}/health`);
    return response.json();
  }
}

// Create singleton instance
export const apiService = new ApiService();
