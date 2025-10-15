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
    <>
      <ModalProvider>
        <Header/> 
        <CustomScrollArea fillViewport>
          <main 
            className="flex-1" 
          >
            {children}
          </main>
          <footer className="z-20 p-4 text-center text-sm text-gray-400 border-t border-white/20 bg-black backdrop-blur-xl">
            {new Date().getFullYear()} Liam Viader
          </footer>
        </CustomScrollArea>
      </ModalProvider>
    </>
  );
}