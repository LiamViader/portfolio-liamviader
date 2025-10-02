"use client";

import { useTranslations } from "next-intl";
import {ClientCategorySlug, CATEGORY_CONFIG } from '@/config/projectCategories';

interface CategorySwitcherProps {
    currentCategory: ClientCategorySlug;
    onCategoryChange: (category: ClientCategorySlug) => void;
}

export default function CategorySwitcher({ currentCategory, onCategoryChange }: CategorySwitcherProps) {
    const t = useTranslations("ProjectsPage");
    const categories = Object.values(CATEGORY_CONFIG);

    return (
        <div className="flex justify-center mb-10 p-1 bg-white/10 backdrop-blur-sm rounded-full shadow-lg max-w-lg mx-auto">
            {categories.map((cat) => {
                const isActive = currentCategory === cat.slug;
                
                return (
                    <button
                        key={cat.slug}
                        className={`
                            px-6 py-2 text-sm font-semibold rounded-full relative z-10 
                            transition-all duration-300 ease-out
                            ${isActive 
                                ? 'text-black bg-white shadow-md' 
                                : 'text-gray-200 hover:text-white'
                            }
                        `}
                        onClick={() => onCategoryChange(cat.slug)}
                    >
                        {t(cat.tKey)}
                    </button>
                );
            })}
        </div>
    );
}