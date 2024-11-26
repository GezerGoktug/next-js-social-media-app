import { getUserId } from "@/actions/util/getUserInfos";
import applyPostInteractions from "@/actions/post/applyPostInteractions";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let page = req.nextUrl.searchParams.get("page") as string;
  
  try {
    const userId = await getUserId();
    const followedUsersPosts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: userId,
            },
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
      take: 5,
      skip: (+page - 1) * 5,
    });

    const repostedPosts = await prisma.post.findMany({
      where: {
        reposts: {
          some: {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
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
        reposts: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
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
      take: 5,
      skip: (+page - 1) * 5,
    });

    const editedRepostedPosts = repostedPosts.map((post) => {
      const repostInfo = post.reposts.filter(
        (item) => item.userId !== userId
      )[0];

      return {
        ...post,
        repostedBy: {
          name: repostInfo?.user?.name || "Unknown",
          image: repostInfo?.user?.image || null,
        },
      };
    });

    const totalShowedPosts = 15;
    const randomPostsTake =
      totalShowedPosts -
      (followedUsersPosts.length + editedRepostedPosts.length);

    const randomPosts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            none: {
              followerId: userId,
            },
          },
          id: {
            not: userId,
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
      skip: (+page - 1) * randomPostsTake,
      take: randomPostsTake,
    });

    const combinedPosts = [
      ...followedUsersPosts,
      ...editedRepostedPosts,
      ...randomPosts,
    ];

    const editedPosts = await applyPostInteractions(combinedPosts);
    return NextResponse.json(editedPosts, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Could not get posts data",
      },
      {
        status: 400,
      }
    );
  }
}
