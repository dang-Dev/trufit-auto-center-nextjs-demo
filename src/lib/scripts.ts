import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findUnique({
        where: { username: "admin", role: "ADMIN" },
    });

    if (!admin) {
        const hashPassword = await hash("admin2023", 10);
        await prisma.user.create({
            data: {
                username: "admin",
                password: hashPassword,
                role: "ADMIN",
            },
        });
    }
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
