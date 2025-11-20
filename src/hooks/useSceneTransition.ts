import { useEffect, useRef, useState } from 'react';
import { easings, useSpringValue } from '@react-spring/web';
import { ClientCategorySlug } from '@/config/projectCategories';

export const useSceneTransition = (targetCategory: ClientCategorySlug) => {
  const [prevCategory, setPrevCategory] = useState<ClientCategorySlug>(targetCategory);
  const [currCategory, setCurrCategory] = useState<ClientCategorySlug>(targetCategory);
  const transitionIdRef = useRef(0);

  const progress = useSpringValue(1, {
    config: {
      duration: 650,
      easing: easings.easeInOutCubic,
    },
  });

  useEffect(() => {
    if (targetCategory === currCategory) return;

    // Guardamos un identificador para ignorar finalizaciones de transiciones antiguas.
    const transitionId = ++transitionIdRef.current;

    // Siempre usamos la categoría actual como "anterior" para evitar flashes
    // al encadenar cambios de filtro rápidamente.
    setPrevCategory(currCategory);
    setCurrCategory(targetCategory);

    progress.stop(true);
    progress.start(1, {
      from: 0,
      reset: true,
      onRest: () => {
        // Solo consolidamos cuando esta es la última transición iniciada.
        if (transitionIdRef.current !== transitionId) return;
        setPrevCategory(targetCategory);
      },
    });
  }, [targetCategory, currCategory, progress]);

  return {
    progress,
    previousCategory: prevCategory,
    currentCategory: currCategory,
  };
};