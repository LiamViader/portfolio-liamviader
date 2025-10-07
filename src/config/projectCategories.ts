import * as THREE from 'three';

export const CATEGORY_INDICES = {
	'all': 0,
	'ai': 1,
	'games': 2,
} as const;

export type ClientCategorySlug = keyof typeof CATEGORY_INDICES; // 'all' | 'ai' | 'games'

export const CATEGORY_CONFIG = {
	all: { 
		slug: 'all' as const, 
		filterKey: null, 
		tKey: "all", 
		color: new THREE.Color('#0B0C10'),
		cssColor: 'text-gray-400'
	},
	ai: { 
		slug: 'ai' as const, 
		filterKey: 'AI', 
		tKey: "ai", 
		color: new THREE.Color('#003892'),
		cssColor: 'text-cyan-400',
	},
	games: { 
		slug: 'games' as const, 
		filterKey: 'Game', 
		tKey: "games", 
		color: new THREE.Color('#4a0060'),
		cssColor: 'text-fuchsia-400',
	},
} as const;

export const CATEGORY_COLORS = Object.values(CATEGORY_CONFIG).map(c => c.color);