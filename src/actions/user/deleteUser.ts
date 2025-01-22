"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";
import deleteFolder from "@/lib/deleteFolder";

const deleteUser = async () => {
  const userId = await getUserId();
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });

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
    await deleteFolder(`users/${userId}`);
    await deleteFolder(`posts/${userId}`);

    const conversationDeletePromises = conversations.map(({ id }) =>
      deleteFolder(`conversation/${id}`)
    );
    await Promise.all(conversationDeletePromises);
  } catch (error) {
    throw new Error("Could not be delete your account");
  }
};

export default deleteUser;
