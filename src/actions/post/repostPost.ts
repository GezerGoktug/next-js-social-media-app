"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";
import handleNotify from "../notifications/handleNotify";

const handleRepostToPost = async (
  postId: string,
  sendingUserId: string,
  statusToRepost: boolean
) => {
  try {
    const userId = await getUserId();
    if (statusToRepost) {
      await prisma.repost.deleteMany({
        where: {
          userId: userId as string,
          postId: postId,
        },
      });
      return await handleNotify(postId, sendingUserId, "DELETE", "REPOST");
    } else {
      await prisma.repost.create({
        data: {
          userId: userId as string,
          postId: postId,
        },
      });
    }
    return await handleNotify(postId, sendingUserId, "CREATE", "REPOST");
  } catch (error) {
    throw new Error("Repost to post process failed");
  }
};
export default handleRepostToPost;
