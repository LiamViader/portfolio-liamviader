import { useEffect, useRef, useState } from "react";

import { CATEGORY_CONFIG, ClientCategorySlug } from "@/config/projectCategories";

interface HighlightStyle {
  width: number;
  left: number;
  backgroundColor: string;
}

export function useCategoryHighlight(currentCategory: ClientCategorySlug) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>({
    width: 0,
    left: 0,
    backgroundColor: CATEGORY_CONFIG[currentCategory].colorButton.getStyle(),
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector<HTMLButtonElement>("button[data-active='true']");
    if (!activeBtn) return;

    const rect = activeBtn.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();

    setHighlightStyle({
      width: rect.width,
      left: rect.left - parentRect.left,
      backgroundColor: CATEGORY_CONFIG[currentCategory].colorButton.getStyle(),
    });
  }, [currentCategory]);

  return { containerRef, highlightStyle };
}
