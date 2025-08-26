import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Task } from '@/types';

interface TaskCardActionsProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

export const TaskCardActions: React.FC<TaskCardActionsProps> = ({
    task,
    onEdit,
    onDelete
}) => {
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(task);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(task.id);
    };

    return (
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleEdit}
            >
                <Edit className="h-3 w-3" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={handleDelete}
            >
                <Trash2 className="h-3 w-3" />
            </Button>
        </div>
    );
};
