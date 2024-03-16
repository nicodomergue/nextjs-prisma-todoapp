import { Center, Container, Group, Stack, Title } from "@mantine/core";
import ToDoList from "../components/ToDoList";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import SignOutButton from "../components/SignOutButton";
import { headers } from "next/headers";

async function HomePage() {
  const session = await getServerSession(authOptions);
  const username = session?.user.username;

  const userToDosQuery = await fetch(`${process.env.NEXTAUTH_URL}/api/todos`, {
    method: "GET",
    headers: headers(),
  });

  let userToDos: ToDo[] = [];

  if (!userToDosQuery.ok) {
    console.log(userToDosQuery);
    return;
  } else {
    const res = await userToDosQuery.json();
    userToDos = res.userToDos;
  }

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
