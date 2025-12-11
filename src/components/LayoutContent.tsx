"use client";

import Header from './Header';
import { ModalProvider } from '@/providers/ModalContext';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  return (
    <ModalProvider>
      <Header />
      <div className="relative min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>

          <footer
            className="
              absolute bottom-0 w-full z-20
              border-t border-white/10
              backdrop-blur-sm
              p-4 text-center text-sm text-gray-300
            "
          >
            <span className="pointer-events-none absolute -top-8 inset-x-0 h-8" />
            
            {new Date().getFullYear()} Liam Viader
          </footer>
      </div>
    </ModalProvider>
  );
}