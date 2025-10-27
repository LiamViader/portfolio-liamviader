"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import {
  Mail,
  Building2,
  MessageSquare,
  Hammer,
  ArrowUpRight,
  Linkedin,
  Github,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";

export default function ContactPage() {
  const t = useTranslations("ContactPage");

  const highlightCards = [
    {
      key: "teams",
      icon: Building2,
      title: t("highlights.items.teams.title"),
      description: t("highlights.items.teams.description"),
    },
    {
      key: "projects",
      icon: Hammer,
      title: t("highlights.items.projects.title"),
      description: t("highlights.items.projects.description"),
    },
    {
      key: "networking",
      icon: MessageSquare,
      title: t("highlights.items.networking.title"),
      description: t("highlights.items.networking.description"),
    },
  ] as const satisfies readonly {
    key: "projects" | "teams" | "networking";
    icon: LucideIcon;
    title: string;
    description: string;
  }[];

  const contactLinks = [
    {
      key: "email",
      icon: Mail,
      href: `mailto:${t("links.items.email.value")}`,
      label: t("links.items.email.label"),
      value: t("links.items.email.value"),
    },
    {
      key: "linkedin",
      icon: Linkedin,
      href: t("links.items.linkedin.href"),
      label: t("links.items.linkedin.label"),
      value: t("links.items.linkedin.value"),
    },
    {
      key: "github",
      icon: Github,
      href: t("links.items.github.href"),
      label: t("links.items.github.label"),
      value: t("links.items.github.value"),
    },
  ];

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white px-3">
      <PulseHexGridCanvas gridType="Fill" pixelsPerHex={30} hue={250} l={5} s={100} fillTuning={{fillAlphaMax:0.2, fillAlphaMin: 0, lineAlphaMax:1, lineAlphaMin:0.8}}/>
      <PulseHexGridCanvas gridType="Trails" pixelsPerHex={30} hue={270} s={100} l={37} hueJitter={30} trailCount={30} stepsPerSecond={20}/>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.1),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-38 sm:px-6 sm:pb-42 sm:pt-34 lg:px-8">
        <ScrollReveal className="max-w-4xl" delay={1}>
          <div className="flex flex-col gap-6">
            <h1 className="text-center md:text-left text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl">
              {t.rich("hero.title", {
                highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </h1>
            <p className="text-center md:text-left text-pretty text-lg text-white/75 sm:text-xl">
              {t("hero.description")}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-6 mt-5 grid py-6 sm:py-8 overflow-hidden">
          {highlightCards.map(({ key, icon: Icon, title, description}, index) => (
            <ScrollReveal key={key} delay={1.2 + index * 0.18} className="" lateral>
              <article className="group relative overflow-hidden p-5 sm:p-6 h-full backdrop-blur-sm border border-white/10 bg-white/5 rounded-3xl transition hover:border-sky-400/60 hover:bg-sky-500/10" aria-labelledby={`contact-highlight-${key}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                <div className="relative z-10 flex h-full flex-row items-center justify-left gap-6">
                  <div className="flex shrink-0 h-12 w-12 items-center justify-center text-sky-300/95">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 id={`contact-highlight-${key}`} className="text-lg font-semibold text-sky-300/95">
                      {title}
                    </h3>
                    <p className="text-sm text-white/70">{description}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
        
        <ScrollReveal className="mt-6" delay={1.5} distance={20}>
          <nav aria-label="Contact" className="mx-auto max-w-4xl">
            <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {contactLinks.map(({ key, icon: Icon, href, value }) => (
                <li key={key}>
                  <a
                    href={href}
                    target={key === "email" ? undefined : "_blank"}
                    rel={key === "email" ? undefined : "noreferrer"}
                    className={`
                      inline-flex items-center gap-4 rounded-full
                      px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-lg
                      transition ring-1 backdrop-blur-sm bg-white/2 text-white/85 ring-white/15 hover:ring-sky-400/40 hover:bg-white/5 shadow-md shadow-sky-500/30
                    `}
                  >
                    <Icon className="size-5 shrink-0 text-sky-200" />
                    <span className="font-medium">{value}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-white/50" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollReveal>


        
      </div>
    </div>
  );
}
