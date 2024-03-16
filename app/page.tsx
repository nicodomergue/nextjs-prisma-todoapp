import { Center, Container, Group, Stack, Title } from "@mantine/core";
import ToDoList from "../components/ToDoList";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import SignOutButton from "../components/SignOutButton";
import { headers } from "next/headers";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

const getUserToDos = async () => {
  const userToDosQuery = await fetch(`${process.env.NEXTAUTH_URL}/api/todos`, {
    method: "GET",
    headers: headers(),
  });

  if (userToDosQuery.ok) {
    const res = await userToDosQuery.json();
    return res.userToDos;
  } else {
    return [];
  }
};

async function HomePage() {
  const session = await getServerSession(authOptions);
  const username = session?.user.username;

  let userToDos: ToDo[] = await getUserToDos();

  return (
    <Container py="lg">
      <Center style={{ maxHeight: "100%" }}>
        <Stack>
          <Group justify="space-between">
            <Title size="1.6rem" ta="center" c="gray.5">
              {username}'s ToDos
            </Title>
            {session?.user ? <SignOutButton /> : ""}
          </Group>
          <ToDoList userToDos={userToDos} />
        </Stack>
      </Center>
    </Container>
  );
}

export default HomePage;
