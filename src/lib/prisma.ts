import { PrismaClient } from "@prisma/client";
import { generateFromEmail } from "unique-username-generator";

declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

client.$use(async (params, next) => {
  if (params.model === "User" && params.action === "create") {
    const userData = params.args.data;

    const generatedUsername = generateFromEmail(userData.email, 4);

    params.args.data.username = generatedUsername;
  }

  return next(params);
});

export default client;
