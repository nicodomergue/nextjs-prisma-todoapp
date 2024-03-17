import { Center, Container, Group, Stack, Title } from "@mantine/core";
import ToDoList from "../components/ToDoList";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import SignOutButton from "../components/SignOutButton";
import { headers } from "next/headers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  useQueryClient,
} from "@tanstack/react-query";
// import { getUserToDos } from "../server/actions";

async function HomePage() {
  const session = await getServerSession(authOptions);
  const username = session?.user.username;

  // let userToDos: ToDo[] = await getUserToDos();
  const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ["todos"],
  //   queryFn: getUserToDos,
  // });

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
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ToDoList />
          </HydrationBoundary>
        </Stack>
      </Center>
    </Container>
  );
}

export default HomePage;
