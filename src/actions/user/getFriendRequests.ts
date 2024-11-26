"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const getFriendRequests = async (isCount?: boolean) => {
  const userId = await getUserId();
  if (isCount) {
    try {
      const count = await prisma.friendRequest.count({
        where: {
          receiverId: userId,
        },
      });
      return count;
    } catch (error) {
      throw new Error("Could not be access friend request count");
    }
  }
  try {
    const friendReqs = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
      },
      select: {
        senderId: true,
        sender: {
          select: {
            username: true,
            image: true,
            name: true,
          },
        },
      },
    });
    return friendReqs;
  } catch (error) {
    throw new Error("Could not be access friend request");
  }
};

export default getFriendRequests;
