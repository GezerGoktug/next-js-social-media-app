"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const increaseView = async (postId: string) => {
  const userId = await getUserId();

  const existPostView = await prisma.view.findMany({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existPostView.length !== 0) return;

  try {
    await prisma.view.create({
      data: {
        postId: postId,
        userId: userId as string,
      },
    });
  } catch (error) {
    throw new Error("Could not be increase view");
  }
};

export default increaseView;
