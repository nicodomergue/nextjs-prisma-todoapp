import { Center, Container, Group, Stack, Title } from "@mantine/core";
import ToDoList from "../components/ToDoList";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import SignOutButton from "../components/SignOutButton";

async function HomePage() {
  const session = await getServerSession(authOptions);
  const username = session?.user.username;

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
          <ToDoList />
        </Stack>
      </Center>
    </Container>
  );
}

export default HomePage;
