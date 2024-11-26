"use server";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { getUserId } from "../util/getUserInfos";
import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";

const updatePost = async (formData: FormData) => {
  const mediaFile = formData.get("mediaFile");
  const mediaType = formData.get("mediaType");
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  const userId = await getUserId();

  if (!userId) throw new Error("User not authenticated");

  if (content.length > 250)
    throw new Error("You have exceeded the content character limit of 250");

  if (!(!(content.trim() === "") || mediaFile))
    throw new Error("You must provide either content or a media file");

  let media_url;
  let media = null;
  const currentMedia = await prisma.media.findUnique({
    where: {
      postId: postId,
    },
  });
  if (currentMedia) {
    media = {
      media: {
        update: {
          type: currentMedia?.type,
          url: currentMedia?.url,
        },
      },
    };
  }

  try {
    if (mediaFile) {
      await deleteObject(ref(storage, `posts/${userId}/${postId}`));
      const file = mediaFile as File | null;
      if (file instanceof File) {
        const storageRef = ref(storage, `posts/${userId}/${postId}`);
        await uploadBytes(storageRef, file);
        media_url = await getDownloadURL(storageRef);
      }
      media = {
        media: {
          update: {
            type: mediaType as "IMAGE" | "VIDEO",
            url: media_url,
          },
        },
      };
    }
  } catch (error) {
    throw new Error("Post media could not be upload failed");
  }
  try {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        content,
        ...media,
      },
    });
    return { success: true };
  } catch (error) {
    throw new Error("Post could not be upload failed");
  }
};

export default updatePost;
