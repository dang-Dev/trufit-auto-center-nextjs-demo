import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const body = await req.json();
        const { uuid } = body;
        const result = await prisma.user.findUnique({
            where: {
                id: uuid,
            },
            select: {
                notifType: true,
            },
        });
        return NextResponse.json({ data: result }, { status: 200 });
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

export async function PUT(req: Request) {
    try {
        const { uuid, notifType } = await req.json();

        await prisma.user.update({
            where:{
                id: uuid
            },
            data: {
                notifType: notifType
            }
        })
        return NextResponse.json({ data: "OK" }, { status: 200 });
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
