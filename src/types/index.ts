// Re-export all shared types
export * from "../../../shared/types";

// Client-specific types
export interface SocketContextType {
  socket: any | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
  joinBoard: (boardId: string) => void;
  leaveBoard: (boardId: string) => void;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export interface BoardState {
  currentBoard: Board | null;
  boards: Board[];
  isLoading: boolean;
  error: string | null;
  setCurrentBoard: (board: Board | null) => void;
  setBoards: (boards: Board[]) => void;
  addBoard: (board: Board) => void;
  updateBoard: (board: Board) => void;
  deleteBoard: (boardId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface TaskState {
  tasks: Record<string, Task[]>; // columnId -> tasks
  isLoading: boolean;
  error: string | null;
  setTasks: (columnId: string, tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    position: number
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface ColumnState {
  columns: Column[];
  isLoading: boolean;
  error: string | null;
  setColumns: (columns: Column[]) => void;
  addColumn: (column: Column) => void;
  updateColumn: (column: Column) => void;
  deleteColumn: (columnId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface ChatState {
  messages: ChatMessage[];
  typingUsers: TypingIndicator[];
  isLoading: boolean;
  error: string | null;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addTypingUser: (typing: TypingIndicator) => void;
  removeTypingUser: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface UserPresenceState {
  onlineUsers: UserPresence[];
  userCursors: Record<string, UserPresence>;
  setOnlineUsers: (users: UserPresence[]) => void;
  addUser: (user: UserPresence) => void;
  removeUser: (userId: string) => void;
  updateUserCursor: (cursor: UserPresence) => void;
}

// UI Component Props
export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

export interface ColumnProps {
  column: Column;
  tasks: Task[];
  onTaskCreate: (columnId: string) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskMove: (taskId: string, toColumnId: string, position: number) => void;
}

export interface BoardHeaderProps {
  board: Board;
  onlineUsers: UserPresence[];
  onBoardUpdate: (updates: Partial<Board>) => void;
}

export interface ChatPanelProps {
  messages: ChatMessage[];
  typingUsers: TypingIndicator[];
  onSendMessage: (content: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
}

// Drag & Drop Types
export interface DraggedTask {
  id: string;
  columnId: string;
  position: number;
}

export interface DropResult {
  taskId: string;
  sourceColumnId: string;
  targetColumnId: string;
  position: number;
}

// Form Types
export interface TaskFormData {
  title: string;
  description?: string;
  assigneeId?: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

export interface BoardFormData {
  title: string;
  description?: string;
}

export interface ColumnFormData {
  title: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  duration?: number;
}

export interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Theme Types
export interface ThemeState {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

// Loading and Error States
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

// API Response wrapper for client
export interface ClientApiResponse<T = unknown> extends ApiResponse<T> {
  timestamp: number;
}
