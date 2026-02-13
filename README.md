# Liam Viader | Personal Portfolio

A modern, high-performance, and multilingual portfolio built with **Next.js 15**, **Three.js**, and **Tailwind CSS 4**. This project showcases my journey as a developer, featuring interactive 3D elements, smooth animations, and a curated selection of my best work.

## Features

- **Multilingual Support**: Fully localized in English and Spanish using `next-intl`.
- **3D Experiences**: Integrated 3D components and post-processing effects using React Three Fiber and Three.js.
- **Fluid UI/UX**: Crafted with Tailwind CSS 4 and Framer Motion for a responsive feel.
- **Dynamic Projects Showcase**: A modular data-driven project gallery with detailed descriptions.
- **Performance Optimized**: Built on the Next.js App Router for fast loading and SEO friendliness.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Graphics**: [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Local Development

### Prerequisites

- Node.js (v18+ recommended)
- npm, yarn, or pnpm

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/LiamViader/portfolio-liamviader.git
   cd portfolio-liamviader
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/[locale]`: Main routing and page layouts (localized).
- `src/components`: Reusable UI and 3D components.
- `src/data`: Static project data and definitions.
- `messages/`: Translation files (i18n).
- `public/`: Static assets (images, icons, etc.).

---

Developed by [Liam Viader](https://github.com/LiamViader).
