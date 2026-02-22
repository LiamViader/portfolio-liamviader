"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, RefreshCcw } from "lucide-react";
import { usePerformanceConfig } from "@/hooks/usePerformanceConfig";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

export function ContactForm() {
  const t = useTranslations("ContactPage.form");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const { entranceAnimationsEnabled } = usePerformanceConfig();

  const handleInputChange = () => {
    if (status === "success" || status === "error") {
      setStatus("idle");
      setErrorCode(null);

      if (status === "success") {
        turnstileRef.current?.reset();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!turnstileToken) {
      setErrorCode("TURNSTILE_ERROR");
      setStatus("error");
      return;
    }

    const form = e.currentTarget;
    setStatus("sending");
    setErrorCode(null);

    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      telephone_number: formData.get("telephone_number"),
      turnstileToken: turnstileToken,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        // Save the error code from the server (or a generic one)
        setErrorCode(result.errorCode || "GENERIC_ERROR");
        setStatus("error");
        setTurnstileToken(null);
        turnstileRef.current?.reset();
        return;
      }

      setStatus("success");
      form.reset();
      setTurnstileToken(null);

    } catch (err) {
      console.error(err);
      setStatus("error");
      turnstileRef.current?.reset();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: entranceAnimationsEnabled ? 30 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: entranceAnimationsEnabled ? 1.1 : 0,
        duration: entranceAnimationsEnabled ? 0.8 : 0,
        ease: "easeOut"
      }}
      className="w-full max-w-4xl mx-auto mt-14 sm:mt-18 lg:mt-24 p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/1 backdrop-blur-xl relative overflow-hidden"
    >

      <div className="relative z-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-white/95 mb-4 lg:mb-6">
          {t.rich("title", {
            highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
          })}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-sky-200/70 px-1">
                {t("name")}
              </label>
              <input
                required
                type="text"
                name="name"
                autoComplete="name"
                placeholder={t("placeholderName")}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-sky-400/40 focus:bg-sky-400/[0.03] transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-sky-200/70 px-1">
                {t("email")}
              </label>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder={t("placeholderEmail")}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-sky-400/40 focus:bg-sky-400/[0.03] transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-sky-200/70 px-1">
              {t("subject")}
            </label>
            <input
              required
              type="text"
              name="subject"
              placeholder={t("placeholderSubject")}
              onChange={handleInputChange}
              className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-sky-400/40 focus:bg-sky-400/[0.03] transition-all duration-300"
            />
          </div>
          <div className="opacity-0 absolute -z-10 select-none pointer-events-none" aria-hidden="true"> {/* Honeypot field to prevent spam bots */}
            <input
              type="text"
              name="telephone_number"
              tabIndex={-1}
              autoComplete="off"
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-sky-200/70 px-1">
              {t("message")}
            </label>
            <textarea
              required
              name="message"
              rows={5}
              placeholder={t("placeholderMessage")}
              onChange={handleInputChange}
              className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-sky-400/40 focus:bg-sky-400/[0.03] transition-all duration-300 resize-none"
            />
          </div>
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200/90 text-xs sm:text-sm mb-4"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <p>{t(`errors.${errorCode || "GENERIC_ERROR"}`)}</p>
            </motion.div>
          )}
          <div
            className={`flex justify-center transition-all duration-500 ease-in-out overflow-hidden ${turnstileToken
              ? "opacity-0 min-h-0 h-0 py-0 mb-0"
              : "opacity-100 min-h-[90px] py-2 mb-2"
              }`}
          >
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
          {errorCode === "LIMIT_EXCEEDED" ? (
            <a
              href={`mailto:contact@liamviader.com`}
              className="w-full py-4 rounded-xl font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-300 bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40"
            >
              <Mail className="w-4 h-4" />
              {t("sendEmailDirectly")}
            </a>
          ) : (
            <button
              type="submit"
              disabled={status === "sending" || status === "success"}
              className={`
                w-full cursor-pointer py-4 rounded-xl font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-300
                ${status === "success"
                  ? "bg-emerald-500/30 text-emerald-400 border border-emerald-500/40"
                  : status === "error"
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/30 hover:bg-amber-500/30"
                    : "bg-sky-500/50 hover:bg-sky-500/60 text-sky-200 border border-sky-500/60 active:scale-[0.98]"
                }
                disabled:opacity-80 disabled:cursor-not-allowed
              `}
            >
              {status === "idle" && (
                <>
                  <Send className="w-4 h-4" />
                  {t("send")}
                </>
              )}
              {status === "sending" && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("sending")}
                </>
              )}
              {status === "success" && (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {t("success")}
                </>
              )}
              {status === "error" && (
                <>
                  <RefreshCcw className="w-4 h-4" />
                  {t("retry")}
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </motion.div>
  );
}
