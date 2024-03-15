import { Center, Container, Stack, Title } from "@mantine/core";
import ToDoList from "../components/ToDoList";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

async function HomePage() {
  const session = await getServerSession(authOptions);
  console.log(session);
  const username = session?.user.username;

  return (
    <Container py="lg">
      <Center style={{ maxHeight: "100%" }}>
        <Stack>
          <Title size="1.6rem" ta="center" c="gray.5">
            {username}'s ToDos
          </Title>
          <ToDoList />
        </Stack>
      </Center>
    </Container>
  );
}

export default HomePage;
