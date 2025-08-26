import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface TaskAssigneeProps {
  assigneeId: string;
  className?: string;
}

export const TaskAssignee: React.FC<TaskAssigneeProps> = ({
  assigneeId,
  className
}) => {
  return (
    <Avatar className={className || "h-6 w-6"}>
      <AvatarFallback className="text-xs">
        {getInitials(assigneeId)}
      </AvatarFallback>
    </Avatar>
  );
};
