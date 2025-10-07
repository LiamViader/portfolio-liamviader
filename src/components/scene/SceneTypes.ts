import { SpringValue, Interpolation } from '@react-spring/three';

export interface SceneProps {
  opacity: Interpolation<number, number>;
  transitionProgress: SpringValue<number>; // Progress from 0 to 1
  isVisible: boolean; // If this scene is the destination of transition
}
