"use server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { changePasswordSchema } from "@/schemas/schema";
import { getUserId } from "../util/getUserInfos";
import { revalidatePath } from "next/cache";

interface updatePasswordDataType {
  newPasswordConfirm: string;
  newPassword: string;
  currentPassword?: string;
  isHavePassword?: boolean;
}

const updatePassword = async (data: updatePasswordDataType) => {
  const userId = await getUserId();
  const validated = changePasswordSchema.safeParse(data);

  if (!validated.success) {
    throw new Error(validated.error.flatten().fieldErrors as string);
  }
  if (!data.isHavePassword && data.currentPassword) {
    const myUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const comparePassword = await bcrypt.compare(
      data.currentPassword,
      myUser?.password as string
    );
    if (!comparePassword) throw new Error("Wrong your password");
  }

  const users = await prisma.user.findMany({
    select: {
      password: true,
    },
  });

  const passwordExists = users.some((user) => {
    if (user.password) {
      return bcrypt.compareSync(data.newPassword, user?.password);
    }
  });

  if (passwordExists) {
    throw new Error("Password is already used");
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    throw new Error("Password reset failed");
  }
};

export default updatePassword;
