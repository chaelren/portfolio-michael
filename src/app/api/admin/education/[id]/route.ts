import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const updateEducationSchema = z.object({
  institution: z.string().min(1).optional(),
  degree: z.string().min(1).optional(),
  field: z.string().min(1).optional(),
  location: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  gpa: z.number().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const validated = updateEducationSchema.parse(body);

    const data: Record<string, unknown> = { ...validated };
    if (validated.startDate) data.startDate = new Date(validated.startDate);
    if (validated.endDate !== undefined) data.endDate = validated.endDate ? new Date(validated.endDate) : null;

    const education = await prisma.education.update({ where: { id }, data });
    return NextResponse.json(education);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    console.error("Failed to update education:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Failed to delete education:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}