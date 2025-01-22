import { getUserId } from "@/actions/util/getUserInfos";
import { UnauthorizedError } from "@/error/UnauthorizedError";
import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import { v7 as uuidv7 } from "uuid";

export async function POST(req: Request) {
  const formData = await req.formData();
  const mediaFile = formData.get("mediaFile");
  const mediaType = formData.get("mediaType");
  const conversationId = formData.get("conversationId");
  const content = formData.get("content") as string;

  let userId;

  try {
    userId = await getUserId();
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  if (content.length > 250) {
    return NextResponse.json(
      { message: "You have exceeded the content character limit of 250" },
      { status: 400 }
    );
  }
  if (!(!(content.trim() === "") || mediaFile)) {
    return NextResponse.json(
      { message: "You must provide either content or a media file" },
      { status: 400 }
    );
  }

  let media_url;
  let media = null;
  if (mediaFile) {
    try {
      if (mediaFile) {
        const file = new Blob([mediaFile], {
          type: (mediaFile as any).type || "image/jpeg",
        });
        const storageRef = ref(
          storage,
          `conversation/${conversationId}/${userId}/${uuidv7()}`
        );
        await uploadBytes(storageRef, file);
        media_url = await getDownloadURL(storageRef);
      }
      media = {
        media: {
          create: {
            url: media_url as string,
            type: mediaType as "IMAGE" | "VIDEO",
          },
        },
      };
    } catch (error) {
      return NextResponse.json(
        { message: "Message media could not be upload" },
        { status: 500 }
      );
    }
  }
  try {
    const newMessage = await prisma.message.create({
      data: {
        content: content as string,
        conversationId: conversationId as string,
        userId: userId as string,
        ...media,
      },
      select: {
        userId: true,
        content: true,
        createdAt: true,
        id: true,
        media: {
          select: {
            url: true,
            type: true,
            id: true,
          },
        },
      },
    });
    return NextResponse.json(newMessage, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Message could not be sent" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const conversationId = req.nextUrl.searchParams.get("conversationId");

  try {
    const userId = await getUserId();

    if (!conversationId)
      return NextResponse.json(
        { message: "Not founded conversation" },
        { status: 400 }
      );

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      select: {
        userId: true,
        content: true,
        createdAt: true,
        id: true,
        media: {
          select: {
            url: true,
            type: true,
            id: true,
          },
        },
      },
    });
    const editedMessages = messages.map((msg) => ({
      ...msg,
      isMyMessage: msg.userId === userId,
    }));
    return NextResponse.json(editedMessages, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Messages could not be received" },
      { status: 500 }
    );
  }
}
