"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const deleteUser = async () => {
  const userId = await getUserId();
  try {
    await prisma.conversation.deleteMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    throw new Error("Could not be delete your account");
  }
};

export default deleteUser;
