"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const handleSavedToPost = async (postId: string, statusToSaved: boolean) => {
  try {
    const userId = await getUserId();
    if (statusToSaved) {
      await prisma.saved.delete({
        where: {
          userId_postId: { userId: userId as string, postId },
        },
      });
    } else {
      await prisma.saved.create({
        data: {
          userId: userId as string,
          postId: postId,
        },
      });
    }
    return { success: true };
  } catch (error) {
    throw new Error("Saved to post process failed");
  }
};

export default handleSavedToPost;
