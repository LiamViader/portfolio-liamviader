import { ProjectDefinition } from "../types";

export const ButterflyCollector: ProjectDefinition = {
  slug: "butterfly-collector",
  date: "2022-05",
  tags: [
    "AR",
    "Mobile",
    "Unity",
    "C#"
  ],
  media_preview: "/images/projects/butterfly-collector/preview.jpg",
  links: [
    {
      url: "https://github.com/LiamViader/butterfly-collector/releases/download/v1.0.2/ButterflyCollector_v1.0.2.apk",
      label: "Download APK",
      type: "live",
      icon: "Download",
      primaryColor: "rgba(16, 185, 129, 0.7)",
      secondaryColor: "rgba(5, 150, 105, 1)",
    },
    {
      url: "https://github.com/LiamViader/butterfly-collector",
      label: "GitHub",
      type: "github",
      icon: "Github",
      primaryColor: "rgba(150, 37, 255, 0.7)",
      secondaryColor: "rgba(168, 85, 247, 1)",
    },
  ],
  detailed_media: [

  ],
  categories: ["Game"],
  is_featured: true,
  translations: {
    en: {
      title: "Butterfly Collector",
      short_description:
        ".",
      full_description: `.`,
      role: "Creator, Designer, and Developer of the Full Videogame",
    },
    es: {
      title: "Butterfly Collector",
      short_description:
        ".",
      full_description: `.`,
      role: "Creator, Designer, and Developer of the Full Videogame",
    },
  },
};
