"use server";

import prisma from "@/lib/prisma";

const getFollowings = async (username: string) => {
  try {
    const followingUsers = await prisma.user.findUnique({
      where: { username },
      select: {
        following: {
          select: {
            follower: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
                biography: true,
                city: true,
                country: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return followingUsers?.following.map((item) => ({ ...item.follower }));
  } catch (error) {
    throw new Error("Could not be access your following");
  }
};

export default getFollowings;
