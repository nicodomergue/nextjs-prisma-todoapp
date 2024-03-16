"use client";

import { Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import ToDoCard from "./ToDoCard";
import { v4 as uuid } from "uuid";

function ToDoList({ userToDos }: { userToDos: ToDo[] }) {
  const [newToDoData, setNewToDoData] = useState({
    id: "",
    title: "",
    description: "",
  });

  const [toDos, setToDos] = useState<ToDo[]>(userToDos);
  const [currentEditingToDo, setCurrentEditingToDo] = useState<null | string>(
    null
  );

  const handleSubmitToDo = async (
    action: ToDoCardVariant,
    toDo:
      | ToDo
      | {
          id: string;
          title: string;
          description: string;
        }
  ) => {
    try {
      if (!toDo.id || action === "creating") {
        // CREATE TO DO
        const response = await fetch(`/api/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: toDo.title,
            description: toDo.description,
          }),
        });

        if (!response.ok) throw (await response.json()).message;
        const result = await response.json();
        const newToDo: ToDo = result.newToDo;
        setToDos([...toDos, newToDo]);
      } else {
        // UPDATE TO DO
        // setToDos(toDos.map((item) => (item.id === toDo.id ? toDo : item)));
      }
    } catch (err) {
      console.log("THERE WAS AN ERROR");
      console.log(err);
    }
  };

  const handleDeleteToDo = (id: string) => {
    // DELETE TO DO
    setToDos(toDos.filter((item) => item.id !== id));
  };

  return (
    <Stack>
      <ToDoCard
        key={"newToDoCard"}
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
