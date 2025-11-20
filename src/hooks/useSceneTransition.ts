import { useEffect, useRef, useState } from 'react';
import { useSpring } from '@react-spring/web';
import { ClientCategorySlug } from '@/config/projectCategories';

export const useSceneTransition = (targetCategory: ClientCategorySlug) => {
  const [prevCategory, setPrevCategory] = useState<ClientCategorySlug>(targetCategory);
  const [currCategory, setCurrCategory] = useState<ClientCategorySlug>(targetCategory);

  const progressRef = useRef(0);

  const [styles, api] = useSpring(() => ({ 
    progress: 1,
    config: { duration: 500, tension: 120, friction: 20 },
    onChange: (result) => {
      progressRef.current = result.value.progress;
    }
  }));

  useEffect(() => {
    if (targetCategory === currCategory) return;

    const currentP = progressRef.current;
    let nextPrev = prevCategory;
    if (currentP > 0.5) {
       nextPrev = currCategory;
    } 
    
    if (targetCategory === prevCategory) {
       nextPrev = currCategory;
    }

    setPrevCategory(nextPrev);
    setCurrCategory(targetCategory);

    api.set({ progress: 0 });
    progressRef.current = 0;

    api.start({
      to: { progress: 1 },
    });

  }, [targetCategory, currCategory, prevCategory, api]);

  return { 
    progress: styles.progress, 
    previousCategory: prevCategory, 
    currentCategory: currCategory 
  };
};