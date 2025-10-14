import { useCallback, useState } from "react";

import { TranslatedProject } from "@/data/projects";

interface SelectedProjectState {
  project: TranslatedProject;
  rect: DOMRect;
  el: HTMLElement;
}

export function useProjectSelection() {
  const [selected, setSelected] = useState<SelectedProjectState | null>(null);
  const [revealOrigin, setRevealOrigin] = useState(false);

  const selectProject = useCallback((project: TranslatedProject, rect: DOMRect, el: HTMLElement) => {
    setRevealOrigin(false);
    setSelected((current) => current ?? { project, rect, el });
  }, []);

  const closeProject = useCallback(() => {
    setSelected(null);
    setRevealOrigin(false);
  }, []);

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
