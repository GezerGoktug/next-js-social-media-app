"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";
import { PostType } from "@/types/types";

type CombinedPostType = Omit<
  PostType,
  "isLiked" | "isSaved" | "isReposted" | "isMyPost"
>;

const applyPostInteractions = async (posts: CombinedPostType[]) => {
  const userId = await getUserId();
  try {
    const postIds = posts.map((p) => p.id);

    const [likedPosts, repostedPosts, savedPosts] = await Promise.all([
      prisma.like.findMany({
        where: {
          userId,
          postId: { in: postIds },
        },
        select: { postId: true },
      }),
      prisma.repost.findMany({
        where: {
          userId,
          postId: { in: postIds },
        },
        select: { postId: true },
      }),
      prisma.saved.findMany({
        where: {
          userId,
          postId: { in: postIds },
        },
        select: { postId: true },
      }),
    ]);    

    const likedSet = new Set(likedPosts.map((l) => l.postId));
    const repostedSet = new Set(repostedPosts.map((r) => r.postId));
    const savedSet = new Set(savedPosts.map((s) => s.postId));

    const editedPosts = posts.map((post) => ({
      ...post,
      isMyPost: post.userId === userId,
      isLiked: likedSet.has(post.id),
      isReposted: repostedSet.has(post.id),
      isSaved: savedSet.has(post.id),
    }));

    return editedPosts;
  } catch (error) {
    throw new Error("Could not apply post interactions");
  }
};

export default applyPostInteractions;
