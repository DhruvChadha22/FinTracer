import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
    return new PrismaClient().$extends(withAccelerate());
}

declare global {
    var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const prisma = globalThis.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}
