"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import PageLayout from "@/components/layout/PageLayout";
import CallToAction from "@/components/CallToAction";
import { ProjectSceneCanvas } from "@/components/projects/ProjectSceneCanvas";
import { CATEGORY_CONFIG, ClientCategorySlug } from "@/config/projectCategories";
import { type TranslatedProject } from "@/data/projects/types";
import FeaturedProjectsSection from "@/components/projects/featured/FeaturedProjectsSection";
import ProjectGallery from "@/components/projects/gallery/ProjectGallery";

interface ClientProjectsPageProps {
  projectsData: TranslatedProject[];
}

const heroContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.18,
    },
  },
};

const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function ClientProjectsPage({ projectsData }: ClientProjectsPageProps) {
  const t = useTranslations("ProjectsPage");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSlug = (searchParams.get("filter") as ClientCategorySlug) || "all";
  const category: ClientCategorySlug = CATEGORY_CONFIG[currentSlug] ? currentSlug : "all";

  const setCategory = (newCategory: ClientCategorySlug) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newCategory === "all") {
      newParams.delete("filter");
    } else {
      newParams.set("filter", newCategory);
    }
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const filteredProjects = projectsData.filter((project) => {
    const currentFilter = CATEGORY_CONFIG[category].filterKey;

    if (!currentFilter) return true;

    return project.categories.includes(currentFilter);
  });

  const overlays = (
    <>
      <ProjectSceneCanvas category={category} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-950/15 via-gray-950/15 to-gray-950/20" />
    </>
  );

  return (
    <PageLayout
      className="isolate"
      backgroundLayers={[]}
      overlays={overlays}
      contentClassName="flex flex-col"
    >
      <section className="relative overflow-hidden px-4 pb-20 pt-34 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(125,211,252,0.28),transparent_25%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/50 to-transparent" />
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[1.5px]" />
        <motion.div
          initial="hidden"
          animate="show"
          variants={heroContainerVariants}
          className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 text-center"
        >
          <motion.h1
            variants={heroChildVariants}
            className="text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl"
          >
            {t.rich("title", {
              highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
            })}
          </motion.h1>
          <motion.p
            variants={heroChildVariants}
            className="max-w-3xl text-pretty text-lg text-white/70 sm:text-xl"
          >
            {t("intro_paragraph")}
          </motion.p>
        </motion.div>
      </section>

      <FeaturedProjectsSection projects={projectsData} replaceUrl={true} allowUrlOpen={false}/>

      <ProjectGallery
        category={category}
        filteredProjects={filteredProjects}
        onCategoryChange={setCategory}
      />

      <CallToAction />
    </PageLayout>
  );
}
