import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const hashPassword = await hash(data.password, 10);

        const updateUser = await prisma.user.update({
            where: {
                id: data.uuid,
            },
            data: {
                password: hashPassword
            },
        });

        const deleteUser = await prisma.resetPasswordToken.delete({
            where: {
                uuid : updateUser.id
            },
          })
          console.log(deleteUser)
        return NextResponse.json({ data: deleteUser }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error", error },
            {
                status: 500,
            }
        );
    }
}
