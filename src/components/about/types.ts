import { type ReactNode } from "react";
import { type Locale } from "@/i18n/routing";

export type PersonalInfo = {
  fullName: string;
  birthdate: string;
  city: Record<Locale, string>;
  languages: Record<Locale, string[]>;
};

export type TimelineItem = {
  period: string;
  title: string;
  place: string;
  description?: ReactNode;
};

export type TechIcon = {
  id: string;
  label: string;
  iconSrc?: string;
  color?: string;
};
