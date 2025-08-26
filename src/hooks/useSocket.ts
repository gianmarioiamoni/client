import { useEffect, useCallback } from "react";
import { socketService } from "@/services/socket";
import { useAuthStore } from "@/stores/auth";
import { useBoardStore } from "@/stores/board";
import { useTaskStore } from "@/stores/task";
import { useColumnStore } from "@/stores/column";
import { useChatStore } from "@/stores/chat";
import { usePresenceStore } from "@/stores/presence";
import { useNotificationStore } from "@/stores/notification";

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();
  const { currentBoard, updateBoard } = useBoardStore();
  const { addTask, updateTask, deleteTask, moveTask } = useTaskStore();
  const { addColumn, updateColumn, deleteColumn } = useColumnStore();
  const { addMessage, addTypingUser, removeTypingUser } = useChatStore();
  const { addUser, removeUser, updateUserCursor, setOnlineUsers } =
    usePresenceStore();
  const { addNotification } = useNotificationStore();

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.cleanup();
    };
  }, [isAuthenticated, token]);

  // Setup socket event listeners
  useEffect(() => {
    if (!socketService.isConnected()) return;

    // Board events
    socketService.on("board:updated", (board) => {
      updateBoard(board);
      addNotification({
        type: "info",
        title: "Board Updated",
        description: `Board "${board.title}" has been updated`,
      });
    });

    // Task events
    socketService.on("task:created", (task) => {
      addTask(task);
      addNotification({
        type: "success",
        title: "Task Created",
        description: `New task "${task.title}" has been created`,
      });
    });

    socketService.on("task:updated", (task) => {
      updateTask(task);
    });

    socketService.on("task:deleted", (taskId) => {
      deleteTask(taskId);
      addNotification({
        type: "info",
        title: "Task Deleted",
        description: "A task has been deleted",
      });
    });

    socketService.on(
      "task:moved",
      (taskId, fromColumnId, toColumnId, position) => {
        moveTask(taskId, fromColumnId, toColumnId, position);
      }
    );

    // Column events
    socketService.on("column:created", (column) => {
      addColumn(column);
      addNotification({
        type: "success",
        title: "Column Created",
        description: `New column "${column.title}" has been created`,
      });
    });

    socketService.on("column:updated", (column) => {
      updateColumn(column);
    });

    socketService.on("column:deleted", (columnId) => {
      deleteColumn(columnId);
      addNotification({
        type: "info",
        title: "Column Deleted",
        description: "A column has been deleted",
      });
    });

    // User presence events
    socketService.on("user:joined", (user) => {
      addUser(user);
      addNotification({
        type: "info",
        title: "User Joined",
        description: `${user.username} joined the board`,
      });
    });

    socketService.on("user:left", (userId) => {
      removeUser(userId);
    });

    socketService.on("user:cursor", (cursor) => {
      updateUserCursor(cursor);
    });

    socketService.on("users:online", (users) => {
      setOnlineUsers(users);
    });

    // Chat events
    socketService.on("chat:message", (message) => {
      addMessage(message);
    });

    socketService.on("chat:typing", (typing) => {
      addTypingUser(typing);
    });

    socketService.on("chat:stop-typing", (userId) => {
      removeTypingUser(userId);
    });

    // Error and notification events
    socketService.on("error", (error) => {
      addNotification({
        type: "error",
        title: "Error",
        description: error.message,
      });
    });

    socketService.on("notification", (notification) => {
      addNotification(notification);
    });

    // Cleanup function
    return () => {
      socketService.off("board:updated");
      socketService.off("task:created");
      socketService.off("task:updated");
      socketService.off("task:deleted");
      socketService.off("task:moved");
      socketService.off("column:created");
      socketService.off("column:updated");
      socketService.off("column:deleted");
      socketService.off("user:joined");
      socketService.off("user:left");
      socketService.off("user:cursor");
      socketService.off("users:online");
      socketService.off("chat:message");
      socketService.off("chat:typing");
      socketService.off("chat:stop-typing");
      socketService.off("error");
      socketService.off("notification");
    };
  }, [
    updateBoard,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
    addUser,
    removeUser,
    updateUserCursor,
    setOnlineUsers,
    addMessage,
    addTypingUser,
    removeTypingUser,
    addNotification,
  ]);

  // Socket operations
  const joinBoard = useCallback((boardId: string) => {
    socketService.joinBoard(boardId);
  }, []);

  const leaveBoard = useCallback((boardId: string) => {
    socketService.leaveBoard(boardId);
  }, []);

  const sendChatMessage = useCallback(
    (content: string) => {
      if (!currentBoard) return;

      socketService.sendMessage({
        boardId: currentBoard.id,
        content,
        type: "text",
      });
    },
    [currentBoard]
  );

  const startTyping = useCallback(() => {
    socketService.startTyping();
  }, []);

  const stopTyping = useCallback(() => {
    socketService.stopTyping();
  }, []);

  const updateCursor = useCallback((x: number, y: number) => {
    socketService.updateCursor({ x, y });
  }, []);

  const createTask = useCallback((taskData: any) => {
    socketService.createTask(taskData);
  }, []);

  const updateTaskSocket = useCallback((taskId: string, updates: any) => {
    socketService.updateTask(taskId, updates);
  }, []);

  const deleteTaskSocket = useCallback((taskId: string) => {
    socketService.deleteTask(taskId);
  }, []);

  const moveTaskSocket = useCallback(
    (taskId: string, toColumnId: string, position: number) => {
      socketService.moveTask(taskId, toColumnId, position);
    },
    []
  );

  return {
    isConnected: socketService.isConnected(),
    joinBoard,
    leaveBoard,
    sendChatMessage,
    startTyping,
    stopTyping,
    updateCursor,
    createTask,
    updateTask: updateTaskSocket,
    deleteTask: deleteTaskSocket,
    moveTask: moveTaskSocket,
  };
};
