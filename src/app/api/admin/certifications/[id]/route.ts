import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const updateCertificationSchema = z.object({
  name: z.string().min(1).optional(),
  issuer: z.string().min(1).optional(),
  issuerUrl: z.string().nullable().optional(),
  credentialId: z.string().nullable().optional(),
  credentialUrl: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().nullable().optional(),
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
    const validated = updateCertificationSchema.parse(body);

    const data: Record<string, unknown> = { ...validated };
    if (validated.issueDate) data.issueDate = new Date(validated.issueDate);
    if (validated.expiryDate !== undefined) data.expiryDate = validated.expiryDate ? new Date(validated.expiryDate) : null;

    const certification = await prisma.certification.update({ where: { id }, data });
    return NextResponse.json(certification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    console.error("Failed to update certification:", error);
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.certification.delete({ where: { id } });
    return NextResponse.json({ message: "Certification deleted successfully" });
  } catch (error) {
    console.error("Failed to delete certification:", error);
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}