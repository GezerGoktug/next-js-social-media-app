"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";
import { PostType } from "@/types/types";

type CombinedPostType = Omit<PostType, "isLiked" | "isSaved" | "isReposted" | "isMyPost">;

const applyPostInteractions = async (posts: CombinedPostType[]) => {
  const userId = await getUserId();
  try {
    const likedPosts = await prisma.like.findMany({
      where: {
        userId: userId,
      },
    });
    const repostedPosts = await prisma.repost.findMany({
      where: {
        userId: userId,
      },
    });
    const savedPosts = await prisma.saved.findMany({
      where: {
        userId: userId,
      },
    });
    const editedPosts = posts.map((post) => {
      return {
        ...post,
        isMyPost: post.userId === userId,
        isLiked: likedPosts.some((like) => like.postId === post.id),
        isReposted: repostedPosts.some((repost) => repost.postId === post.id),
        isSaved: savedPosts.some((save) => save.postId === post.id),
      };
    });

    return editedPosts;
  } catch (error) {
    throw new Error("Could not be apply post interactions");
  }
};

export default applyPostInteractions;
