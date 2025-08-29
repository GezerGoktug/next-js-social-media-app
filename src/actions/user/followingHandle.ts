"use server";

import { getUserId } from "../util/getUserInfos";
import prisma from "@/lib/prisma";
import handleNotify from "../notifications/handleNotify";

export const followReqHandle = async (id: string, statusReq: boolean) => {
  const userId = await getUserId();
  if (id === userId) return;
  try {
    if (statusReq) {
      await prisma.friendRequest.deleteMany({
        where: {
          senderId: userId,
          receiverId: id,
        },
      });
      return await handleNotify("", id, "DELETE", "FRIEND_REQUEST");
    } else {
      await prisma.friendRequest.create({
        data: {
          senderId: userId as string,
          receiverId: id,
        },
      });
      return await handleNotify("", id, "CREATE", "FRIEND_REQUEST");
    }
  } catch (error) {
    throw new Error("Could not be follow request");
  }
};

export const cancelFollowing = async (id: string) => {
  try {
    const userId = await getUserId();
    if (id === userId) return;
    await prisma.follower.deleteMany({
      where: {
        followerId: userId,
        followingId: id,
      },
    });
  } catch (error) {
    throw new Error("Could not be cancel following.");
  }
};

export const evaluationOfFriendRequest = async (
  id: string,
  acceptanceStatus: boolean
) => {
  try {
    const userId = await getUserId();
    if (acceptanceStatus) {
      await prisma.follower.create({
        data: {
          followerId: id,
          followingId: userId as string,
        },
      });
    }
    await prisma.friendRequest.delete({
      where: {
        senderId_receiverId: { senderId: id, receiverId: userId as string},
      },
    });
  } catch (error) {
    throw new Error("Failed to accept or reject request");
  }
};
