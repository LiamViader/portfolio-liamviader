import { useEffect, useRef, useState } from 'react';
import { easings, useSpringValue } from '@react-spring/web';
import { ClientCategorySlug } from '@/config/projectCategories';

export const useSceneTransition = (targetCategory: ClientCategorySlug) => {
  const [prevCategory, setPrevCategory] = useState<ClientCategorySlug>(targetCategory);
  const [currCategory, setCurrCategory] = useState<ClientCategorySlug>(targetCategory);
  const transitionIdRef = useRef(0);

  const progress = useSpringValue(1, {
    config: {
      duration: 550,
      easing: easings.easeInOutCubic,
    },
  });

  useEffect(() => {
    if (targetCategory === currCategory) return;

    const transitionId = ++transitionIdRef.current;

    setPrevCategory(currCategory);
    setCurrCategory(targetCategory);

    progress.stop(true);
    progress.start(1, {
      from: 0,
      reset: true,
      onRest: () => {
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