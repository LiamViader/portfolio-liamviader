import { useEffect, useRef, useState } from 'react';
import { useSpring } from '@react-spring/web';
import { ClientCategorySlug } from '@/config/projectCategories';

export const useSceneTransition = (nextCategory: ClientCategorySlug) => {
  // from = escena que se está fundiendo OUT
  const [fromCategory, setFromCategory] = useState<ClientCategorySlug>(nextCategory);
  // to = escena que se está fundiendo IN (null si no hay transición)
  const [toCategory, setToCategory] = useState<ClientCategorySlug | null>(null);

  // refs para leer el estado vigente dentro de callbacks sin forzar reruns del useEffect
  const fromRef = useRef(fromCategory);
  const toRef = useRef(toCategory);
  useEffect(() => { fromRef.current = fromCategory; }, [fromCategory]);
  useEffect(() => { toRef.current = toCategory; }, [toCategory]);

  // useSpring + api para control imperativo (más robusto para interrupts)
  const [styles, api] = useSpring(() => ({ progress: 1 }));
  const progress = styles.progress; // se utiliza en componentes (progress.get())

  useEffect(() => {
    // Queremos reaccionar SOLO cuando nextCategory cambia
    const currentFrom = fromRef.current;
    const currentTo = toRef.current;

    // Si ya estamos exactamente en esa combinación, no hacemos nada
    if (nextCategory === currentTo || (currentTo === null && nextCategory === currentFrom)) {
      return;
    }

    // Helper para arrancar la animación y proteger onRest de stale completions
    const startTransition = (targetTo: ClientCategorySlug) => {
      const startedTo = targetTo; // captura local para comprobar en onRest
      api.start({
        from: { progress: 0 },
        to: { progress: 1 },
        reset: true,
        config: { duration: 800, tension: 120, friction: 14 },
        onRest: () => {
          // Solo aceptar la finalización si la toCategory vigente es la que iniciamos.
          if (toRef.current === startedTo) {
            setFromCategory(startedTo);
            setToCategory(null);
          }
        },
      });
    };

    if (!currentTo) {
      // No hay transición en curso: arrancamos de currentFrom -> nextCategory
      setToCategory(nextCategory);
      startTransition(nextCategory);
    } else {
      // Ya hay una transición en curso: calculamos cuál escena es la dominante
      // para que la nueva transición parta desde lo que realmente se está viendo.
      const p = (progress as any).get ? (progress as any).get() : 0;
      const dominant = p < 0.5 ? currentFrom : currentTo;

      setFromCategory(dominant);
      setToCategory(nextCategory);
      startTransition(nextCategory);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextCategory]); // <-- intencional: solo cuando nextCategory cambia

  // Para compatibilidad con tu render existente:
  const previousCategory = fromCategory;
  const currentCategory = toCategory ?? fromCategory;

  return { progress, previousCategory, currentCategory };
};
