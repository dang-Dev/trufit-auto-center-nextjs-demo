// utils/prisma.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            username: true,
            isEmailVerify: true,
            notifType: true,
            role: true,
        },
    });
};
