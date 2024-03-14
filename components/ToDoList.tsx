"use client";

import { Stack, Text } from "@mantine/core";
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
      // CREATE TO DO
      setToDos([
        ...toDos,
        {
          id: uuid(),
          title: toDo.title,
          description: toDo.description,
        },
      ]);
    } else {
      // UPDATE TO DO
      setToDos(toDos.map((item) => (item.id === toDo.id ? toDo : item)));
    }
  };

  const handleDeleteToDo = (id: string) => {
    // DELETE TO DO
    setToDos(toDos.filter((item) => item.id !== id));
  };

  return (
    <Stack>
      <ToDoCard
        key={newToDoData.id}
        isEditing={true}
        {...{ ...newToDoData, setCurrentEditingToDo, handleSubmitToDo }}
      />
      {toDos.length === 0 ? (
        <>
          <Text ta="center" mt="md" c="gray.5">
            There are no ToDo's on the list
          </Text>
        </>
      ) : (
        toDos.map((toDo) => (
          <ToDoCard
            key={toDo.id}
            {...{
              ...toDo,
              currentEditingToDo,
              setCurrentEditingToDo,
              handleSubmitToDo,
              handleDeleteToDo,
            }}
          />
        ))
      )}
    </Stack>
  );
}

export default ToDoList;
