import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const start = searchParams.get("start");
        const end = searchParams.get("end");

        if (start && end) {
            const result = await prisma.event.findMany({
                where: {
                    start: {
                        gte: new Date(start),
                        lte: new Date(end),
                    },
                },
                include: {
                    appointments:true
                }
            });
            return NextResponse.json({ data: result }, { status: 200 });
        }

        if (start) {
            const result = await prisma.event.findMany({
                where: {
                    start: {
                        gte: new Date(start),
                    },
                },
                include: {
                    appointments:true
                }
            });
            return NextResponse.json({ data: result }, { status: 200 });
        }
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

export async function POST(req: Request) {
    try {
        const { title, start, end, allowed } = await req.json();

        const event = await prisma.event.create({
            data: {
                title: title,
                start: start,
                end: end,
                allowed: parseInt(allowed),
            },
        });
        if (!event) {
            throw new Error("Something went wrong!");
        }
        return NextResponse.json({ data: event }, { status: 201 });
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
        const { id, title, start, end, allowed } = await req.json();

        const event = await prisma.event.update({
            where: {
                id: id,
            },
            data: {
                title: title,
                start: start,
                end: end,
                allowed: parseInt(allowed),
            },
        });
        if (!event) {
            throw new Error("Something went wrong!");
        }
        return NextResponse.json({ data: event }, { status: 200 });
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

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.event.delete({
            where: {
                id: id,
            },
        });

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
