"use client";

import { motion, type Variants } from "framer-motion";

import { WhiteButton, SkyButton } from "./Buttons";
import FeaturedProjects from "../projects/featured/FeaturedProjects";
import { TranslatedProject } from "@/data/projects";

interface FeaturedProjectsHomeSectionProps {
  title: string, 
  description: string, 
  projectsButtonText: string,
  contactButtonText: string,
  projects: TranslatedProject[];
}

const container: Variants = {
  hidden: { opacity: 1 }, // el contenedor no anima visiblemente
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 0.1s entre cada hijo (título -> desc -> botones)
      delayChildren: 0,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const buttonsContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0 }, // 0.1s entre los botones
  },
};

export function FeaturedProjectsHomeSection({
  title,
  description,
  projectsButtonText,
  contactButtonText,
  projects,
}: FeaturedProjectsHomeSectionProps) {
  return (
    <div className="relative mx-auto max-w-[1400px]">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.35,
            margin: "0px 0px -15% 0px",
          }}
          className="flex flex-col gap-6 text-center lg:text-left pl-3 will-change-transform"
        >
          <div className="space-y-4 mt-10">
            <motion.h2
              variants={item}
              className="font-semibold text-white text-3xl md:text-4xl xl:text-5xl whitespace-nowrap"
            >
              {title}
            </motion.h2>

            <motion.p
              variants={item}
              className="text-base text-white/65 lg:max-w-xl"
            >
              {description}
            </motion.p>
          </div>

          <motion.div
            variants={buttonsContainer}
            className="hidden lg:flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <motion.div variants={item}>
              <SkyButton href="/projects" text={projectsButtonText} />
            </motion.div>
            <motion.div variants={item}>
              <WhiteButton href="/contact" text={contactButtonText} />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="lg:col-start-2 lg:flex lg:justify-end">
          <FeaturedProjects
            projects={projects}
            className="max-w-full"
            contentClassName="justify-center"
            carouselLayout={{
              containerClassName: "!w-full",
              viewportClassName:
                "!h-[310px] md:!h-[390px] lg:!h-[390px] xl:!h-[410px] !w-full",
              cardClassName:
                "!w-[47%] sm:!w-[40%] md:!w-[39%] lg:!w-[37%] xl:!w-[38%]",
              controlsContainerClassName: "",
            }}
            carouselTypography={{
              titleClassName: "text-2xl",
              descriptionClassName: "text-sm",
              tagClassName: "text-[10px]",
            }}
          />
        </div>

        <div
          className="lg:hidden pt-5 flex flex-wrap items-center justify-center gap-4 lg:justify-start will-change-transform"
        >
          <div>
            <SkyButton href="/projects" text={projectsButtonText} />
          </div>
          <div>
            <WhiteButton href="/contact" text={contactButtonText} />
          </div>
        </div>
      </div>
    </div>
  );
}
