interface ToDo {
  id: string;
  title: string;
  description: string;
}

type ToDoCardVariant = "creating" | "viewing" | "editing" | "deleting";

interface ToDoCardProps extends ToDo {
  isEditing?: boolean;
  currentEditingToDo?: null | string;
  setCurrentEditingToDo: React.Dispatch<React.SetStateAction<string | null>>;
  handleSubmitToDo: (
    action: ToDoCardVariant,
    toDo: ToDo | { id: undefined; title: string; description: string }
  ) => void;
}

interface ToDoCardButtonSectionActions {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBeeingDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentEditingToDo: React.Dispatch<React.SetStateAction<string | null>>;
  handleSubmit: (e: React.MouseEvent<HTMLElement>) => void;
}
