"use server";
import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";
import { PostDetailType } from "@/types/types";

const getPostDetail = async (id: string): Promise<PostDetailType> => {
  const userId = await getUserId();
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
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
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            userId: true,
            user: {
              select: {
                username: true,
                name: true,
                image: true,
                createdAt: true,
                biography: true,
                _count: {
                  select: {
                    followers: true,
                    following: true,
                  },
                },
              },
            },
            media: {
              select: {
                type: true,
                url: true,
              },
            },
          },
        },
      },
    });
    const isLiked = await prisma.like.findFirst({
      where: {
        postId: post?.id,
        userId: userId,
      },
    });

    const isReposted = await prisma.repost.findFirst({
      where: {
        postId: post?.id,
        userId: userId,
      },
    });

    const isSaved = await prisma.saved.findFirst({
      where: {
        postId: post?.id,
        userId: userId,
      },
    });

    if (!post) throw new Error("Post not found");

    return {
      ...post,
      isMyPost : post.userId === userId,
      isLiked: !!isLiked,
      isReposted: !!isReposted,
      isSaved: !!isSaved,
    };
  } catch (error) {
    throw new Error("Could not be get post details");
  }
};

export default getPostDetail;
