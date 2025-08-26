import { Calendar } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { getTaskDateStatus, getDateStatusClasses } from '@/lib/task-utils';

interface TaskDueDateProps {
  dueDate: Date | string;
  className?: string;
}

export const TaskDueDate: React.FC<TaskDueDateProps> = ({
  dueDate,
  className
}) => {
  const { isOverdue } = getTaskDateStatus(dueDate);
  const statusClasses = getDateStatusClasses(dueDate);

  return (
    <div className={cn(
      'flex items-center text-xs',
      statusClasses,
      className
    )}>
      <Calendar className="h-3 w-3 mr-1" />
      <span>{formatRelativeTime(dueDate)}</span>
      {isOverdue && (
        <span className="ml-1 font-medium">(Overdue)</span>
      )}
    </div>
  );
};
