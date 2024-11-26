"use server";

import applyPostInteractions from "./applyPostInteractions";

import prisma from "@/lib/prisma";

const getProfilePosts = async (post_type: string, username: string) => {
  let filtreQueryToPosts;

  switch (post_type) {
    case "base":
      filtreQueryToPosts = {
        user: {
          username: username,
        },
      };
      break;
    case "liked":
      filtreQueryToPosts = {
        likes: {
          some: {
            user: {
              username: username,
            },
          },
        },
      };
      break;
    case "reposteds":
      filtreQueryToPosts = {
        reposts: {
          some: {
            user: {
              username: username,
            },
          },
        },
      };
      break;
    case "commented":
      filtreQueryToPosts = {
        comments: {
          some: {
            user: {
              username: username,
            },
          },
        },
      };
    default:
      break;
  }
  try {
    const posts = await prisma.post.findMany({
      where: filtreQueryToPosts,
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
    throw new Error("Could not be get profile posts");
  }
};

export default getProfilePosts;
