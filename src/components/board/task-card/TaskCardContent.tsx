import { CardContent } from '@/components/ui/card';
import type { Task } from '@/types';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskAssignee } from './TaskAssignee';
import { TaskDueDate } from './TaskDueDate';
import { TaskCreationInfo } from './TaskCreationInfo';

interface TaskCardContentProps {
  task: Task;
}

export const TaskCardContent: React.FC<TaskCardContentProps> = ({ task }) => {
  return (
    <CardContent className="pt-0 space-y-2">
      {/* Priority and Assignee Row */}
      <div className="flex items-center justify-between">
        <TaskPriorityBadge priority={task.priority} />
        {task.assigneeId && <TaskAssignee assigneeId={task.assigneeId} />}
      </div>

      {/* Due Date */}
      {task.dueDate && <TaskDueDate dueDate={task.dueDate} />}

      {/* Creation Info */}
      <TaskCreationInfo createdAt={task.createdAt} />
    </CardContent>
  );
};
