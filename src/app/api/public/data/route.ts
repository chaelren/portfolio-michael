import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [hero, about, skillCategories, projects, experiences, educations, certifications, socialLinks] = await Promise.all([
      prisma.heroSection.findFirst({ where: { isActive: true } }),
      prisma.about.findFirst({ where: { isActive: true } }),
      prisma.skillCategory.findMany({
        where: { isActive: true },
        include: { skills: { where: { isActive: true }, orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      }),
      prisma.project.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.experience.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { startDate: "desc" }],
      }),
      prisma.education.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { startDate: "desc" }],
      }),
      prisma.certification.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { issueDate: "desc" }],
      }),
      prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ]);

    return NextResponse.json({
      hero, about, skillCategories, projects,
      experiences, educations, certifications, socialLinks,
    });
  } catch (error) {
    console.error("Failed to fetch public data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}