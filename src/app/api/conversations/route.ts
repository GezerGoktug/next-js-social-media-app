import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { controlSession, getUserId } from "@/actions/util/getUserInfos";

export async function GET() {
  try {
    const userId = await getUserId();
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            content: true,
          },
        },
      },
    });
    const conversationsWithOtherUsers = conversations.map((conversation) => {
      const otherUsers = conversation.users.filter(
        ({ user }) => user.id !== userId
      );

      return {
        conversationId: conversation.id,
        otherUser: otherUsers.map((user) => ({
          id: user.user.id,
          fullname: user.user.name,
          image: user.user.image,
        })),
        lastMessage: conversation.messages[0]?.content || null,
      };
    });
    return NextResponse.json(conversationsWithOtherUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not retrieve users you chatted with" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await controlSession();
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 400 }
    );
  }

  const { id } = await req.json();
  try {
    await prisma.conversation.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Chat could not be deleted",
      },
      { status: 400 }
    );
  }
}