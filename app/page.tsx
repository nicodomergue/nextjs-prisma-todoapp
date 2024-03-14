import { Center, Container } from "@mantine/core";
import ToDoForm from "../components/ToDoCard";
import ToDoList from "../components/ToDoList";

export default function HomePage() {
  return (
    <Container py="lg">
      <Center>
        <ToDoList />
      </Center>
    </Container>
  );
}
