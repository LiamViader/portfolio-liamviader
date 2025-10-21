"use client";

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

export default function ContactPage() {
  const t = useTranslations("ContactPage");

  const highlightCards = [
    {
      key: "projects",
      icon: Sparkles,
      title: t("highlights.items.projects.title"),
      description: t("highlights.items.projects.description"),
      tags: [
        t("highlights.items.projects.tags.discovery"),
        t("highlights.items.projects.tags.systems"),
        t("highlights.items.projects.tags.launch"),
      ],
    },
    {
      key: "teams",
      icon: BriefcaseBusiness,
      title: t("highlights.items.teams.title"),
      description: t("highlights.items.teams.description"),
      tags: [
        t("highlights.items.teams.tags.contract"),
        t("highlights.items.teams.tags.fullTime"),
        t("highlights.items.teams.tags.remote"),
      ],
    },
    {
      key: "advisory",
      icon: Lightbulb,
      title: t("highlights.items.advisory.title"),
      description: t("highlights.items.advisory.description"),
      tags: [
        t("highlights.items.advisory.tags.strategy"),
        t("highlights.items.advisory.tags.mentorship"),
        t("highlights.items.advisory.tags.speaking"),
      ],
    },
    {
      key: "community",
      icon: UsersRound,
      title: t("highlights.items.community.title"),
      description: t("highlights.items.community.description"),
      tags: [
        t("highlights.items.community.tags.collabs"),
        t("highlights.items.community.tags.openSource"),
        t("highlights.items.community.tags.events"),
      ],
    },
  ] as const satisfies readonly {
    key: "projects" | "teams" | "advisory" | "community";
    icon: LucideIcon;
    title: string;
    description: string;
    tags: string[];
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

  const availabilityPoints = [
    t("availability.points.timezone"),
    t("availability.points.engagements"),
    t("availability.points.discovery"),
  ];

  const emailLink = contactLinks.find(({ key }) => key === "email");
  const linkedinLink = contactLinks.find(({ key }) => key === "linkedin");

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      <PulseHexGridCanvas
        gridType="Fill"
        pixelsPerHex={30}
        hue={250}
        l={5}
        s={100}
        fillTuning={{ fillAlphaMax: 0.2, fillAlphaMin: 0, lineAlphaMax: 1, lineAlphaMin: 0.8 }}
      />
      <PulseHexGridCanvas
        gridType="Trails"
        pixelsPerHex={30}
        hue={270}
        s={100}
        l={37}
        hueJitter={30}
        trailCount={30}
        stepsPerSecond={20}
      />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.1),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-20 sm:px-6 sm:pb-32 sm:pt-34 lg:px-8">
        <ScrollReveal className="max-w-3xl" delay={0.1}>
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 backdrop-blur-sm">
              {t("hero.eyebrow")}
            </span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl">
              {t.rich("hero.title", {
                highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </h1>
            <p className="text-pretty text-lg text-white/75 sm:text-xl">
              {t("hero.description")}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={emailLink?.href ?? "#"}
                className={`${heroButtonsBase} bg-sky-500/90 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400/90 focus-visible:outline-sky-500`}
              >
                {t("hero.primaryCta")}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href={linkedinLink?.href ?? "#"}
                target="_blank"
                rel="noreferrer"
                className={`${heroButtonsBase} border border-white/20 bg-white/5 text-white/80 backdrop-blur-sm transition hover:border-sky-400/60 hover:text-white focus-visible:outline-sky-400`}
              >
                {t("hero.secondaryCta")}
              </a>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <ScrollReveal
            className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 sm:p-8"
            delay={0.16}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-white/90">{t("links.title")}</h2>
                <p className="text-sm text-white/70">{t("links.description")}</p>
              </div>
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
                      <ArrowUpRight className="h-4 w-4 text-white/40 transition group-hover:text-sky-300" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal className="rounded-4xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm" delay={0.2}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-white/90">{t("availability.title")}</h2>
                <p className="text-sm text-white/70">{t("availability.description")}</p>
              </div>
              <ul className="space-y-3 text-sm text-white/75">
                {availabilityPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-300" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm font-medium text-sky-100">
                {t("availability.responseTime")}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-20 space-y-8" delay={0.24}>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
              {t("highlights.title")}
            </span>
            <p className="max-w-3xl text-pretty text-white/70">{t("highlights.description")}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {highlightCards.map(({ key, icon: Icon, title, description, tags }, index) => (
              <ScrollReveal key={key} delay={0.26 + index * 0.08} className="h-full" lateral>
                <article
                  className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm transition hover:border-sky-400/60 hover:bg-sky-500/10"
                  aria-labelledby={`contact-highlight-${key}`}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="relative z-10 flex flex-col gap-4">
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
                  <ul className="relative z-10 mt-auto flex flex-wrap gap-2 pt-2">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/60"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-20" delay={0.28}>
          <div className="group relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-sky-500/20 via-sky-500/10 to-transparent p-8 text-white shadow-[0_40px_120px_-60px_rgba(56,189,248,0.7)]">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,116,144,0.25),_transparent_55%)] opacity-60"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl font-semibold">
                  {t.rich("cta.title", {
                    highlight: (chunks) => <span className="text-sky-100">{chunks}</span>,
                  })}
                </h2>
                <p className="text-pretty text-white/80">{t("cta.description")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={emailLink?.href ?? "#"}
                  className={`${heroButtonsBase} bg-white text-slate-900 hover:bg-sky-100 focus-visible:outline-white`}
                >
                  {t("cta.button")}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
                <Link
                  href="/projects"
                  className={`${heroButtonsBase} border border-white/30 bg-white/10 text-white/90 backdrop-blur-sm transition hover:border-white/60 hover:text-white focus-visible:outline-white`}
                >
                  {t("cta.secondary")}
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
