import { useState, useEffect } from 'react';
import { useSpring } from '@react-spring/web';
import { ClientCategorySlug, CATEGORY_INDICES } from '@/config/projectCategories';

export const useSceneTransition = (currentCategory: ClientCategorySlug) => {
	const [previousIndex, setPreviousIndex] = useState(CATEGORY_INDICES[currentCategory]);
	const [currentIndex, setCurrentIndex] = useState(CATEGORY_INDICES[currentCategory]);

	useEffect(() => {
		setPreviousIndex(currentIndex);
		setCurrentIndex(CATEGORY_INDICES[currentCategory]);
	}, [currentCategory]);

	const { progress } = useSpring({
		from: { progress: 0 },
		to: { progress: 1 },
		reset: true,
		config: { duration: 800, tension: 120, friction: 14 },
	});

	return { progress, previousIndex, currentIndex };
};