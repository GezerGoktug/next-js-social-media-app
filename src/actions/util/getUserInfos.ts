"use server";
import { UnauthorizedError } from "@/error/UnauthorizedError";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError("Could not be get session ");

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      name: true,
      username: true,
      city: true,
      country: true,
      biography: true,
      backdrop_image: true,
      image: true,
    },
  });
  return user;
}

export async function getUserId() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError("Could not be get session ");

  const data = await prisma.user.findUnique({
    where: { email: session?.user.email },
    select: {
      id: true,
    },
  });
  return data?.id;
}

export async function getUsername() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError("Could not be get session ");

  const data = await prisma.user.findUnique({
    where: { email: session?.user.email },
    select: {
      username: true,
    },
  });
  return data?.username;
}

export const controlSession = async () => {
  const session = await getSession();
  if (!session) throw new UnauthorizedError("Could not be get session ");
};
