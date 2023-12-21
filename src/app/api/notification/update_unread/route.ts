import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { notificationId } = body;
        const notification = await prisma.notification.update({
            where: {
                id: notificationId,
            },
            data: {
                un_read: false,
            },
        });
        return NextResponse.json({ data: notification }, { status: 200 });
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
