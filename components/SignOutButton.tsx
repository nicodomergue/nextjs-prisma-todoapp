"use client";

import { Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import React from "react";

function SignOutButton() {
  return (
    <Button
      variant="light"
      color="red"
      rightSection={<IconLogout stroke={1.4} size="1.1rem" />}
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/log-in`,
        })
      }
    >
      Sign out
    </Button>
  );
}

export default SignOutButton;
