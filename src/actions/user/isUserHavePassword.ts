"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../util/getUserInfos";

const isUserHavePassword = async () => {
  const userId = await getUserId();
  const userWithNullPassword = await prisma.user.findFirst({
    where: {
      password: null,
      id: userId,
    },
  });
  return { isPassword: userWithNullPassword ? true : false };
};

export default isUserHavePassword;
