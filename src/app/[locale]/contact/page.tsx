"use client";

import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarRange, Mail, MessageSquareText } from "lucide-react";
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

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const [status, setStatus] = useState<SubmissionState>("idle");

  const contactMethods = useMemo(
    () => [
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
    ],
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.32),_rgba(15,23,42,0.85)_60%,_rgba(2,6,23,0.95)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/85 to-gray-950" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
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
          <p className="text-sm font-medium uppercase tracking-[0.32em] text-sky-200/70">
            {t("hero.responseTime")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <motion.div
            variants={itemVariants}
            className="space-y-5"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_35px_80px_-40px_rgba(56,189,248,0.55)]">
              <h2 className="text-lg font-semibold text-white">
                {t("insight.title")}
              </h2>
              <p className="mt-2 text-sm text-white/65">
                {t("insight.copy")}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {contactMethods.map((method) => (
                <motion.a
                  variants={itemVariants}
                  key={method.title}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                  className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_35px_70px_-45px_rgba(56,189,248,0.6)] transition duration-500 hover:-translate-y-1`}
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
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_45px_100px_-60px_rgba(56,189,248,0.65)] backdrop-blur-2xl"
          >
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" aria-hidden />
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
                  whileHover={{ scale: status === "submitted" ? 1 : 1.02 }}
                  whileTap={{ scale: status === "submitted" ? 1 : 0.98 }}
                  disabled={status !== "idle"}
                  className="inline-flex items-center justify-center rounded-full bg-sky-500/90 px-6 py-3 text-sm font-semibold text-white shadow-[0_25px_70px_-35px_rgba(56,189,248,0.9)] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? t("form.status.submitting") : status === "submitted" ? t("form.status.submitted") : t("form.submit")}
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
