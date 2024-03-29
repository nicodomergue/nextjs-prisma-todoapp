"use client";

import {
  Anchor,
  Button,
  Card,
  Center,
  Container,
  Divider,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import GoogleIcon from "../../../components/GoogleIcon";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters long")
    .regex(/\d/, "Password must contain at least one number")
    .max(20, "Password cannot be more than 20 characters long"),
});

function LogIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    const { hasErrors } = form.validate();
    if (hasErrors) {
      setIsSubmitting(false);
      return notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: "Invalid user information",
        message:
          "Check that all the form fields validate the required conditions",
        color: "red",
        style: { backgroundColor: "#fef2f2" },
      });
    } else {
      onSubmit();
    }
  };

  const onSubmit = async () => {
    const signInData = await signIn("credentials", {
      ...form.values,
      redirect: false,
    });

    if (signInData?.error) {
      setIsSubmitting(false);
      return notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: "Failed to log in",
        message: "Check if your user credentials are okay",
        color: "red",
        style: { backgroundColor: "#fef2f2" },
      });
    } else {
      router.push("/");
    }
  };

  return (
    <Container py="lg" h="100vh">
      <Center h="100%">
        <Card withBorder w="440px" px="xl" radius="lg" shadow="xs">
          <Title size="h3" py="sm" c="gray.8">
            Log In:
          </Title>
          <Text c="gray.6">Please enter your user information</Text>
          <Stack gap="md" py="md" mt="xs">
            <TextInput
              variant="filled"
              label="Email"
              placeholder="youremail@domain.com"
              type="email"
              required
              disabled={isSubmitting}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              variant="filled"
              label="Password"
              placeholder="***********"
              required
              disabled={isSubmitting}
              {...form.getInputProps("password")}
            />
            <Button
              mt="xs"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              Log In
            </Button>
          </Stack>
          <Text ta="center" mb="lg">
            If you dont have an acount, you can
            <Anchor component={Link} href="/sign-in" ms={6}>
              Sign In
            </Anchor>
          </Text>
        </Card>
      </Center>
    </Container>
  );
}

export default LogIn;
