"use server";

import prisma from "@/lib/prisma";

const getFollowers = async (username: string) => {
  try {
    const followerUsers = await prisma.user.findUnique({
      where: { username },
      select: {
        followers: {
          select: {
            following: {
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

    return followerUsers?.followers.map((item) => ({ ...item.following }));
  } catch (error) {
    throw new Error("Could not be access your followers");
  }
};

export default getFollowers;
