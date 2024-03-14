import { Button, Group } from "@mantine/core";
import React from "react";

function ToDoCardButtonsSection({
  id,
  variant = "creating",
  isSubmitting,
  actions: {
    setIsEditing,
    setIsBeeingDeleted,
    setCurrentEditingToDo,
    handleSubmit,
    handleDelete,
  },
}: {
  id: string;
  variant: ToDoCardVariant;
  isSubmitting: boolean;
  actions: ToDoCardButtonSectionActions;
}) {
  const handleEditToDo: () => void = () => {
    if (variant !== "editing") {
      setIsEditing(true);
      setCurrentEditingToDo(id);
    } else {
      setIsEditing(false);
      setCurrentEditingToDo(null);
    }
  };

  if (variant === "creating")
    return (
      <Button
        color="blue"
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Create ToDo
      </Button>
    );

  if (variant === "viewing")
    return (
      <Group gap="md" grow>
        <Button variant="light" onClick={handleEditToDo}>
          Edit
        </Button>
        <Button
          variant="light"
          color="red"
          onClick={() => setIsBeeingDeleted(true)}
        >
          Delete
        </Button>
      </Group>
    );

  if (variant === "editing")
    return (
      <Group gap="md" grow>
        <Button color="gray" onClick={handleEditToDo} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Update ToDo
        </Button>
      </Group>
    );

  if (variant === "deleting")
    return (
      <Group gap="md" grow>
        <Button color="gray" onClick={() => setIsBeeingDeleted(false)}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={() => (handleDelete ? handleDelete(id) : "")}
        >
          Confirm delete
        </Button>
      </Group>
    );
}

export default ToDoCardButtonsSection;
