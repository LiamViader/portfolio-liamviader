"use client";

import { type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getProjectsByLocale } from "@/data/projects/allProjects";
import { type TranslatedProject } from "@/data/projects/types";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjectsHomeSection } from "@/components/home/FeaturedProjectsHomeSection";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";
import PageLayout from "@/components/layout/PageLayout";
import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";
import { usePerformanceConfig } from "@/hooks/usePerformanceConfig";
import { HeroStats } from "@/components/home/HeroStats";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import { LastSection } from "@/components/layout/LastSection";
import { ContentBlock } from "@/components/layout/ContentBlock";
import { ShowcaseBlock } from "@/components/layout/ShowcaseBlock";
import { HeroSectionWrapper } from "@/components/layout/HeroSectionWrapper";

const createTitleInfoCardsAnimation = (animated: boolean): Variants => ({
  hidden: { opacity: 0, y: animated ? 10 : 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: animated
      ? { delay: BASE_DELAY_ENTRANCE + 0.45, duration: 0.7, ease: "easeOut" }
      : { delay: 0, duration: 0 },
  },
});

const createInfoCardsAnimation = (animated: boolean): Variants => ({
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: animated
      ? {
        delayChildren: BASE_DELAY_ENTRANCE + 0.4,
        staggerChildren: 0.15,
        when: "beforeChildren",
      }
      : {
        delayChildren: 0,
        staggerChildren: 0,
        when: "beforeChildren",
      },
  },
});

export default function Home() {

  const { entranceAnimationsEnabled, backgroundsOptimization } = usePerformanceConfig();

  const t = useTranslations("HomePage");
  const locale = useLocale();
  const projects = getProjectsByLocale(locale)
    .filter((project) => project.is_featured) satisfies TranslatedProject[];

  const metricKeys: Array<"ai" | "videogames" | "system_design"> = ["ai", "videogames", "system_design"];

  const titleInfoCardsAnimation = createTitleInfoCardsAnimation(entranceAnimationsEnabled);
  const infoCardsAnimation = createInfoCardsAnimation(entranceAnimationsEnabled);

  return (
    <PageLayout>
      <HeroSectionWrapper className="relative overflow-hidden">
        <PulseHexGridCanvas gridType="Fill" s={50} l={30} hue={230} hueJitter={10} pixelsPerHex={40} />
        <PulseHexGridCanvas gridType="OverlapLine" s={60} l={0} hue={240} hueJitter={30} pixelsPerHex={40} />
        <div className="inset-0 absolute bg-[linear-gradient(to_bottom,_rgba(3,7,18,0.1)_0%,_rgba(3,7,18,0.7)_50%,_rgb(3,7,18)_97%,_rgb(3,7,18)_100%)]" />
        <Container>
          <ContentBlock>
            <Stack size="lg">
              <HeroSection
                title={t.rich("hero.title", {
                  highlight: (chunks) => (
                    <span className="text-sky-300">{chunks}</span>
                  ),
                })}
                subtitle={t("hero.subtitle")}
                contactButtonText={t("hero.ctaContact")}
                aboutButtonText={t("hero.ctaAbout")}
                entranceAnimationEnabled={entranceAnimationsEnabled}
              />

              <HeroStats entranceAnimationsEnabled={entranceAnimationsEnabled} />
            </Stack>
          </ContentBlock>
        </Container>
      </HeroSectionWrapper>
      <LastSection className="relative">
        {
          (backgroundsOptimization === "normal") ?
            <>
              <PulseHexGridCanvas gridType="Fill" s={50} l={30} hue={230} hueJitter={10} pixelsPerHex={40} />
              <PulseHexGridCanvas gridType="OverlapLine" s={60} l={0} hue={240} hueJitter={30} pixelsPerHex={40} />
            </>
            :
            <div className="inset-0 absolute bg-[rgb(14,17,51)]" />
        }
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgb(3,7,18)_0%,_rgb(3,7,18)_3%,_rgba(3,7,18,0.3)_50%,_rgb(3,7,18)_100%)]" />
        <Container>
          <ShowcaseBlock>
            <FeaturedProjectsHomeSection
              title={t("projects.title")}
              description={t("projects.description")}
              contactButtonText={t("hero.ctaContact")}
              projectsButtonText={t("projects.viewAll")}
              projects={projects}
              entranceAnimationEnabled={entranceAnimationsEnabled}
            />
          </ShowcaseBlock>
        </Container>
      </LastSection>
    </PageLayout>
  );
}
