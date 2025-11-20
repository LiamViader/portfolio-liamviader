import { useEffect, useRef, useState } from 'react';
import { useSpring } from '@react-spring/web';
import { ClientCategorySlug } from '@/config/projectCategories';

export const useSceneTransition = (nextCategory: ClientCategorySlug) => {
  const [fromCategory, setFromCategory] = useState<ClientCategorySlug>(nextCategory);
  const [currentCategory, setCurrentCategory] = useState<ClientCategorySlug>(nextCategory);

  const categoryRef = useRef(nextCategory);

  const [styles, api] = useSpring(() => ({ 
    progress: 1,
    config: { duration: 800, tension: 120, friction: 14 }
  }));

  useEffect(() => {
    if (categoryRef.current === nextCategory) return;
    categoryRef.current = nextCategory;

    const currentProgress = styles.progress.get();

    let nextFrom = fromCategory;
    
    if (currentProgress > 0.5) {
      nextFrom = currentCategory;
    }

    setFromCategory(nextFrom);
    setCurrentCategory(nextCategory);

    api.start({
      from: { progress: 0 },
      to: { progress: 1 },
      reset: true,
    });

  }, [nextCategory, api, fromCategory, currentCategory, styles.progress]);

  return { 
    progress: styles.progress, 
    previousCategory: fromCategory, 
    currentCategory: currentCategory 
  };
};