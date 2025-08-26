import { create } from "zustand";
import type { ChatState, ChatMessage, TypingIndicator } from "@/types";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  typingUsers: [],
  isLoading: false,
  error: null,

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    }));
  },

  setMessages: (messages: ChatMessage[]) => {
    set({
      messages: messages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    });
  },

  addTypingUser: (typing: TypingIndicator) => {
    set((state) => {
      // Remove existing typing indicator for this user (if any)
      const filteredTyping = state.typingUsers.filter(
        (t) => t.userId !== typing.userId
      );
      return {
        typingUsers: [...filteredTyping, typing],
      };
    });
  },

  removeTypingUser: (userId: string) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter((t) => t.userId !== userId),
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
