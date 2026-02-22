"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("ContactPage.form");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleInputChange = () => {
    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };


    // Simulation of form submission. 
    // In a real scenario, you would connect this to a service like Formspree, EmailJS, 
    // or your own backend endpoint.
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error");

      setStatus("success");
      e.currentTarget.reset();

    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto mt-14 sm:mt-18 lg:mt-24 p-6 sm:p-10 rounded-2xl border border-white/10 bg-white/1 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >

      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white/95 mb-6 lg:mb-8">
          {t.rich("title", {
            highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
          })}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-2">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-200/50 px-1">
                {t("name")}
              </label>
              <input
                required
                type="text"
                name="name"
                autoComplete="name"
                placeholder={t("placeholderName")}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm lg:text-base text-white/90 placeholder:text-white/20 focus:outline-none focus:border-sky-400/40 focus:bg-sky-400/[0.03] transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-200/50 px-1">
                {t("email")}
              </label>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder={t("placeholderEmail")}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm lg:text-base text-white/90 placeholder:text-white/20 focus:outline-none focus:border-sky-400/40 focus:bg-sky-400/[0.03] transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-200/50 px-1">
              {t("subject")}
            </label>
            <input
              required
              type="text"
              name="subject"
              placeholder={t("placeholderSubject")}
              onChange={handleInputChange}
              className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm lg:text-base text-white/90 placeholder:text-white/20 focus:outline-none focus:border-sky-400/40 focus:bg-sky-400/[0.03] transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-200/50 px-1">
              {t("message")}
            </label>
            <textarea
              required
              name="message"
              rows={5}
              placeholder={t("placeholderMessage")}
              onChange={handleInputChange}
              className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm lg:text-base text-white/90 placeholder:text-white/20 focus:outline-none focus:border-sky-400/40 focus:bg-sky-400/[0.03] transition-all duration-300 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending" || status === "success"}
            className={`
              w-full cursor-pointer py-4 rounded-xl font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-300
              ${status === "success"
                ? "bg-emerald-500/30 text-emerald-400 border border-emerald-500/40"
                : status === "error"
                  ? "bg-rose-500/30 text-rose-400 border border-rose-500/40"
                  : "bg-sky-500/30 hover:bg-sky-500/40 text-sky-200 border border-sky-500/40 hover:border-sky-500/50 shadow-lg shadow-sky-500/5 hover:shadow-sky-500/10 active:scale-[0.98]"
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
                <AlertCircle className="w-4 h-4" />
                {t("error")}
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
