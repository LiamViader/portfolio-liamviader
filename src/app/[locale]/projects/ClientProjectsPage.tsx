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
import { usePerformanceConfig } from "@/hooks/usePerformanceConfig";
import { HeroSectionWrapper } from "@/components/layout/HeroSectionWrapper";
import { Container } from "@/components/layout/Container";
import { ShowcaseBlock } from "@/components/layout/ShowcaseBlock";
import { ContentBlock } from "@/components/layout/ContentBlock";
import { Stack } from "@/components/layout/Stack";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";


interface ClientProjectsPageProps {
  projectsData: TranslatedProject[];
}

const createHeroContainerVariants = (animated: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y: animated ? 48 : 0,
    filter: animated ? "blur(8px)" : "blur(0px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: animated
      ? {
        delay: BASE_DELAY_ENTRANCE,
        duration: 0,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.18,
      }
      : {
        duration: 0,
        when: "beforeChildren",
        staggerChildren: 0,
      },
  },
});

const createHeroChildVariants = (animated: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y: animated ? 26 : 0
  },
  show: {
    opacity: 1,
    y: 0,
    transition: animated
      ? {
        duration: 0.6,
        ease: "easeOut",
      }
      : {
        duration: 0,
      },
  },
});

const createlineVariants = (animated: boolean): Variants => ({
  hidden: {
    opacity: 0,
    scale: animated ? 0.1 : 0.99
  },
  show: {
    opacity: 1,
    scale: 0.99,
    transition: animated
      ? {
        delay: BASE_DELAY_ENTRANCE - 0.2,
        duration: 0.6,
        ease: "easeOut",
      }
      : {
        duration: 0,
      },
  },
});

const MotionStack = motion(Stack);

export default function ClientProjectsPage({ projectsData }: ClientProjectsPageProps) {
  const t = useTranslations("ProjectsPage");
  const { entranceAnimationsEnabled } = usePerformanceConfig();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSlug = (searchParams.get("filter") as ClientCategorySlug) || "all";
  const category: ClientCategorySlug = CATEGORY_CONFIG[currentSlug] ? currentSlug : "all";
  const getBackgroundColor = (cat: ClientCategorySlug) => {
    if (cat === "ai") return "rgb(14, 56, 96)";
    if (cat === "games") return "rgb(47, 22, 61)";
    return "rgb(29, 30, 35)";
  };

  const backgroundColor = getBackgroundColor(category);

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

  const heroContainerVariants = createHeroContainerVariants(entranceAnimationsEnabled);
  const heroChildVariants = createHeroChildVariants(entranceAnimationsEnabled);
  const lineVariants = createlineVariants(entranceAnimationsEnabled);

  const overlays = (
    <>
      <ProjectSceneCanvas category={category} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-950/15 via-gray-950/15 to-gray-950/20" />
    </>
  );

  return (
    <PageLayout
      className="isolate"
      overlays={overlays}
      contentClassName="flex flex-col"
    >
      <HeroSectionWrapper className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.05),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/20 to-transparent" />
        <Stack size="lg">
          <Container>
            <ShowcaseBlock>
              <MotionStack
                size="lg"
                initial="hidden"
                animate="show"
                variants={heroContainerVariants}
                className="relative text-center"
              >
                <motion.h1
                  variants={heroChildVariants}
                  className="
                    whitespace-pre-line text-pretty 
                    text-4xl sm:text-5xl lg:text-6xl
                    font-semibold tracking-tight text-white/95
                  "
                >
                  {t.rich("title", {
                    highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
                  })}
                </motion.h1>
                <motion.p
                  variants={heroChildVariants}
                  className="
                    max-w-3xl mx-auto text-pretty
                    text-xl sm:text-2xl 
                    text-white/70
                  "
                >
                  {t("intro_paragraph")}
                </motion.p>

              </MotionStack>
            </ShowcaseBlock>
          </Container>
          <motion.div variants={lineVariants} initial="hidden" animate="show" className="hidden xl:block h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent w-5xl mx-auto"></motion.div>
          <FeaturedProjectsSection
            projects={projectsData}
            replaceUrl={true}
            allowUrlOpen={false}
            entranceAnimationEnabled={entranceAnimationsEnabled}
            className="mt-2 sm:mt-4"
            useTransparent={false}
            backgroundColor={backgroundColor}
          />
        </Stack>

      </HeroSectionWrapper>





      <ProjectGallery
        category={category}
        filteredProjects={filteredProjects}
        onCategoryChange={setCategory}
        entranceAnimationEnabled={entranceAnimationsEnabled}
        useTransparent={false}
        backgroundColor={backgroundColor}
      />

      <CallToAction entranceAnimationEnabled={entranceAnimationsEnabled} />
    </PageLayout>
  );
}