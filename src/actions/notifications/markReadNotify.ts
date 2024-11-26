"use server";

import prisma from "@/lib/prisma";

const markReadNotify = async (notifyId: string) => {
  try {
    await prisma.notification.update({
      where: {
        id: notifyId,
      },
      data: {
        read: true,
      },
    });
  } catch (error) {
    throw new Error("Could not be mark notification");
  }
};

export default markReadNotify;
