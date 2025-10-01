"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Navbar from "./Navbar";

const INITIAL_HEADER_HEIGHT = 73; 

export default function Header() {

  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(INITIAL_HEADER_HEIGHT);

  const [transitionDurationMs, setTransitionDurationMs] = useState(100);
  const [yOffset, setYOffset] = useState(0);



  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const calculateAndSetHeight = () => {
    if (typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 768; 
      const newHeight = isDesktop ? 73 : 65;
      const actualMeasuredHeight = headerRef.current?.offsetHeight ?? newHeight;
      setHeaderHeight(actualMeasuredHeight);
    }
  };

  useLayoutEffect(() => {
    calculateAndSetHeight();
    window.addEventListener('resize', calculateAndSetHeight);
    return () => window.removeEventListener('resize', calculateAndSetHeight);
  }, []);

  useEffect(() => {

    if (isMenuOpen) {
      setYOffset(0); 
      return; 
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxOffset = headerHeight;

      const deltaY = currentScrollY - lastScrollY;
      const PIXEL_PER_MS = 20; // Ajusta este valor para cambiar la sensibilidad del desplazamiento


      if (headerHeight !==0){
        if (deltaY > 0) { // Scrolling down
          if (currentScrollY > headerHeight) {
            setYOffset(-maxOffset);
            setTransitionDurationMs(200);
          }
          else{
            const wasAligned = Math.abs(yOffset + lastScrollY) < 5;
            setYOffset(-currentScrollY);
            if (wasAligned){
              setTransitionDurationMs(0);
            }
            else{
              setTransitionDurationMs(50);
            }
          }
        }
        else { // Scrolling up
          if (currentScrollY > headerHeight) {
            setYOffset(0);
            setTransitionDurationMs(200);
          }
          else{
            if (yOffset <= 10){
              setYOffset(0);
              setTransitionDurationMs(200);
            }
            else{
              setYOffset(0);
              setTransitionDurationMs(0);
            }
          }
        }
      }
      console.log("Scroll Y:", currentScrollY, "Header Height:", headerHeight);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMenuOpen, headerHeight]);




  return (
    <div style={{ height: `${headerHeight}px` }}>
      <header
          ref={headerRef}
          className={`fixed top-0 left-0 w-full px-4 md:px-8 py-3 md:py-5 flex justify-between items-center border-b border-gray-800 bg-gray-50 z-50 transition-transform `}
          style={{ 
            transform: `translateY(${yOffset}px)`,
            transitionDuration: `${transitionDurationMs}ms` 
          }}
      >
          <h1 className="font-bold text-lg md:text-xl">Liam Viader</h1>
          <Navbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </header>
    </div>
  );
}
