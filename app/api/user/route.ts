import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { hash } from "bcrypt";
import { z } from "zod";

// Define a schema for user form input validation
const userSchema = z
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

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { user: null, message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, username, password, confirmPassword } = validation.data;

    const existingUserWithEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUserWithEmail) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const existingUserWithUsername = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUserWithUsername) {
      return NextResponse.json(
        { user: null, message: "User with this username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...newUserDataWithoutPassword } =
      newUser;

    return NextResponse.json(
      {
        user: newUserDataWithoutPassword,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
