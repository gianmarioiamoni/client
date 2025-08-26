import type { Task } from '@/types';

/**
 * Pure functions for task-related calculations and utilities
 */

export interface TaskDateStatus {
  isOverdue: boolean;
  isDueSoon: boolean;
  daysUntilDue?: number;
}

/**
 * Calculate task date status (overdue, due soon)
 */
export const getTaskDateStatus = (dueDate?: Date | string): TaskDateStatus => {
  if (!dueDate) {
    return { isOverdue: false, isDueSoon: false };
  }

  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isOverdue: diffTime < 0,
    isDueSoon: diffTime > 0 && diffTime < 24 * 60 * 60 * 1000, // Less than 24 hours
    daysUntilDue: Math.abs(daysUntilDue)
  };
};

/**
 * Get task status display text
 */
export const getTaskStatusText = (task: Task): string => {
  const { isOverdue, isDueSoon } = getTaskDateStatus(task.dueDate);
  
  if (isOverdue) return 'Overdue';
  if (isDueSoon) return 'Due Soon';
  return 'On Track';
};

/**
 * Get task priority display configuration
 */
export const getTaskPriorityConfig = (priority: Task['priority']) => {
  const configs = {
    low: { color: 'text-green-600 bg-green-100', label: 'Low' },
    medium: { color: 'text-yellow-600 bg-yellow-100', label: 'Medium' },
    high: { color: 'text-red-600 bg-red-100', label: 'High' }
  };
  
  return configs[priority] || configs.medium;
};

/**
 * Get date status styling classes
 */
export const getDateStatusClasses = (dueDate?: Date | string): string => {
  const { isOverdue, isDueSoon } = getTaskDateStatus(dueDate);
  
  if (isOverdue) return 'text-red-600';
  if (isDueSoon) return 'text-orange-600';
  return 'text-gray-600';
};
