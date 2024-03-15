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
import React, { useState } from "react";
import GoogleIcon from "../../../components/GoogleIcon";
import Link from "next/link";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { signIn } from "next-auth/react";

const userFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(25, "Username cannot be longer than 25 characters"),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(5, "Password must be at least 5 characters long")
      .regex(/\d/, "Password must contain at least one number")
      .max(20, "Password cannot be more than 20 characters long"),
    confirmPassword: z
      .string()
      .min(5, "Password must be at least 5 characters long")
      .regex(/\d/, "Password must contain at least one number")
      .max(20, "Password cannot be more than 20 characters long"),
  })
  .refine(
    (values) => {
      const hasSpaceOrSpecialCharacters =
        /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/;
      return !hasSpaceOrSpecialCharacters.test(values.username);
    },
    {
      message: "Username cannot have spaces or special characters",
      path: ["username"],
    }
  )
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(userFormSchema),
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
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.values),
    });

    if (response.ok) {
      console.log(response);
      const signInData = await signIn("credentials", {
        ...form.values,
        // redirect: false,
        redirect: true,
        callbackUrl: `${window.location.origin}/`,
      });
      console.log(signInData);
    } else {
      notifications.show({
        withCloseButton: true,
        title: "Oops...",
        message: "There was an error while login in",
        color: "red",
        style: { backgroundColor: "#fef2f2" },
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Container py="lg" h="100vh">
      <Center h="100%">
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
              disabled={isSubmitting}
              {...form.getInputProps("username")}
            />
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
            <PasswordInput
              variant="filled"
              label="Confirm Password"
              placeholder="***********"
              required
              disabled={isSubmitting}
              {...form.getInputProps("confirmPassword")}
            />
            <Button
              mt="xs"
              fullWidth
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
            <Divider my="xs" label="or" labelPosition="center" />
            <Button
              leftSection={<GoogleIcon />}
              variant="default"
              children="Sign in with Google"
              disabled={isSubmitting}
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
