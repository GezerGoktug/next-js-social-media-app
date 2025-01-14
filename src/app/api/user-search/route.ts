import { getUserId } from "@/actions/util/getUserInfos";
import { UnauthorizedError } from "@/error/UnauthorizedError";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchQuery = req.nextUrl.searchParams.get("q");

  try {
    const userId = await getUserId();

    if (!searchQuery) {
      return NextResponse.json({ message: "Text not found" }, { status: 400 });
    }

    if (searchQuery.length < 4) {
      return NextResponse.json(
        { message: "The text is not long enough" },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: searchQuery, mode: "insensitive" } },
              { name: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
          {
            id: {
              not: userId,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { message: "User search failed" },
      { status: 500 }
    );
  }
}
