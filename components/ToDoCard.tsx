"use client";

import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";
import ToDoCardButtonsSection from "./ToDoCardButtonsSection";

const notification = {
  error: ({ message, callback }: { message: string; callback: () => void }) => {
    return notifications.show({
      id: `notification-${uuid()}`,
      withCloseButton: true,
      onOpen: () => callback(),
      autoClose: 5000,
      title: "There was an error",
      message,
      color: "red",
    });
  },
};

export default function ToDoCard(props: ToDoCardProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(!!props.isEditing);
  const [isBeeingDeleted, setIsBeeingDeleted] = useState(false);
  const [toDoData, setToDoData] = useState({
    id: props.id,
    title: props.title,
    description: props.description,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defineVariant = (): ToDoCardVariant => {
    if (!props.title && isEditing) return "creating";
    if (isBeeingDeleted) return "deleting";
    if (isEditing) return "editing";
    return "viewing";
  };

  const [variant, setVariant] = useState<ToDoCardVariant>(defineVariant());
  useEffect(() => {
    if (isEditing) titleRef.current?.focus();
    const newVariant = defineVariant();
    if (newVariant !== variant) setVariant(defineVariant());
  }, [isEditing, isBeeingDeleted]);

  useEffect(() => {
    if (
      isEditing &&
      props.currentEditingToDo &&
      props.title &&
      props.currentEditingToDo !== props.id
    )
      setIsEditing(false);
  }, [props.currentEditingToDo]);

  const handleFormReset = () => {
    if (variant === "creating") {
      setToDoData({
        id: props.id,
        title: "",
        description: "",
      });
    } else {
      setIsEditing(false);
    }

    setIsSubmitting(false);
    titleRef.current?.focus();
  };

  const handleSubmit: ToDoCardButtonSectionActions["handleSubmit"] = (e) => {
    setIsSubmitting(true);
    console.log(`Submitting: ${variant}`);
    if (!toDoData.title) {
      notification.error({
        message: `The ToDo you are ${variant} must have a title`,
        callback: handleFormReset,
      });
      return;
    }

    if (!toDoData.description) {
      notification.error({
        message: `The ToDo you are ${variant} must have a description`,
        callback: handleFormReset,
      });
      return;
    }

    if (
      props.title &&
      props.description &&
      props.title === toDoData.title &&
      props.description === toDoData.description
    ) {
      notification.error({
        message: `There is nothing to update`,
        callback: handleFormReset,
      });
    }

    props.handleSubmitToDo(variant, toDoData);
    handleFormReset();
    // setIsSubmitting(false);
  };

  const actions = {
    setIsEditing,
    setIsBeeingDeleted,
    setCurrentEditingToDo: props.setCurrentEditingToDo,
    handleSubmit,
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ width: "520px" }}
    >
      <Stack gap="md">
        {!props.title && isEditing ? (
          <Group justify="space-between">
            <Title children="New ToDo" size="md" />
            <Button
              variant="light"
              color="red"
              size="sm"
              onClick={handleSubmit}
              disabled={
                isSubmitting || (!toDoData.title && !toDoData.description)
                  ? true
                  : false
              }
            >
              Clear form
            </Button>
          </Group>
        ) : (
          ""
        )}
        {isEditing ? (
          <>
            <TextInput
              name="title"
              placeholder="ToDo Title"
              value={toDoData.title}
              onChange={({ target: { name, value } }) => {
                setToDoData({ ...toDoData, [name]: value });
              }}
              ref={titleRef}
              disabled={isSubmitting}
            />
            <Textarea
              placeholder="ToDo Description"
              name="description"
              value={toDoData.description}
              onChange={({ target: { name, value } }) => {
                setToDoData({ ...toDoData, [name]: value });
              }}
              rows={1}
              disabled={isSubmitting}
            />
          </>
        ) : (
          <>
            <Text children={props?.title} py="5.6px" />
            <Text children={props?.description} py="5.6px" />
          </>
        )}
        <ToDoCardButtonsSection
          variant={variant}
          actions={actions}
          id={props.id}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </Card>
  );
}
