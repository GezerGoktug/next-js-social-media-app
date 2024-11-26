"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/schemas/schema";
import { revalidatePath } from "next/cache";

type registerDataType = {
  email: string;
  password: string;
  fullname: string;
  confirmPassword: string;
};

const register = async (data: registerDataType) => {
  const validate = registerSchema.safeParse(data);
  if (!validate.success)
    throw new Error(validate.error.flatten().fieldErrors as string);

  const { email, password, fullname } = data;
  const exitingEmailUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exitingEmailUser) throw new Error("Email is already used");

  const users = await prisma.user.findMany({
    select: {
      password: true,
    },
  });

  const exitingPasswordUser = users.some((user) => {
    if (user.password) {
      return bcrypt.compareSync(password, user?.password);
    }
  });

  if (exitingPasswordUser) throw new Error("Password is already used");

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullname,
        image: process.env.NEXT_PUBLIC_DEFAULT_PROFILE_URL,
        backdrop_image: process.env.NEXT_PUBLIC_DEFAULT_BACKDROP_URL,
      },
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Register failed");
  }
};

export default register;
