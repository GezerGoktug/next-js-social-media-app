"use server";

import prisma from "@/lib/prisma";

const deleteNotify = async (notifyId: string) => {
  await prisma.notification.delete({
    where: {
      id: notifyId,
    },
  });
};

export default deleteNotify;
