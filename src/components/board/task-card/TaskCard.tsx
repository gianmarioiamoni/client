'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTaskCard } from '@/hooks/useTaskCard';
import type { TaskCardProps } from '@/types';
import { TaskCardHeader } from './TaskCardHeader';
import { TaskCardContent } from './TaskCardContent';

/**
 * TaskCard - Main component following Single Responsibility Principle
 * Responsibility: Orchestrating the task card UI and interactions
 */
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  isDragging = false
}) => {
  const {
    showActions,
    dragRef,
    dragAttributes,
    dragListeners,
    isDragging: isDraggingDnd,
    dragStyle,
    handleMouseEnter,
    handleMouseLeave
  } = useTaskCard(task);

  return (
    <Card
      ref={dragRef}
      style={dragStyle}
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        (isDragging || isDraggingDnd) && 'opacity-50 rotate-2 scale-105',
        'group relative'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...dragAttributes}
      {...dragListeners}
    >
      <TaskCardHeader
        task={task}
        showActions={showActions}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      
      <TaskCardContent task={task} />
    </Card>
  );
};
