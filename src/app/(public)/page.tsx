import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/public/hero-section";
import AboutSection from "@/components/public/about-section";
import SkillsSection from "@/components/public/skills-section";
import ProjectsSection from "@/components/public/projects-section";
import ExperienceSection from "@/components/public/experience-section";
import CertificationsSection from "@/components/public/certifications-section";
import ContactSection from "@/components/public/contact-section";
import Footer from "@/components/public/footer";
import Navbar from "@/components/public/navbar";

async function getData() {
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

  return { hero, about, skillCategories, projects, experiences, educations, certifications, socialLinks };
}

export default async function HomePage() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar />
      {data.hero && <HeroSection hero={data.hero} socialLinks={data.socialLinks} />}
      {data.about && <AboutSection about={data.about} />}
      {data.skillCategories.length > 0 && <SkillsSection categories={data.skillCategories} />}
      {data.projects.length > 0 && <ProjectsSection projects={data.projects} />}
      {(data.experiences.length > 0 || data.educations.length > 0) && (
        <ExperienceSection experiences={data.experiences} educations={data.educations} />
      )}
      {data.certifications.length > 0 && <CertificationsSection certifications={data.certifications} />}
      <ContactSection />
      <Footer socialLinks={data.socialLinks} />
    </div>
  );
}