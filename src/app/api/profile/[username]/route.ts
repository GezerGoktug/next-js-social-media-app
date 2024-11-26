import { controlSession } from "@/actions/util/getUserInfos";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    await controlSession();
  } catch (error : any) {
    return NextResponse.json({message:error.message}, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
    select: {
      id: true,
      image: true,
      name: true,
      username: true,
      biography: true,
      city: true,
      country: true,
      createdAt: true,
      backdrop_image: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  return NextResponse.json(user, { status: 200 });
}
