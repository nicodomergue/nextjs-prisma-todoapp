"use client";

import { Stack } from "@mantine/core";
import React, { useEffect, useState } from "react";
import ToDoCard from "./ToDoCard";
import { v4 as uuid } from "uuid";

function ToDoList() {
  const [newToDoData, setNewToDoData] = useState<ToDo>({
    id: uuid(),
    title: "",
    description: "",
  });
  const [toDos, setToDos] = useState<ToDo[]>([
    {
      id: uuid(),
      title: "ToDo 1",
      description: "Descripción del primer ToDo",
    },
    {
      id: uuid(),
      title: "ToDo 2",
      description: "Descripción del segundo ToDo",
    },
    {
      id: uuid(),
      title: "ToDo 3",
      description: "Descripción del tercer ToDo",
    },
  ]);
  const [currentEditingToDo, setCurrentEditingToDo] = useState<null | string>(
    null
  );

  const handleSubmitToDo = (
    action: ToDoCardVariant,
    toDo: { id: undefined; title: string; description: string } | ToDo
  ) => {
    if (!toDo.id || action === "creating") {
      setToDos([
        ...toDos,
        {
          id: uuid(),
          title: toDo.title,
          description: toDo.description,
        },
      ]);
    } else {
      setToDos(toDos.map((item) => (item.id === toDo.id ? toDo : item)));
    }
  };

  return (
    <Stack>
      <ToDoCard
        key={newToDoData.id}
        isEditing={true}
        {...{ ...newToDoData, setCurrentEditingToDo, handleSubmitToDo }}
      />
      {toDos.map((toDo) => (
        <ToDoCard
          key={toDo.id}
          {...{
            ...toDo,
            currentEditingToDo,
            setCurrentEditingToDo,
            handleSubmitToDo,
          }}
        />
      ))}
    </Stack>
  );
}

export default ToDoList;
