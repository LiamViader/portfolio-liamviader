"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";



export default function Header() {

  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  const [transitionDurationMs, setTransitionDurationMs] = useState(100);
  const [yOffset, setYOffset] = useState(0);



  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const currentHeader = headerRef.current;
    
    if (currentHeader) {
      const initialHeight = currentHeader.offsetHeight;

      const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const height = currentHeader.offsetHeight; 
        setHeaderHeight(height);
      });

      observer.observe(currentHeader);

      return () => observer.unobserve(currentHeader);
    }
    return () => {}; 
  }, [headerHeight]);

  useEffect(() => {

    if (isMenuOpen) {
      setYOffset(0); 
      return; 
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxOffset = headerHeight;

      const deltaY = currentScrollY - lastScrollY;
      if (headerHeight !==0){
        if (deltaY > 0) { // Scrolling down
          if (currentScrollY > headerHeight) {
            setYOffset(-maxOffset);
            setTransitionDurationMs(400);
          }
          else{
            setYOffset(-currentScrollY);
            setTransitionDurationMs(0);
          }
        }
        else { // Scrolling up
          if (currentScrollY > headerHeight) {
            setYOffset(0);
            setTransitionDurationMs(400);
          }
          else{
            setYOffset(0);
            setTransitionDurationMs(0);
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
