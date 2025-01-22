import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { passwordSchema } from "@/schemas/schema";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiresAt: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const validated = passwordSchema.safeParse({ password });

  if (!validated.success) {
    return NextResponse.json({ message: "Invalid password" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const exitingPasswordUser = await prisma.user.findUnique({
    where: {
      password: hashedPassword,
    },
  });

  if (exitingPasswordUser)
    return NextResponse.json(
      { message: "Password is already used" },
      { status: 400 }
    );

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
    return NextResponse.json(
      { message: "Password has been reset" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Password reset failed" },
      { status: 500 }
    );
  }
}
