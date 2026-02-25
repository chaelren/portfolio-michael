import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const updateExperienceSchema = z.object({
  type: z.enum(["WORK", "ORGANIZATION", "VOLUNTEER", "FREELANCE", "INTERNSHIP"]).optional(),
  position: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  companyUrl: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
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
    const validated = updateExperienceSchema.parse(body);

    const data: Record<string, unknown> = { ...validated };
    if (validated.startDate) data.startDate = new Date(validated.startDate);
    if (validated.endDate !== undefined) data.endDate = validated.endDate ? new Date(validated.endDate) : null;

    const experience = await prisma.experience.update({ where: { id }, data });
    return NextResponse.json(experience);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    console.error("Failed to update experience:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Failed to delete experience:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}