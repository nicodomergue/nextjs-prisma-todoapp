interface ToDo {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

type ToDoCardVariant = "creating" | "viewing" | "editing" | "deleting";

interface ToDoCardProps
  extends Omit<ToDo, "createdAt" | "updatedAt" | "userId"> {
  isEditing?: boolean;
  currentEditingToDo?: null | string;
  setCurrentEditingToDo: React.Dispatch<React.SetStateAction<string | null>>;
  handleSubmitToDo: (
    action: ToDoCardVariant,
    toDo: ToDo | { id: string; title: string; description: string }
  ) => void;
  handleDeleteToDo?: (id: string) => void;
}

interface ToDoCardButtonSectionActions {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTryingToDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentEditingToDo: React.Dispatch<React.SetStateAction<string | null>>;
  handleSubmit: (e: React.MouseEvent<HTMLElement>) => void;
  handleDelete?: (id: string) => void;
}
