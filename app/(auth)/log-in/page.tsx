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
import GoogleIcon from "../GoogleIcon";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(5, "The password must be at least 5 characters long")
    .max(20, "The password cannot be mor than 20 characters long"),
});

function LogIn() {
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <Container py="lg" h="100vh">
      <Center h="100vh">
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
              {...form.getInputProps("email")}
            />
            <PasswordInput
              variant="filled"
              label="Password"
              placeholder="***********"
              required
              {...form.getInputProps("password")}
            />
            <Button mt="xs" fullWidth>
              Log In
            </Button>
            <Divider my="xs" label="or" labelPosition="center" />
            <Button
              leftSection={<GoogleIcon />}
              variant="default"
              children="Log in with Google"
            />
          </Stack>
          <Text ta="center" mb="sm">
            If you dont have an acount, you can
            <Anchor component={Link} href="/sign-in" ms={6}>
              Sign Up
            </Anchor>
          </Text>
        </Card>
      </Center>
    </Container>
  );
}

export default LogIn;
