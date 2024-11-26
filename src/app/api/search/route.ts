import { getUserId } from "@/actions/util/getUserInfos";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchQuery = req.nextUrl.searchParams.get("q");

  if (!searchQuery) {
    return NextResponse.json({ message: "Text not found" }, { status: 500 });
  }

  if (searchQuery.length < 3) {
    return NextResponse.json(
      { message: "The text is not long enough" },
      { status: 500 }
    );
  }

  try {
    const userId = await getUserId();

    const userConversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },
      select: {
        users: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const conversationUserIds = userConversations.flatMap((conv) =>
      conv.users.map((u) => u.user.id)
    );
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: searchQuery, mode: "insensitive" } },
              { name: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
          {
            id: {
              notIn: conversationUserIds,
              not: userId,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "User search failed" },
      { status: 400 }
    );
  }
}
