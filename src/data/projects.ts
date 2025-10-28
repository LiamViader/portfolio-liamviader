import { Metadata } from "next";

import { Locale, defaultLocale } from '@/i18n/routing';

// TODO: Make possible thta the detailed card has metadata, for SEO purposes, also make the detailed description be able to have html content or some formatting to be able to add links, bold, sections, media etc

export const project_categorys = ['AI', 'Game'] as const; 

export type ProjectCategory = typeof project_categorys[number]; 

// Structure of the translatable parts of a project
interface ProjectTranslations {
	title: string;
	short_description: string;
	full_description: string;
	role: string;
}



// Structure of a Project with all its data
interface ProjectMediaItem {
        src: string;
        alt?: string;
        caption?: string;
}

interface ProjectData {
        id: number;
        tags: string[]; // Tecnologys used etc
        media_preview: string; // URL of the preview image for the closed card
        github_url?: string;
        live_url?: string; // Live demo URL
        detailed_media: ProjectMediaItem[]; // Media items for the detailed view
        categorys: ProjectCategory[]; // Categories for filtering
        is_featured?: boolean; // Optional flag for featured projects

	// Object containing translations for each supported language
	translations: Record<Locale, ProjectTranslations>; 
}

// 4. El array de Proyectos
export const allProjects: ProjectData[] = [
	{
		id: 1,
		tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
		media_preview: "/images/testImage.jpg",
		github_url: "https://github.com/liam/project1",
		live_url: "https://project1-live.com",
                detailed_media: [
                        {
                                src: "/images/testImage.jpg",
                                alt: "Vista principal del proyecto 1",
                                caption: "Figura 1.1 — Vista general de la interfaz."
                        },
                        {
                                src: "/images/testImage.jpg",
                                alt: "Detalle del flujo de trabajo del proyecto 1",
                                caption: "Figura 1.2 — Flujo de trabajo destacado."
                        }
                ],
		categorys: ["AI", "Game"],
		is_featured: true,
		
		translations: {
			en: {
				title: "Example 1",
				short_description: "Short description. ASDW Sasdsadd wasdda efsdfsd vvcasdas efdfsdf",
				full_description: "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Full-Stack Developer & ML Engineer"
			},
			es: {
				title: "Ejemplo 1",
				short_description: "Descripcion corta. ASDW Sasdsadd wasdda efsdfsd vvcasdas efdfsdf",
				full_description: "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Desarrollador Full-Stack e Ingeniero de ML"
			}
		}
	},
	{
		id: 2,
		tags: ["Godot", "GdScript"],
		media_preview: "/images/testImage2.jpg",
		github_url: "https://github.com/liam/project1",
		live_url: "https://project1-live.com",
                detailed_media: [
                        {
                                src: "/images/testImage2.jpg",
                                alt: "Pantalla principal del juego 2",
                                caption: "Figura 2.1 — Gameplay en progreso."
                        },
                        {
                                src: "/images/testImage2.jpg",
                                alt: "Menú del juego 2",
                                caption: "Figura 2.2 — Menú principal y opciones."
                        }
                ],
		categorys: ["Game"],
		is_featured: true,
		
		translations: {
			en: {
				title: "Example 2",
				short_description: "Short description.",
				full_description: "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Full-Stack Developer & ML Engineer"
			},
			es: {
				title: "Ejemplo 2",
				short_description: "Descripcion corta.",
				full_description: "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Desarrollador Full-Stack e Ingeniero de ML"
			}
		}
	},
	{
		id: 3,
		tags: ["Godot", "GdScript"],
		media_preview: "/images/testImage2.jpg",
		github_url: "https://github.com/liam/project1",
		live_url: "https://project1-live.com",
                detailed_media: [
                        {
                                src: "/images/testImage2.jpg",
                                alt: "Pantalla principal del juego 3",
                                caption: "Figura 3.1 — Combate en tiempo real."
                        },
                        {
                                src: "/images/testImage2.jpg",
                                alt: "Tablero de progreso del juego 3",
                                caption: "Figura 3.2 — Progresión del jugador."
                        }
                ],
		categorys: ["Game"],
		is_featured: true,
		
		translations: {
			en: {
				title: "Example 3",
				short_description: "Short description.",
				full_description: "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Full-Stack Developer & ML Engineer"
			},
			es: {
				title: "Ejemplo 3",
				short_description: "Descripcion corta.",
				full_description: "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Desarrollador Full-Stack e Ingeniero de ML"
			}
		}
	},
		{
		id: 4,
		tags: ["Godot", "GdScript"],
		media_preview: "/images/testImage2.jpg",
		github_url: "https://github.com/liam/project1",
		live_url: "https://project1-live.com",
                detailed_media: [
                        {
                                src: "/images/testImage2.jpg",
                                alt: "Pantalla principal del juego 4",
                                caption: "Figura 4.1 — Exploración del mapa."
                        },
                        {
                                src: "/images/testImage2.jpg",
                                alt: "Configuración del juego 4",
                                caption: "Figura 4.2 — Ajustes personalizables."
                        }
                ],
		categorys: ["Game"],
		is_featured: true,
		
		translations: {
			en: {
				title: "Example 3",
				short_description: "Short description.",
				full_description: "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Full-Stack Developer & ML Engineer"
			},
			es: {
				title: "Ejemplo 3",
				short_description: "Descripcion corta.",
				full_description: "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Desarrollador Full-Stack e Ingeniero de ML"
			}
		}
	},
			{
		id: 5,
		tags: ["Godot", "GdScript"],
		media_preview: "/images/testImage2.jpg",
		github_url: "https://github.com/liam/project1",
		live_url: "https://project1-live.com",
                detailed_media: [
                        {
                                src: "/images/testImage2.jpg",
                                alt: "Pantalla principal del juego 5",
                                caption: "Figura 5.1 — Nivel inicial."
                        },
                        {
                                src: "/images/testImage2.jpg",
                                alt: "Detalle del mapa del juego 5",
                                caption: "Figura 5.2 — Vista del mapa estratégico."
                        }
                ],
		categorys: ["Game"],
		is_featured: true,
		
		translations: {
			en: {
				title: "Example 3",
				short_description: "Short description.",
				full_description: "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Full-Stack Developer & ML Engineer"
			},
			es: {
				title: "Ejemplo 3",
				short_description: "Descripcion corta.",
				full_description: "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				role: "Desarrollador Full-Stack e Ingeniero de ML"
			}
		}
	},
];

// Function to extract data with the correct translations based on locale
export type TranslatedProject = Omit<ProjectData, 'translations'> & ProjectTranslations;

export function getProjectsByLocale(locale: string): TranslatedProject[] {
	const currentLocale = locale as Locale;
	
	return allProjects.map(project => {
		const translatedTexts = project.translations[currentLocale] || project.translations[defaultLocale]; 
		
		return {
			...project,
			...translatedTexts,
			translations: undefined, 
		} as TranslatedProject;
	});
}