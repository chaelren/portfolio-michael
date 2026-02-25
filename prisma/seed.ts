import { PrismaClient } from "../src/generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "michael@admin.com" },
    update: {},
    create: {
      name: "Michael Caren Sihombing",
      email: "michael@admin.com",
      hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Create default site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "Michael Caren Sihombing",
      siteDescription: "Full-Stack Developer Portfolio",
    },
  });

  console.log("✅ Site settings created:", settings.siteName);

  // Create default hero section
  const hero = await prisma.heroSection.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      greeting: "Hello, I'm",
      name: "Michael Caren Sihombing",
      title: "Full-Stack Developer",
      subtitle: "Fresh Graduate - Teknik Informatika",
      description:
        "A passionate Full-Stack Developer from Institut Teknologi Sumatera with experience in building modern web applications using React, TypeScript, and Python.",
      isActive: true,
    },
  });

  console.log("✅ Hero section created:", hero.name);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });