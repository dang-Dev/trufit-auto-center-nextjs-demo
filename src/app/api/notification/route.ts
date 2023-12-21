import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
    try {
        const notifications = await prisma.notification.findMany({
            take: 10,
            orderBy: {
                created_at: "desc",
            },
            select: {
                id: true,
                un_read: true,
                created_at: true,
                appointmentId: true,
                appointment: {
                    select: {
                        customer: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        event: {
                            select: {
                                start: true,
                                end: true,
                            },
                        },
                    },
                },
            },
        });

        const total_unread = await prisma.notification.count({
            where: {
                un_read: true,
            },
        });
        return NextResponse.json({ data: notifications, total_unread: total_unread }, { status: 200 });
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
