"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";
import { revalidatePath } from "next/cache";

const clearSavedPosts = async () => {
  const userId = await getUserId();
  try {
    await prisma.post.deleteMany({
      where: {
        saved: {
          some: {
            userId: userId,
          },
        },
      },
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Could not be clear saved posts");
  }
};

export default clearSavedPosts;
