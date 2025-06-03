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

      const file = new Blob([mediaFile], {
        type: (mediaFile as any).type || "image/jpeg",
      });
      const storageRef = ref(storage, `posts/${userId}/${postId}`);
      await uploadBytes(storageRef, file);
      media_url = await getDownloadURL(storageRef);

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
  let categories: string[] = [];
  /**
   * !
   * ! Post categorization has been temporarily disabled on Hugging Face due to model request issues.
   * !
   */
  // try {
  //   const response = await fetch(process.env.HUGGING_FACE_API_URL as string, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`,
  //     },
  //     body: JSON.stringify({
  //       inputs: content,
  //       parameters: {
  //         candidate_labels: [
  //           "business",
  //           "technology",
  //           "sports",
  //           "news",
  //           "politics",
  //           "entertainment",
  //           "science",
  //           "other",
  //         ],
  //       },
  //     }),
  //   });
  //   const { labels, scores } = await response.json();

  //   const threshold = 0.25;

  //   const dominantCategories = labels.filter(
  //     (_: string, index: number) => scores[index] > scores[0] - threshold
  //   );
  //   categories = dominantCategories;
  // } catch (error) {
  //   throw new Error("Could not be determine of post category");
  // }
  try {
    await prisma.post.update({
      where: {
        id: postId,
        userId: userId,
      },
      data: {
        content,
        category: categories,
        ...media,
      },
    });
    return { success: true };
  } catch (error) {
    throw new Error("Post could not be update failed");
  }
};

export default updatePost;
