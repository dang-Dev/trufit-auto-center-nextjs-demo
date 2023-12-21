import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { uuid: string } }) {
    try {
        const reset_token = await prisma.resetPasswordToken.findUnique({
            where: {
                uuid : params.uuid,
            }
        })
        return NextResponse.json({ data: reset_token }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "Error", error },
            {
                status: 500,
            }
        );
    }
}
