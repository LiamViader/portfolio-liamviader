"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import {
  Mail,
  BriefcaseBusiness,
  Sparkles,
  UsersRound,
  Lightbulb,
  ArrowUpRight,
  Linkedin,
  Github,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "@/i18n/navigation";

import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";

const heroButtonsBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const cardBaseClasses =
  "group relative overflow-hidden p-6 sm:p-8";

export default function ContactPage() {
  const t = useTranslations("ContactPage");

  const highlightCards = [
    {
      key: "projects",
      icon: Sparkles,
      title: t("highlights.items.projects.title"),
      description: t("highlights.items.projects.description"),
    },
    {
      key: "teams",
      icon: BriefcaseBusiness,
      title: t("highlights.items.teams.title"),
      description: t("highlights.items.teams.description"),
    },
    {
      key: "networking",
      icon: UsersRound,
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
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      <PulseHexGridCanvas gridType="Fill" pixelsPerHex={30} hue={250} l={5} s={100} fillTuning={{fillAlphaMax:0.2, fillAlphaMin: 0, lineAlphaMax:1, lineAlphaMin:0.8}}/>
      <PulseHexGridCanvas gridType="Trails" pixelsPerHex={30} hue={270} s={100} l={37} hueJitter={30} trailCount={30} stepsPerSecond={20}/>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.1),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-20 sm:px-6 sm:pb-32 sm:pt-34 lg:px-8">
        <ScrollReveal className="max-w-3xl" delay={0.1}>
          <div className="flex flex-col gap-6">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl">
              {t.rich("hero.title", {
                highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </h1>
            <p className="text-pretty text-lg text-white/75 sm:text-xl">
              {t("hero.description")}
            </p>
          </div>
        </ScrollReveal>
        
        <ScrollReveal className="space-y-6 mt-10" delay={0.14}>
          <div className="group relative overflow-hidden p-6 sm:p-8" aria-labelledby="contact-methods-title">
            <div className="relative z-10 flex flex-col gap-6">
              <ul className="space-y-4">
                {contactLinks.map(({ key, icon: Icon, href, label, value }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target={key === "email" ? undefined : "_blank"}
                      rel={key === "email" ? undefined : "noreferrer"}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-200 ring-1 ring-sky-400/20">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{label}</span>
                          <span className="text-base font-medium text-white/90">{value}</span>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-white/40 transition group-hover:text-sky-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {highlightCards.map(({ key, icon: Icon, title, description}, index) => (
            <ScrollReveal key={key} delay={0.16 + index * 0.18} className="h-[400px]" lateral>
              <article className="group relative overflow-hidden p-6 sm:p-8 h-full backdrop-blur-sm border border-white/10 bg-white/5 rounded-4xl transition hover:border-sky-400/60 hover:bg-sky-500/10" aria-labelledby={`contact-highlight-${key}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                <div className="relative z-10 flex h-full flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 id={`contact-highlight-${key}`} className="text-lg font-semibold text-white/95">
                      {title}
                    </h3>
                    <p className="text-sm text-white/70">{description}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        
      </div>
    </div>
  );
}
