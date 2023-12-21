import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { status } = await req.json();

        const total = await prisma.appointment.count({
            where:{
                status: status
            }
        })
        return NextResponse.json({ data: total }, { status: 200 });
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
