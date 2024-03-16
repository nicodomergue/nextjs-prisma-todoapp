import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { JWT, getToken } from "next-auth/jwt";

const requireSession = (token: JWT | null) => {
  if (!token || !token.sub) throw "Unauthenticated user";
};

export async function POST(req: NextRequest, res: Response) {
  try {
    const body = await req.json();

    const token = await getToken({ req });
    if (!token || !token.sub)
      return NextResponse.json(
        {
          message:
            "User session not found. Try logging out and logging back in.",
        },
        { status: 401 }
      );

    const newToDo = await db.toDo.create({
      data: {
        id: uuid(),
        title: body.title,
        description: body.description,
        userId: token.sub,
      },
    });

    return NextResponse.json(
      {
        message: "Post request sent",
        newToDo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Oops... There was an error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, res: Response) {
  console.log("READING TODOs FROM DB");
  try {
    const token = await getToken({ req });

    if (!token)
      return NextResponse.json(
        {
          message:
            "User session not found. Try logging out and logging back in.",
        },
        { status: 401 }
      );

    const userId = token.sub;
    const userToDos: ToDo[] = await db.toDo.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(
      { message: "ToDos queried from the database", userToDos: userToDos },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Oops... There was an error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, res: Response) {
  try {
    const body = await req.json();
    const token = await getToken({ req });
    if (!token || !token.sub)
      return NextResponse.json(
        {
          message:
            "User session not found. Try logging out and logging back in.",
        },
        { status: 401 }
      );

    const { userId, ...updatedToDo } = await db.toDo.update({
      where: {
        id: body.toDoId,
        userId: token.sub,
      },
      data: body.editedValues,
    });

    return NextResponse.json(
      {
        message: "ToDo updated successfully",
        updatedToDo,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Oops... There was an error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, res: Response) {
  try {
    const body = await req.json();
    const token = await getToken({ req });
    if (!token || !token.sub)
      return NextResponse.json(
        {
          message:
            "User session not found. Try logging out and logging back in.",
        },
        { status: 401 }
      );

    await db.toDo.delete({
      where: {
        id: body.toDoId,
        userId: token.sub,
      },
    });

    return NextResponse.json(
      {
        message: "ToDo deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Oops... There was an error",
      },
      { status: 500 }
    );
  }
}
