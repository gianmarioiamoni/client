import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "@/types";

/**
 * Custom hook for TaskCard state and drag-and-drop functionality
 */
export const useTaskCard = (task: Task) => {
  const [showActions, setShowActions] = useState(false);

  const dragAndDrop = useDraggable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: dragAndDrop.transform
      ? `translate3d(${dragAndDrop.transform.x}px, ${dragAndDrop.transform.y}px, 0)`
      : undefined,
  };

  const handleMouseEnter = () => setShowActions(true);
  const handleMouseLeave = () => setShowActions(false);

  return {
    // State
    showActions,

    // Drag & Drop
    dragRef: dragAndDrop.setNodeRef,
    dragAttributes: dragAndDrop.attributes,
    dragListeners: dragAndDrop.listeners,
    isDragging: dragAndDrop.isDragging,
    dragStyle: style,

    // Event handlers
    handleMouseEnter,
    handleMouseLeave,
  };
};
