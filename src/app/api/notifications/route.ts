import { getUserId } from "@/actions/util/getUserInfos";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const extended = req.nextUrl.searchParams.get("extended");
  const isCount = req.nextUrl.searchParams.get("count");
  const userId = await getUserId();

  if (isCount) {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
    return NextResponse.json({ count: count }, { status: 200 });
  }
  const limit = extended ? 100 : 7;

  const readNotifications = await prisma.notification.findMany({
    where: {
      userId,
      read: true,
    },
    select: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      sender: {
        select: {
          name: true,
          image: true,
        },
      },
      createdAt: true,
      read: true,
      type: true,
      id: true,
      postId: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const unreadNotifications = await prisma.notification.findMany({
    where: {
      userId,
      read: false,
    },
    select: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      sender: {
        select: {
          name: true,
          image: true,
        },
      },
      createdAt: true,
      read: true,
      type: true,
      id: true,
      postId: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json([...unreadNotifications, ...readNotifications], {
    status: 200,
  });
}
