"use client";

import { useState } from 'react';
import Header from './Header';


interface LayoutContentProps {
  children: React.ReactNode;
}


export default function LayoutContent({ children }: LayoutContentProps) {

  

  return (
    <>
      <Header/> 

      <main 
        className="flex-1" 
      >
        {children}
      </main>

      <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()} Liam Viader
      </footer>
    </>
  );
}