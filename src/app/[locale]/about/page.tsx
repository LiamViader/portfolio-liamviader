"use client";

import PageLayout from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/about/HeroSection";
import { TechStackSection } from "@/components/about/TechStackSection";
import { TrajectorySection } from "@/components/about/TrajectorySection";
import { PersonalSection } from "@/components/about/PersonalSection";
import { PhilosophySection } from "@/components/about/PhilosophySection";
import {
  type PersonalInfo,
  type TechIcon,
} from "@/components/about/types";
import {
  ACADEMIC_PATH,
  EXPERIENCE_PATH,
} from "@/components/about/trajectoryContent";




const PERSONAL_INFO: PersonalInfo = {
  fullName: "Liam Viader Molina",
  birthdate: "2001-02-16",
  city: {
    es: "Barcelona, España",
    en: "Barcelona, Spain",
  },
  languages: {
    es: ["Catalán", "Español", "Inglés"],
    en: ["Catalan", "Spanish", "English"],
  },
};

const TECH_STACK: TechIcon[] = [
  { id: "csharp", label: "C#", iconSrc: "/icons/csharp.svg" },
  { id: "python", label: "Python", iconSrc: "/icons/python.svg" },
  { id: "javascript", label: "JavaScript", iconSrc: "/icons/javascript.svg" },
  { id: "typescript", label: "TypeScript", iconSrc: "/icons/typescript.svg" },
  { id: "php", label: "PHP", iconSrc: "/icons/php.svg" },
  { id: "cpp", label: "C++", iconSrc: "/icons/cplusplus.svg" },
  { id: "html", label: "HTML", iconSrc: "/icons/html.svg" },
  { id: "css", label: "CSS", iconSrc: "/icons/css.svg" },
  { id: "react", label: "React", iconSrc: "/icons/react.svg" },
  { id: "nextjs", label: "Next.js", iconSrc: "/icons/nextjs.svg" },
  { id: "tailwind", label: "Tailwind CSS", iconSrc: "/icons/tailwind.svg" },
  { id: "node", label: "Node.js", iconSrc: "/icons/nodejs.svg" },
  { id: "nest", label: "NestJS", iconSrc: "/icons/nestjs.svg" },
  { id: "fastapi", label: "FastAPI", iconSrc: "/icons/fastapi.svg" },
  { id: "pandas", label: "Pandas", iconSrc: "/icons/pandas.svg" },
  { id: "mysql", label: "MySQL", iconSrc: "/icons/mysql.svg" },
  { id: "mongodb", label: "MongoDB", iconSrc: "/icons/mongodb.svg" },
  { id: "jupyter", label: "Jupyter Notebook", iconSrc: "/icons/jupyter.svg" },
  { id: "scikitlearn", label: "Scikit-Learn", iconSrc: "/icons/scikitlearn.svg" },
  { id: "tensorflow", label: "TensorFlow", iconSrc: "/icons/tensorflow.svg" },
  { id: "openai", label: "OpenAI API", iconSrc: "/icons/openai.svg" },
  { id: "langchain", label: "LangChain & LangGraph", iconSrc: "/icons/langchain.svg" },
  { id: "comfyui", label: "ComfyUI", iconSrc: "/icons/comfyui.svg" },
  { id: "git", label: "Git", iconSrc: "/icons/git.svg" },
  { id: "unity", label: "Unity", iconSrc: "/icons/unity.svg" },
  { id: "godot", label: "Godot", iconSrc: "/icons/godot.svg" },
];

function getAge(dateString: string): number {
  const today = new Date();
  const birthDate = new Date(dateString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export default function AboutPage() {
  const age = getAge(PERSONAL_INFO.birthdate);

  return (
    <PageLayout>
      <HeroSection personalInfo={PERSONAL_INFO} age={age} />
      <TechStackSection techStack={TECH_STACK} />
      <TrajectorySection
        academicPath={ACADEMIC_PATH}
        experiencePath={EXPERIENCE_PATH}
      />
      <PersonalSection />
      <PhilosophySection />
    </PageLayout>
  );
}
