import { cn } from '@/lib/utils';
import { getTaskPriorityConfig } from '@/lib/task-utils';
import type { Task } from '@/types';

interface TaskPriorityBadgeProps {
    priority: Task['priority'];
    className?: string;
}

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({
    priority,
    className
}) => {
    const config = getTaskPriorityConfig(priority);

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                config.color,
                className
            )}
        >
            {config.label}
        </span>
    );
};
