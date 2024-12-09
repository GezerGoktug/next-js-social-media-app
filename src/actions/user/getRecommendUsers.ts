"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const getRecommendUsers = async (extended?: boolean) => {
  const userId = await getUserId();

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: userId } }, 
        { followers: { none: { followerId: userId } } },
        { 
          followRequestsReceived: { 
            none: { senderId: userId } 
          } 
        }
      ],
    },
    select: {
      image: true,
      name: true,
      username: true,
      id: true,
    },
    take: extended ? 20 : 3,
  });

  return users;
};

export default getRecommendUsers;

