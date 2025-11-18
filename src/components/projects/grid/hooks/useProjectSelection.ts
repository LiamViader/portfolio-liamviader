"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type TranslatedProject } from "@/data/projects/types";

interface SelectedProjectState {
  project: TranslatedProject;
  rect: DOMRect;
  el?: HTMLElement;
}

// Variable fuera del hook para compartir el estado de "hay un proyecto abierto"
// entre componentes hermanos (Grid y Featured) durante la sesión.
let isGlobalProjectOpen = false;

// Configuración por defecto
interface UseProjectSelectionOptions {
  replaceUrl?: boolean; // ¿Permitir escribir en la URL al abrir?
  allowUrlOpen?: boolean; // ¿Permitir abrir el modal si la URL cambia?
}

function getCenterRect(): DOMRect {
  if (typeof window === "undefined") return new DOMRect(0, 0, 0, 0);
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2;
  return {
    width: 0, height: 0, x, y, top: y, left: x, right: x, bottom: y, toJSON: () => {},
  };
}

export function useProjectSelection(
  projects: TranslatedProject[] = [],
  { replaceUrl = true, allowUrlOpen = true }: UseProjectSelectionOptions = {}
) {
  const [selected, setSelected] = useState<SelectedProjectState | null>(null);
  const [revealOrigin, setRevealOrigin] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. ESCUCHAR URL
  useEffect(() => {
    const projectSlug = searchParams.get("project");

    if (projectSlug) {
      // CASO: Hay un slug en la URL.
      // Solo abrimos si:
      // 1. Está permitido por configuración (allowUrlOpen)
      // 2. No hay NINGÚN proyecto abierto globalmente (evita conflicto si acabamos de hacer clic en el otro componente)
      // 3. No es el proyecto que ya tengo abierto yo mismo.
      if (allowUrlOpen && !isGlobalProjectOpen && selected?.project.slug !== projectSlug) {
        const projectToOpen = projects.find((p) => p.slug === projectSlug);
        if (projectToOpen) {
          isGlobalProjectOpen = true; // Bloqueamos globalmente
          setSelected({
            project: projectToOpen,
            rect: getCenterRect(),
            el: undefined,
          });
          setRevealOrigin(true);
        }
      }
    } else {
      // CASO: No hay slug (se cerró o botón atrás)
      if (selected) {
        isGlobalProjectOpen = false; // Liberamos bloqueo
        setSelected(null);
        setRevealOrigin(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, allowUrlOpen, projects]); 

  // 2. SELECCIONAR (Click manual)
  const selectProject = useCallback(
    (project: TranslatedProject, rect: DOMRect, el: HTMLElement) => {
      isGlobalProjectOpen = true; // Bloqueamos inmediatamente al hacer click
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

  // 3. CERRAR
  const closeProject = useCallback(() => {
    isGlobalProjectOpen = false; // Liberamos
    setSelected(null);
    setRevealOrigin(false);

    if (replaceUrl) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("project");
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [replaceUrl, pathname, router, searchParams]);

  const markOriginRevealed = useCallback(() => {
    setRevealOrigin(true);
  }, []);

  return {
    selected,
    revealOrigin,
    selectProject,
    closeProject,
    markOriginRevealed,
  };
}