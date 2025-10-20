"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import { Mail, BriefcaseBusiness, Sparkles, UsersRound, ArrowUpRight, Linkedin, Github } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "@/i18n/navigation";

const FlowFieldCanvas = dynamic(() => import("@/components/contact/FlowFieldCanvas"), { ssr: false });

const heroButtonsBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const heroButtons = {
  primary: `${heroButtonsBase} bg-sky-500/90 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 focus-visible:outline-sky-300`,
  secondary: `${heroButtonsBase} border border-white/20 bg-white/10 text-white/80 hover:border-sky-400/60 hover:bg-sky-500/10 focus-visible:outline-sky-300`,
};

const cardBaseClasses =
  "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl transition hover:border-sky-400/60 hover:bg-sky-500/10";

export default function ContactPage() {
  const t = useTranslations("ContactPage");

  const collaborationHighlightKeys = {
    employment: ["fullStack", "aiEnabled", "gameplay"],
    projects: ["prototyping", "architecture", "workshops"],
    collaboration: ["roadmap", "enablement", "partnerships"],
  } as const;

  const collaborationSectionsConfig = [
    {
      key: "employment",
      icon: BriefcaseBusiness,
      title: t("sections.employment.title"),
      description: t("sections.employment.description"),
    },
    {
      key: "projects",
      icon: Sparkles,
      title: t("sections.projects.title"),
      description: t("sections.projects.description"),
    },
    {
      key: "collaboration",
      icon: UsersRound,
      title: t("sections.collaboration.title"),
      description: t("sections.collaboration.description"),
    },
  ] as const satisfies readonly {
    key: keyof typeof collaborationHighlightKeys;
    icon: LucideIcon;
    title: string;
    description: string;
  }[];

  const collaborationSections = collaborationSectionsConfig.map((section) => ({
    ...section,
    highlights: collaborationHighlightKeys[section.key].map((pointKey) =>
      t(`sections.${section.key}.points.${pointKey}`)
    ),
  }));

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

  const availabilityPointKeys = ["timezone", "engagements", "discovery"] as const;
  const availabilityPoints = availabilityPointKeys.map((pointKey) =>
    t(`availability.points.${pointKey}`)
  );

  return (
    <div className="relative isolate min-h-[calc(100vh-var(--header-h,73px))] overflow-hidden bg-gray-950 text-white">
      <div className="absolute inset-0">
        <FlowFieldCanvas />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/65 to-gray-950" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-950 via-gray-950/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-32 sm:px-6 sm:pb-32 sm:pt-40 lg:px-8">
        <ScrollReveal className="max-w-3xl" delay={0.1}>
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
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
            <div className="flex flex-wrap gap-4 pt-2">
              <a href={`mailto:${t("links.items.email.value")}`} className={heroButtons.primary}>
                <Mail className="h-4 w-4" />
                {t("hero.primaryCta")}
              </a>
              <a href={t("links.items.linkedin.href")} target="_blank" rel="noreferrer" className={heroButtons.secondary}>
                <Linkedin className="h-4 w-4" />
                {t("hero.secondaryCta")}
              </a>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-3">
          {collaborationSections.map(({ key, icon: Icon, title, description, highlights }, index) => (
            <ScrollReveal key={key} delay={0.12 + index * 0.08} className="h-full" lateral>
              <article className={`${cardBaseClasses} h-full`}
                aria-labelledby={`contact-section-${key}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 id={`contact-section-${key}`} className="text-xl font-semibold text-white/95">
                      {title}
                    </h2>
                    <p className="text-sm text-white/70">
                      {description}
                    </p>
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {highlights.map((point) => (
                      <li key={point} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-[2fr,1fr] lg:items-start">
          <ScrollReveal className="space-y-6" delay={0.14}>
            <div className={`${cardBaseClasses} p-8`}
              aria-labelledby="contact-methods-title">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
              <div className="relative z-10 flex flex-col gap-6">
                <div className="space-y-2">
                  <h2 id="contact-methods-title" className="text-2xl font-semibold text-white/95">
                    {t("links.title")}
                  </h2>
                  <p className="text-sm text-white/70">
                    {t("links.description")}
                  </p>
                </div>
                <ul className="space-y-4">
                  {contactLinks.map(({ key, icon: Icon, href, label, value }) => (
                    <li key={key}>
                      <a
                        href={href}
                        target={key === "email" ? undefined : "_blank"}
                        rel={key === "email" ? undefined : "noreferrer"}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10"
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

          <ScrollReveal className="space-y-6" delay={0.18}>
            <div className={`${cardBaseClasses} h-full p-8`}
              aria-labelledby="contact-availability-title">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
              <div className="relative z-10 flex h-full flex-col gap-5">
                <div className="space-y-2">
                  <h2 id="contact-availability-title" className="text-2xl font-semibold text-white/95">
                    {t("availability.title")}
                  </h2>
                  <p className="text-sm text-white/70">
                    {t("availability.description")}
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-white/70">
                  {availabilityPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-sky-400" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto rounded-2xl border border-sky-400/30 bg-sky-500/10 px-4 py-3 text-sm font-medium text-sky-200">
                  {t("availability.responseTime")}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.2} className="mt-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/15 via-gray-950/90 to-gray-950 px-8 py-12 text-center shadow-[0_25px_80px_-40px_rgba(14,165,233,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_70%)]" aria-hidden />
            <div className="relative z-10 mx-auto max-w-3xl space-y-6">
              <h2 className="text-3xl font-semibold text-white/95 sm:text-4xl">
                {t.rich("cta.title", {
                  highlight: (chunks) => <span className="text-sky-200">{chunks}</span>,
                })}
              </h2>
              <p className="text-sm text-white/75 sm:text-base">
                {t("cta.description")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href={`mailto:${t("links.items.email.value")}`} className={`${heroButtons.primary} px-7 py-3 text-base`}>
                  {t("cta.button")}
                </a>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10"
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
