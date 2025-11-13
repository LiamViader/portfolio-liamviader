import { type Locale } from "@/i18n/routing";

export type PersonalInfo = {
  fullName: string;
  birthdate: string;
  city: Record<Locale, string>;
  languages: Record<Locale, string[]>;
};

export type TimelineItem = {
  period: string;
  title: Record<Locale, string>;
  place: Record<Locale, string>;
  description?: Record<Locale, string>;
};

export type TechIcon = {
  id: string;
  label: string;
  iconSrc?: string;
  color?: string;
};
