"use server";
import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { deleteObject, ref } from "firebase/storage";
import { getUserId } from "../util/getUserInfos";
const deletePost = async (postId: string) => {
  const userId = await getUserId();
  try {
    const isMedia = await prisma.media.findUnique({
      where: {
        postId: postId,
      },
    });
    if (isMedia) await deleteObject(ref(storage, `posts/${userId}/${postId}`));

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return { success: true };
  } catch (error) {
    throw new Error("Delete to post process failed");
  }
};

export default deletePost;
