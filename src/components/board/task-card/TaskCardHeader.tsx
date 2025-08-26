import { CardHeader } from '@/components/ui/card';
import type { Task } from '@/types';
import { TaskCardActions } from './TaskCardActions';

interface TaskCardHeaderProps {
  task: Task;
  showActions: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  task,
  showActions,
  onEdit,
  onDelete
}) => {
  return (
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <h4 className="font-medium leading-tight text-sm line-clamp-2">
          {task.title}
        </h4>

        {showActions && (
          <TaskCardActions
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {task.description}
        </p>
      )}
    </CardHeader>
  );
};
