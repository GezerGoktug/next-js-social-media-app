"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const handleNotify = async (
  postId: string,
  sendingUserId: string,
  opr: "CREATE" | "DELETE",
  type: "LIKE" | "COMMENT" | "FRIEND_REQUEST" | "REPOST"
) => {
  const userId = await getUserId();
  try {
    if (opr === "CREATE") {
      const notification = await prisma.notification.create({
        data: {
          userId: sendingUserId,
          postId: type !== "FRIEND_REQUEST" ? postId : null,
          type: type,
          senderId: userId,
        },
        select: {
          createdAt: true,
          read: true,
          type: true,
          id: true,
          postId: true,
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
        },
      });
      return { notification, opr: "CREATE" };
    } else {
      const notification = await prisma.notification.findMany({
        where: {
          userId: sendingUserId,
          postId: type !== "FRIEND_REQUEST" ? postId : null,
          senderId: userId,
        },
        select: {
          createdAt: true,
          read: true,
          type: true,
          id: true,
          postId: true,
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
        },
      });
      await prisma.notification.deleteMany({
        where: {
          userId: sendingUserId,
          postId: type !== "FRIEND_REQUEST" ? postId : null,
          senderId: userId,
        },
      });

      return { notification, opr: "DELETE" };
    }
  } catch (error) {
    throw new Error("Could not be create or delete notification");
  }
};

export default handleNotify;
