"use server";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v7 as uuidv7 } from "uuid";
import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserId } from "../util/getUserInfos";
import handleNotify from "../notifications/handleNotify";

const createComment = async (formData: FormData) => {
  const mediaFile = formData.get("mediaFile");
  const mediaType = formData.get("mediaType");
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;
  const sendingUserId = formData.get("sendingUserId") as string;

  const userId = await getUserId();


  if (content.length > 250)
    throw new Error("You have exceeded the content character limit of 250");

  if (!(!(content.trim() === "") || mediaFile))
    throw new Error("You must provide either content or a media file");

  let media_url;

  let media = null;
  const commentId = uuidv7();
  try {
    if (mediaFile) {
      const file = mediaFile as File | null;
      if (file instanceof File) {
        const storageRef = ref(
          storage,
          `posts/${userId}/${postId}/comments/${commentId}`
        );
        await uploadBytes(storageRef, file);
        media_url = await getDownloadURL(storageRef);
      }
      media = {
        media: {
          create: {
            type: mediaType as "IMAGE" | "VIDEO",
            url: media_url as string,
          },
        },
      };
    }
  } catch (error) {
    throw new Error("Comment media could not be upload failed");
  }
  try {
    await prisma.comment.create({
      data: {
        content,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        ...media,
      },
    });
    revalidatePath("/");
    return await handleNotify(postId, sendingUserId, "CREATE", "COMMENT");
  } catch (error) {
    throw new Error("Comment could not be upload failed");
  }
};

export default createComment;
