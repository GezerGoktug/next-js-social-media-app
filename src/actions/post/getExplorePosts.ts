"use server";

import prisma from "@/lib/prisma";
import applyPostInteractions from "./applyPostInteractions";
import { queryType } from "@/types/types";



const getExplorePosts = async (query: queryType | null) => {

  if(!query) throw new Error("Query not found");

  try {
    let prismaQuery;
    if (query.type === "category") {
      prismaQuery = {
        category: {
          has: query.query,
        },
      };
    } else {
      prismaQuery = {
        content: {
          contains: query.type === "tag" ? `#${query.query}` : query.query,
          mode: "insensitive" as "insensitive" | "default",
        },
      };
    }
    const posts = await prisma.post.findMany({
      where: prismaQuery,
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
    });

    return await applyPostInteractions(posts);
  } catch (error) {
    throw new Error("Could not be get explore post to choose query ");
  }
};

export default getExplorePosts;
