"use client";

import { useState } from 'react';
import Header from './Header';
import { ModalProvider } from '@/providers/ModalContext';
import CustomScrollArea from './CustomScrollArea';

interface LayoutContentProps {
  children: React.ReactNode;
}


export default function LayoutContent({ children }: LayoutContentProps) {
  return (
    <ModalProvider>
      <Header />
      <CustomScrollArea fillViewport>
        <div className="relative">
          <main className="relative">
            {children}
          </main>

          <footer
            className="
              absolute inset-x-0 bottom-0 z-20
              border-t border-white/10
              backdrop-blur-sm
              p-4 text-center text-sm text-gray-300
            "
          >
            <span className="pointer-events-none absolute -top-8 inset-x-0 h-8" />
            {new Date().getFullYear()} Liam Viader
          </footer>
        </div>
      </CustomScrollArea>
    </ModalProvider>
  );
}