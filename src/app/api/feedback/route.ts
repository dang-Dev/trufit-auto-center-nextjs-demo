import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const offset = searchParams.get("offset");
        const limit = searchParams.get("limit");

        let parse_offset = 0;
        let parse_limit = 0;

        if (offset) {
            parse_offset = parseInt(offset);
        }
        if (limit) {
            parse_limit = parseInt(limit);
        }

        const data = await prisma.feedback.findMany({
            skip: parse_offset,
            take: parse_limit,
            orderBy: {
                created_at: "desc",
            },
            include: {
                user: true,
            },
        });

        return NextResponse.json({ data: data, total: data.length }, { status: 200 });
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
        const body = await req.json();
        const { uuid, feedback }: { uuid: string; feedback: string } = body;
        const data = await prisma.feedback.create({
            data: {
                feedback: feedback,
                user: {
                    connect: {
                        id: uuid,
                    },
                },
            },
        });

        return NextResponse.json({ data: data }, { status: 201 });
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
        const { uuid } = await req.json();
        const data = await prisma.feedback.delete({
            where: {
                id: uuid
            },
        });
        return NextResponse.json({ data: data }, { status: 200 });
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
