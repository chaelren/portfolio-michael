import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const heroSchema = z.object({
  greeting: z.string().min(1, "Greeting is required"),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().nullable().optional(),
  description: z.string().min(1, "Description is required"),
  resumeUrl: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let hero = await prisma.heroSection.findFirst();
    if (!hero) {
      hero = await prisma.heroSection.create({
        data: {
          greeting: "Hello, I'm",
          name: "Michael Caren Sihombing",
          title: "Full-Stack Developer",
          description: "A passionate developer who loves building web applications.",
        },
      });
    }
    return NextResponse.json(hero);
  } catch (error) {
    console.error("Failed to fetch hero:", error);
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const validated = heroSchema.parse(body);

    let hero = await prisma.heroSection.findFirst();

    if (hero) {
      hero = await prisma.heroSection.update({
        where: { id: hero.id },
        data: {
          ...validated,
          subtitle: validated.subtitle || null,
          resumeUrl: validated.resumeUrl || null,
          avatarUrl: validated.avatarUrl || null,
        },
      });
    } else {
      hero = await prisma.heroSection.create({
        data: {
          ...validated,
          subtitle: validated.subtitle || null,
          resumeUrl: validated.resumeUrl || null,
          avatarUrl: validated.avatarUrl || null,
        },
      });
    }

    return NextResponse.json(hero);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    console.error("Failed to update hero:", error);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}