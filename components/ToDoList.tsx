"use client";

import { Skeleton, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import ToDoCard from "./ToDoCard";
import { v4 as uuid } from "uuid";
import { useQuery } from "@tanstack/react-query";

function ToDoList() {
  const getUserToDos = async (): Promise<ToDo[]> => {
    const userToDosQuery = await fetch(`/api/todos`, {
      method: "GET",
    });

    if (userToDosQuery.ok) {
      const res = await userToDosQuery.json();
      console.log("Fetched ToDos");
      return res.userToDos;
    } else {
      return [];
    }
  };

  const { data, error, isFetched, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getUserToDos,
    refetchOnMount: true,
    staleTime: Infinity,
  });

  const [newToDoData, setNewToDoData] = useState({
    id: "",
    title: "",
    description: "",
  });

  const [toDos, setToDos] = useState<ToDo[]>([]);

  useEffect(() => {
    if (data) setToDos(data);
  }, [data]);

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
        const currentData = toDos.filter((item) => item.id === toDo.id)[0];
        const editedValues: { title?: string; description?: string } = {};
        Object.entries(toDo).forEach(
          ([key, value]: [key: string, value: any]) => {
            if (key !== "title" && key !== "description") return;
            if (toDo[key] === currentData[key]) return;
            editedValues[key] = value;
          }
        );

        const response = await fetch(`/api/todos`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toDoId: currentData.id,
            editedValues,
          }),
        });

        if (!response.ok) throw (await response.json()).message;
        const result = await response.json();
        console.log(result);

        const editedToDo = result.updatedToDo;
        setToDos(
          toDos.map((item) => (item.id === editedToDo.id ? editedToDo : item))
        );
      }
    } catch (err) {
      console.log("THERE WAS AN ERROR");
      console.log(err);
    }
  };

  const handleDeleteToDo = async (id: string) => {
    // DELETE TO DO
    const response = await fetch(`/api/todos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toDoId: id,
      }),
    });

    if (!response.ok) throw (await response.json()).message;
    setToDos(toDos.filter((item) => item.id !== id));
  };

  return (
    <Stack>
      <ToDoCard
        key={"newToDoCard"}
        isEditing={true}
        {...{ ...newToDoData, setCurrentEditingToDo, handleSubmitToDo }}
      />
      {isLoading ? (
        <>
          <Skeleton height={181.97} mt={6} radius="md">
            <Skeleton height={10} circle mt={6} />
          </Skeleton>
          <Skeleton height={181.97} mt={6} radius="md" />
        </>
      ) : toDos.length === 0 ? (
        <Text ta="center" mt="md" c="gray.5">
          There are no ToDo's on the list
        </Text>
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
