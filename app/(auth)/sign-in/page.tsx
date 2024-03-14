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
import React from "react";
import GoogleIcon from "../GoogleIcon";
import Link from "next/link";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "The username must be at least 3 characters long")
      .max(25, "The username cannot be longer than 25 characters"),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(5, "The password must be at least 5 characters long")
      .regex(/\d/, "The password must contain at least one number")
      .max(20, "The password cannot be more than 20 characters long"),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    }
  );

function SignIn() {
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <Container py="lg" h="100vh">
      <Center h="100vh">
        <Card withBorder w="440px" px="xl" radius="lg" shadow="xs">
          <Title size="h3" py="sm" c="gray.8">
            Sign In:
          </Title>
          <Text c="gray.6">Create an account</Text>
          <Stack gap="md" py="md" mt="xs">
            <TextInput
              variant="filled"
              label="Username"
              placeholder="your-username"
              type="text"
              required
              {...form.getInputProps("username")}
            />
            <TextInput
              variant="filled"
              label="Email"
              placeholder="youremail@domain.com"
              type="email"
              required
              {...form.getInputProps("email")}
            />
            <PasswordInput
              variant="filled"
              label="Password"
              placeholder="***********"
              required
              {...form.getInputProps("password")}
            />
            <PasswordInput
              variant="filled"
              label="Confirm Password"
              placeholder="***********"
              required
              {...form.getInputProps("confirmPassword")}
            />
            <Button mt="xs" fullWidth>
              Sign In
            </Button>
            <Divider my="xs" label="or" labelPosition="center" />
            <Button
              leftSection={<GoogleIcon />}
              variant="default"
              children="Sign in with Google"
            />
          </Stack>
          <Text ta="center" mb="sm">
            Already have an account?
            <Anchor component={Link} href="/log-in" ms={5}>
              Log in
            </Anchor>
          </Text>
        </Card>
      </Center>
    </Container>
  );
}

export default SignIn;
