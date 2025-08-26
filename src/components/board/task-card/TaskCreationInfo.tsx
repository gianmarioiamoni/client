import { User } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface TaskCreationInfoProps {
  createdAt: Date | string;
  className?: string;
}

export const TaskCreationInfo: React.FC<TaskCreationInfoProps> = ({
  createdAt,
  className
}) => {
  return (
    <div className={className || "flex items-center text-xs text-muted-foreground"}>
      <User className="h-3 w-3 mr-1" />
      <span>Created {formatRelativeTime(createdAt)}</span>
    </div>
  );
};
