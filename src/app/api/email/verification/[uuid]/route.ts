import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { uuid: string } }) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: params.uuid,
                isEmailVerify: false,
            },
        });
        if (!user) {
            return NextResponse.json({ data: [], message: "Account email is already verified!" }, { status: 200 });
        }
        const updateUser = await prisma.user.update({
            where: {
                id: params.uuid,
            },
            data: {
                isEmailVerify: true,
            },
        });
        return NextResponse.json({ data: [], message: "Account email verification successfully." }, { status: 200 });
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
