"use client";

import { useTranslations, useLocale } from "next-intl";
import { getProjectsByLocale } from "@/data/projects/allProjects";
import { type TranslatedProject } from "@/data/projects/types";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjectsHomeSection } from "@/components/home/FeaturedProjectsHomeSection";
import PageLayout from "@/components/layout/PageLayout";
import PulseHexGridCanvas, { PulseHexGridFill, PulseHexGridOverlapLine } from "@/components/home/scene/PulseHexGridCanvas";
import { usePerformanceConfig } from "@/hooks/usePerformanceConfig";
import { HeroStats } from "@/components/home/HeroStats";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import { LastSection } from "@/components/layout/LastSection";
import { ContentBlock } from "@/components/layout/ContentBlock";
import { ShowcaseBlock } from "@/components/layout/ShowcaseBlock";
import { HeroSectionWrapper } from "@/components/layout/HeroSectionWrapper";

export default function HomeClient() {
  const { entranceAnimationsEnabled, backgroundsOptimization } = usePerformanceConfig();
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const projects = getProjectsByLocale(locale)
    .filter((project) => project.is_featured) satisfies TranslatedProject[];

  return (
    <PageLayout>
      <HeroSectionWrapper className="relative overflow-hidden">
        <PulseHexGridCanvas>
          <PulseHexGridFill
            params={{
              pixelsPerHex: 40,
              hue: 240,
              hueJitter: 10,
              s: 50,
              l: 30,
            }}
          />
          <PulseHexGridOverlapLine
            params={{
              pixelsPerHex: 40,
              hue: 240,
              hueJitter: 30,
              s: 60,
              l: 0,
            }}
          />
        </PulseHexGridCanvas>
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
              <PulseHexGridCanvas>
                <PulseHexGridFill
                  params={{
                    pixelsPerHex: 40,
                    hue: 240,
                    hueJitter: 10,
                    s: 50,
                    l: 30,
                  }}
                />
                <PulseHexGridOverlapLine
                  params={{
                    pixelsPerHex: 40,
                    hue: 240,
                    hueJitter: 30,
                    s: 60,
                    l: 0,
                  }}
                />
              </PulseHexGridCanvas>
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
