import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const result = await prisma.appointment.findUnique({
            where: {
                id: params.id,
            },
            include: {
                customer: true,
                event: true,
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

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const result = await prisma.appointment.update({
            where: {
                id: params.id,
            },
            data: {
                status: "CANCELED",
            },
        });
        console.log(result);
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const {
            carBrand,
            plateNumber,
            isExpired,
            remark,
            status,
            walkedInFullName,
            isWalkedIn,
            chassisNumber,
            engineNumber,
        } = await req.json();

        const q_data = isWalkedIn
            ? {
                  carBrand: carBrand,
                  plateNumber: plateNumber,
                  isExpired: isExpired,
                  remark: remark,
                  status: status,
                  chassisNumber: chassisNumber,
                  engineNumber: engineNumber,
                  walkedInFullName: walkedInFullName,
              }
            : {
                  carBrand: carBrand,
                  plateNumber: plateNumber,
                  isExpired: isExpired,
                  remark: remark,
                  status: status,
                  chassisNumber: chassisNumber,
                  engineNumber: engineNumber,
              };

        const updatedAppointment = await prisma.appointment.update({
            where: {
                id: params.id,
            },
            data: q_data,
        });
        return NextResponse.json({ data: updatedAppointment }, { status: 200 });
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const deleteData = await prisma.appointment.delete({
            where: {
                id: params.id,
            },
        });
        return NextResponse.json({ data: deleteData }, { status: 200 });
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
