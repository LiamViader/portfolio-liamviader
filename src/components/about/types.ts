import { type ReactNode } from "react";

export type PersonalInfo = {
  fullName: string;
  birthdate: string;
  city: string;
  languages: string[];
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
