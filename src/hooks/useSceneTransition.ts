import { useState, useEffect } from 'react';
import { useSpring } from '@react-spring/web'; 

import { ClientCategorySlug, CATEGORY_INDICES } from '@/config/projectCategories'; 

export const useSceneTransition = (currentCategory: ClientCategorySlug) => {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(CATEGORY_INDICES[currentCategory]);

    useEffect(() => {
        setActiveCategoryIndex(CATEGORY_INDICES[currentCategory]);
    }, [currentCategory]);

    const { mixFactor } = useSpring({
        mixFactor: activeCategoryIndex,
        config: { duration: 800, tension: 120, friction: 14 }
    });

    return mixFactor;
};