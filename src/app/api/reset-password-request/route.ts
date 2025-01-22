import { Resend } from "resend";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v7 as uuidv7 } from "uuid";
import ResetPasswordEmail from "@/components/Email/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();
  const exitingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!exitingUser)
    return NextResponse.json(
      { message: "No such user found" },
      { status: 404 }
    );

  const resetToken = uuidv7();
  const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000);

  try {
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiresAt: tokenExpiration,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Password reset token generation failed" },
      { status: 500 }
    );
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Password",
      react: ResetPasswordEmail({
        fullName: exitingUser.name,
        resetLink: resetUrl,
      }),
    });

    if (error) {
      return Response.json(
        { message: "Email could not be sent" },
        { status: 500 }
      );
    }
    if (data)
      return Response.json(
        { message: "Password reset email sent" },
        { status: 200 }
      );
  } catch (error) {
    return Response.json(
      { message: "Email could not be sent" },
      { status: 500 }
    );
  }
}
