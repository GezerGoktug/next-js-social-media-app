"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const userFollowingStatus = async (id: string) => {
  const userId = await getUserId();
  if (userId === id) return;

  try {
    const existingFollowing = await prisma.follower.findFirst({
      where: {
        followingId: id,
        followerId: userId,
      },
    });
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: id,
      },
    });
    return {
      isFollowing: existingFollowing ? true : false,
      isRequesting: existingRequest ? true : false,
    };
  } catch (error) {
    throw new Error("Could not be get following status of user");
  }
};

export default userFollowingStatus;
