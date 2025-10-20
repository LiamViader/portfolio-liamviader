"use client";

import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  CalendarRange,
  Clock,
  Github,
  Globe2,
  Linkedin,
  Mail,
  MessageSquareText,
  Rocket,
  Sparkles,
  Twitter,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

const ContactBackground = dynamic(
  () => import("@/components/contact/ContactAuroraCanvas"),
  { ssr: false, loading: () => <div className="h-full w-full bg-gray-950" /> }
);

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 shadow-[0_18px_40px_-18px_rgba(56,189,248,0.35)] placeholder:text-white/40 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition";

const labelClasses = "text-sm font-medium text-white/70";

type SubmissionState = "idle" | "submitting" | "submitted";

type ContactMethod = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  action: string;
  accent: string;
};

type AvailabilitySlot = {
  icon: LucideIcon;
  title: string;
  description: string;
  timeline: string;
  accent: string;
};

type FocusArea = {
  icon: LucideIcon;
  title: string;
  description: string;
  keywords: string[];
  accent: string;
};

type SocialLink = {
  icon: LucideIcon;
  label: string;
  handle: string;
  description: string;
  href: string;
  accent: string;
};

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const [status, setStatus] = useState<SubmissionState>("idle");

  const contactMethods = useMemo(
    () =>
      [
        {
          icon: Mail,
          title: t("touchpoints.email.title"),
          description: t("touchpoints.email.description"),
          href: "mailto:hello@liamviader.com",
          action: t("touchpoints.email.action"),
          accent: "from-sky-500/40 via-sky-500/10 to-sky-400/5",
        },
        {
          icon: CalendarRange,
          title: t("touchpoints.call.title"),
          description: t("touchpoints.call.description"),
          href: "https://cal.com/liamviader/30min",
          action: t("touchpoints.call.action"),
          accent: "from-purple-500/40 via-purple-500/10 to-purple-400/5",
        },
        {
          icon: MessageSquareText,
          title: t("touchpoints.chat.title"),
          description: t("touchpoints.chat.description"),
          href: "https://www.linkedin.com/in/liamviader/",
          action: t("touchpoints.chat.action"),
          accent: "from-emerald-500/40 via-emerald-500/10 to-emerald-400/5",
        },
      ] satisfies ContactMethod[],
    [t]
  );

  const availabilitySlots = useMemo(
    () =>
      [
        {
          icon: CalendarRange,
          title: t("availability.items.fractional.label"),
          description: t("availability.items.fractional.description"),
          timeline: t("availability.items.fractional.timeline"),
          accent: "from-sky-500/35 via-sky-500/10 to-sky-400/5",
        },
        {
          icon: Clock,
          title: t("availability.items.sprint.label"),
          description: t("availability.items.sprint.description"),
          timeline: t("availability.items.sprint.timeline"),
          accent: "from-purple-500/35 via-purple-500/10 to-purple-400/5",
        },
        {
          icon: Globe2,
          title: t("availability.items.advisory.label"),
          description: t("availability.items.advisory.description"),
          timeline: t("availability.items.advisory.timeline"),
          accent: "from-emerald-500/35 via-emerald-500/10 to-emerald-400/5",
        },
      ] satisfies AvailabilitySlot[],
    [t]
  );

  const focusAreas = useMemo(
    () =>
      [
        {
          icon: Sparkles,
          title: t("focus.items.discovery.label"),
          description: t("focus.items.discovery.description"),
          keywords: t("focus.items.discovery.keywords")
            .split("|")
            .map((keyword) => keyword.trim()),
          accent: "from-sky-500/35 via-sky-500/10 to-transparent",
        },
        {
          icon: Rocket,
          title: t("focus.items.launch.label"),
          description: t("focus.items.launch.description"),
          keywords: t("focus.items.launch.keywords")
            .split("|")
            .map((keyword) => keyword.trim()),
          accent: "from-purple-500/35 via-purple-500/10 to-transparent",
        },
        {
          icon: Users,
          title: t("focus.items.enablement.label"),
          description: t("focus.items.enablement.description"),
          keywords: t("focus.items.enablement.keywords")
            .split("|")
            .map((keyword) => keyword.trim()),
          accent: "from-emerald-500/35 via-emerald-500/10 to-transparent",
        },
      ] satisfies FocusArea[],
    [t]
  );

  const socialLinks = useMemo(
    () =>
      [
        {
          icon: Linkedin,
          label: t("social.links.linkedin.label"),
          handle: t("social.links.linkedin.handle"),
          description: t("social.links.linkedin.description"),
          href: "https://www.linkedin.com/in/liamviader/",
          accent: "from-sky-500/35 via-sky-500/10 to-transparent",
        },
        {
          icon: Github,
          label: t("social.links.github.label"),
          handle: t("social.links.github.handle"),
          description: t("social.links.github.description"),
          href: "https://github.com/liamviader",
          accent: "from-purple-500/35 via-purple-500/10 to-transparent",
        },
        {
          icon: Twitter,
          label: t("social.links.twitter.label"),
          handle: t("social.links.twitter.handle"),
          description: t("social.links.twitter.description"),
          href: "https://x.com/liamviader",
          accent: "from-emerald-500/35 via-emerald-500/10 to-transparent",
        },
      ] satisfies SocialLink[],
    [t]
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setTimeout(() => {
      setStatus("submitted");
    }, 950);
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute inset-0 -z-10">
        <ContactBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),_rgba(15,23,42,0.86)_60%,_rgba(2,6,23,0.96)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/30 via-gray-950/85 to-gray-950" />
        <div className="absolute inset-0 mix-blend-soft-light bg-[radial-gradient(circle_at_25%_20%,_rgba(168,85,247,0.24),_transparent_52%),_radial-gradient(circle_at_80%_30%,_rgba(45,212,191,0.18),_transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-gray-950 via-gray-950/75 to-transparent" />
      </div>

      <motion.section
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-28 pt-32 md:px-8"
      >
        <motion.div variants={itemVariants} className="max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.32em] text-white/70 shadow-[0_20px_50px_-30px_rgba(56,189,248,0.45)]">
            {t("hero.eyebrow")}
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="text-pretty text-lg text-white/70 sm:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-sky-200/70">
              {t("hero.responseTime")}
            </p>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              {t("focus.subtitle")}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_80px_-40px_rgba(56,189,248,0.55)] backdrop-blur-xl">
              <div className="absolute -left-12 top-0 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" aria-hidden />
              <div className="absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" aria-hidden />
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-white">
                  {t("insight.title")}
                </h2>
                <p className="mt-2 text-sm text-white/65">
                  {t("insight.copy")}
                </p>
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_90px_-50px_rgba(56,189,248,0.6)] backdrop-blur-xl"
            >
              <div className="absolute -left-24 top-0 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" aria-hidden />
              <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-purple-500/15 blur-3xl" aria-hidden />
              <div className="relative z-10 space-y-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {t("availability.title")}
                    </h2>
                    <p className="text-sm text-white/65">
                      {t("availability.subtitle")}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-200/70">
                    {t("availability.badge")}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {availabilitySlots.map((slot) => (
                    <div
                      key={slot.title}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-500 hover:border-white/20"
                    >
                      <div
                        className={`absolute inset-0 -z-10 bg-gradient-to-br ${slot.accent} opacity-0 transition duration-500 group-hover:opacity-100`}
                      />
                      <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-3 text-sm font-semibold text-white">
                          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white">
                            <slot.icon className="h-4 w-4" />
                          </span>
                          {slot.title}
                        </div>
                        <span className="text-xs font-medium text-sky-100/80">
                          {slot.timeline}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/70">{slot.description}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/55">{t("availability.note")}</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_90px_-50px_rgba(168,85,247,0.55)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_65%)] opacity-70" aria-hidden />
              <div className="relative z-10 space-y-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {t("focus.title")}
                    </h2>
                    <p className="text-sm text-white/65">
                      {t("focus.description")}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                    {t("focus.badge")}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {focusAreas.map((area) => (
                    <div
                      key={area.title}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-500 hover:border-white/20"
                    >
                      <div
                        className={`absolute inset-0 -z-10 bg-gradient-to-br ${area.accent} opacity-0 transition duration-500 group-hover:opacity-100`}
                      />
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                          <area.icon className="h-5 w-5" />
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">{area.title}</p>
                          <p className="text-xs text-white/65">{area.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {area.keywords.map((keyword) => (
                          <span
                            key={`${area.title}-${keyword}`}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2">
              {contactMethods.map((method) => (
                <motion.a
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  key={method.title}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_35px_70px_-45px_rgba(56,189,248,0.6)] transition duration-500"
                >
                  <div
                    className={`absolute inset-0 -z-10 bg-gradient-to-br ${method.accent} opacity-0 transition duration-500 group-hover:opacity-100`}
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <method.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {method.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    {method.description}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-sky-100/80 transition group-hover:text-white">
                    {method.action}
                  </span>
                </motion.a>
              ))}
            </div>

            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_90px_-50px_rgba(45,212,191,0.55)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_65%)] opacity-70" aria-hidden />
              <div className="relative z-10 space-y-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {t("social.title")}
                    </h2>
                    <p className="text-sm text-white/65">
                      {t("social.subtitle")}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200/70">
                    {t("social.badge")}
                  </span>
                </div>
                <div className="grid gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      variants={itemVariants}
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 280, damping: 24 }}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-500"
                    >
                      <div
                        className={`absolute inset-0 -z-10 bg-gradient-to-br ${social.accent} opacity-0 transition duration-500 group-hover:opacity-100`}
                      />
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                        <social.icon className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-white">{social.label}</p>
                          <span className="text-xs font-medium text-sky-100/80">{social.handle}</span>
                        </div>
                        <p className="text-sm text-white/70">{social.description}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_45px_100px_-60px_rgba(56,189,248,0.65)] backdrop-blur-2xl"
          >
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/25 blur-3xl" aria-hidden />
            <div className="absolute -bottom-16 -left-20 h-60 w-60 rounded-full bg-purple-500/20 blur-3xl" aria-hidden />

            <div className="relative z-10 space-y-3">
              <h2 className="text-xl font-semibold text-white">
                {t("form.title")}
              </h2>
              <p className="text-sm text-white/65">
                {t("form.subtitle")}
              </p>
            </div>

            <form onSubmit={onSubmit} className="relative z-10 mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className={labelClasses}>{t("form.fields.name.label")}</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder={t("form.fields.name.placeholder")}
                    className={inputClasses}
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className={labelClasses}>{t("form.fields.email.label")}</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={t("form.fields.email.placeholder")}
                    className={inputClasses}
                    required
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className={labelClasses}>{t("form.fields.company.label")}</span>
                  <input
                    type="text"
                    name="company"
                    placeholder={t("form.fields.company.placeholder")}
                    className={inputClasses}
                  />
                </label>
                <label className="space-y-2">
                  <span className={labelClasses}>{t("form.fields.budget.label")}</span>
                  <select
                    name="budget"
                    className={`${inputClasses} appearance-none`}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {t("form.fields.budget.placeholder")}
                    </option>
                    <option value="starter">{t("form.fields.budget.options.starter")}</option>
                    <option value="growth">{t("form.fields.budget.options.growth")}</option>
                    <option value="scale">{t("form.fields.budget.options.scale")}</option>
                    <option value="open">{t("form.fields.budget.options.open")}</option>
                  </select>
                </label>
              </div>

              <label className="space-y-2">
                <span className={labelClasses}>{t("form.fields.message.label")}</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder={t("form.fields.message.placeholder")}
                  className={`${inputClasses} resize-none`}
                  required
                />
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/55">{t("form.disclaimer")}</p>
                <motion.button
                  type="submit"
                  whileHover={{ scale: status === "submitted" ? 1 : 1.04 }}
                  whileTap={{ scale: status === "submitted" ? 1 : 0.97 }}
                  disabled={status !== "idle"}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500/90 via-sky-400/90 to-cyan-400/90 px-6 py-3 text-sm font-semibold text-white shadow-[0_25px_70px_-35px_rgba(56,189,248,0.9)] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting"
                    ? t("form.status.submitting")
                    : status === "submitted"
                      ? t("form.status.submitted")
                      : t("form.submit")}
                </motion.button>
              </div>
            </form>

            <motion.p
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: status === "submitted" ? 1 : 0, y: status === "submitted" ? 0 : 10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-sm font-medium text-emerald-200/90"
            >
              {t("form.success")}
            </motion.p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
