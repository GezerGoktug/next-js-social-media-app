"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";
import handleNotify from "../notifications/handleNotify";

const handleLikeToPost = async (
  postId: string,
  sendingUserId: string,
  statusToLike: boolean
) => {
  try {
    const userId = await getUserId();
    if (statusToLike) {
      await prisma.like.delete({
        where: {
          userId_postId: { userId: userId as string, postId },
        },
      });
      return await handleNotify(postId, sendingUserId, "DELETE", "LIKE");
    } else {
      await prisma.like.create({
        data: {
          userId: userId as string,
          postId: postId,
        },
      });
      return await handleNotify(postId, sendingUserId, "CREATE", "LIKE");
    }
  } catch (error) {
    throw new Error("Like to post process failed");
  }
};
export default handleLikeToPost;
