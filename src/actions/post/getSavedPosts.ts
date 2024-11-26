"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";
import applyPostInteractions from "./applyPostInteractions";

const getMySavedPosts = async () => {
  const userId = await getUserId();
  try {
    const posts = await prisma.post.findMany({
      where: {
        saved: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
            image: true,
            biography: true,
            createdAt: true,
            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            reposts: true,
            comments: true,
            views: true,
          },
        },
        media: {
          select: {
            type: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const editedPosts = await applyPostInteractions(posts);
    return editedPosts;
  } catch (error) {
    throw new Error("Could not be get saved post");
  }
};

export default getMySavedPosts;
