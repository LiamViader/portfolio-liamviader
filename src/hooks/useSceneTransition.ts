import { useEffect, useRef, useState } from 'react';
import { easings, useSpringValue } from '@react-spring/web';
import { ClientCategorySlug } from '@/config/projectCategories';

export const useSceneTransition = (targetCategory: ClientCategorySlug) => {
  const [prevCategory, setPrevCategory] = useState<ClientCategorySlug>(targetCategory);
  const [currCategory, setCurrCategory] = useState<ClientCategorySlug>(targetCategory);

  const progressRef = useRef(0);

  const progress = useSpringValue(1, {
    config: {
      duration: 650,
      easing: easings.easeInOutCubic,
    },
    onChange: (value) => {
      progressRef.current = value;
    },
  });

  useEffect(() => {
    if (targetCategory === currCategory) return;

    // Siempre usamos la categoría actual como "anterior" para evitar flashes
    // al encadenar cambios de filtro rápidamente.
    setPrevCategory(currCategory);
    setCurrCategory(targetCategory);

    progress.stop(true);
    progressRef.current = 0;
    progress.set(0);
    progress.start(1);

  }, [targetCategory, currCategory, progress]);

  return {
    progress,
    previousCategory: prevCategory,
    currentCategory: currCategory
  };
};