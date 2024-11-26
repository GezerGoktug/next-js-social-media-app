"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const createNewConversation = async (personİd: string) => {
  if (!personİd) throw new Error("Person not found");

  const myId = await getUserId();

  try {
    const conversationPersons = [personİd, myId];
    const conversation = await prisma.conversation.create({
      data: {
        users: {
          create: conversationPersons.map((id) => ({
            user: {
              connect: { id: id },
            },
          })),
        },
      },
    });
    if (conversation) {
      return { success: true, convId: conversation.id };
    }
  } catch (error) {
    throw new Error("Chat could not be created");
  }
};

export default createNewConversation;
