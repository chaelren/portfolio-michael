import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const aboutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let about = await prisma.about.findFirst();
    if (!about) {
      about = await prisma.about.create({
        data: {
          title: "About Me",
          description: "Tell your story here...",
        },
      });
    }
    return NextResponse.json(about);
  } catch (error) {
    console.error("Failed to fetch about:", error);
    return NextResponse.json({ error: "Failed to fetch about" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const validated = aboutSchema.parse(body);

    let about = await prisma.about.findFirst();

    if (about) {
      about = await prisma.about.update({
        where: { id: about.id },
        data: {
          ...validated,
          imageUrl: validated.imageUrl || null,
        },
      });
    } else {
      about = await prisma.about.create({
        data: {
          ...validated,
          imageUrl: validated.imageUrl || null,
        },
      });
    }

    return NextResponse.json(about);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    console.error("Failed to update about:", error);
    return NextResponse.json({ error: "Failed to update about" }, { status: 500 });
  }
}