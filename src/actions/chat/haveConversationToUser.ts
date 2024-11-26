"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const haveConversationToUser = async (id: string) => {
  const userId = await getUserId();
  const existingConv = await prisma.conversation.findMany({
    where: {
      AND: [
        {
          users: {
            some: {
              userId: userId,
            },
          },
        },
        {
          users: {
            some: {
              userId: id,
            },
          },
        },
      ],
    },
  });
  if (existingConv.length > 0)
    return { isFindConv: true, convId: existingConv[0].id };
  else return { isFindConv: false };
};

export default haveConversationToUser;
