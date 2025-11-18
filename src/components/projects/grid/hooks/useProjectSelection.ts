"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type TranslatedProject } from "@/data/projects/types";

interface SelectedProjectState {
  project: TranslatedProject;
  rect: DOMRect;
  el?: HTMLElement;
}

// El "Semáforo" Global
let isGlobalProjectOpen = false;

interface UseProjectSelectionOptions {
  replaceUrl?: boolean;
  allowUrlOpen?: boolean;
  deferUrlTrigger?: boolean;
}

export function useProjectSelection(
  projects: TranslatedProject[] = [],
  { replaceUrl = true, allowUrlOpen = true, deferUrlTrigger = false }: UseProjectSelectionOptions = {}
) {
  const [selected, setSelected] = useState<SelectedProjectState | null>(null);
  const [revealOrigin, setRevealOrigin] = useState(false);
  
  // Estado de bloqueo para evitar reaperturas inmediatas al cerrar
  const [ignoredSlug, setIgnoredSlug] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlProjectSlug = searchParams.get("project");

  // --- EL CAMBIO CLAVE ESTÁ AQUÍ ---
  // Calculamos qué proyecto pide la URL.
  let projectFromUrl: TranslatedProject | null = null;
  
  // Solo devolvemos un proyecto si:
  // 1. Hay slug en la URL
  // 2. NO es el slug que acabamos de cerrar (ignoredSlug)
  // 3. IMPORTANTE: NO hay ningún proyecto abierto globalmente (isGlobalProjectOpen)
  //    (Esto evita que el Gallery intente abrirse si el Featured ya lo abrió)
  if (urlProjectSlug && urlProjectSlug !== ignoredSlug && !isGlobalProjectOpen) {
    projectFromUrl = projects.find((p) => p.slug === urlProjectSlug) || null;
  }

  // Limpiar el bloqueo de cierre cuando la URL cambia
  useEffect(() => {
    if (urlProjectSlug !== ignoredSlug) {
       setIgnoredSlug(null);
    }
  }, [urlProjectSlug, ignoredSlug]);

  // Efecto Fallback (Solo si NO usamos deferUrlTrigger)
  useEffect(() => {
    if (!projectFromUrl || !allowUrlOpen || isGlobalProjectOpen) return;
    if (deferUrlTrigger) return; 

    if (selected?.project.id !== projectFromUrl.id) {
      isGlobalProjectOpen = true;
      setSelected({
        project: projectFromUrl,
        rect: getCenterRect(),
        el: undefined,
      });
      setRevealOrigin(true);
    }
  }, [projectFromUrl, allowUrlOpen, deferUrlTrigger, selected]);

  // Efecto Botón Atrás (Cerrar si se borra URL)
  useEffect(() => {
    if (!urlProjectSlug && selected && !selected.el && !ignoredSlug) {
      isGlobalProjectOpen = false;
      setSelected(null);
      setRevealOrigin(false);
    }
  }, [urlProjectSlug, selected, ignoredSlug]);

  const selectProject = useCallback(
    (project: TranslatedProject, rect: DOMRect, el: HTMLElement) => {
      isGlobalProjectOpen = true; // <--- Activamos semáforo
      setIgnoredSlug(null);
      setRevealOrigin(false);
      setSelected({ project, rect, el });

      if (replaceUrl) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("project", project.slug);
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
      }
    },
    [replaceUrl, pathname, router, searchParams]
  );

  const closeProject = useCallback(() => {
    if (selected?.project.slug) {
        setIgnoredSlug(selected.project.slug);
    }
    isGlobalProjectOpen = false; // <--- Liberamos semáforo
    setSelected(null);
    setRevealOrigin(false);

    if (replaceUrl) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("project");
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [selected, replaceUrl, pathname, router, searchParams]);

  const markOriginRevealed = useCallback(() => {
    setRevealOrigin(true);
  }, []);

  return {
    selected,
    revealOrigin,
    selectProject,
    closeProject,
    markOriginRevealed,
    projectFromUrl, 
  };
}

function getCenterRect(): DOMRect {
    if (typeof window === "undefined") return new DOMRect(0,0,0,0);
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    return { width: 0, height: 0, x, y, top: y, left: x, right: x, bottom: y, toJSON: () => {} };
}