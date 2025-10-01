"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";

export default function Header() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      setShow(true); 
      return; 
    }
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 30) {
        // Always show near the top
        setShow(true);
      } else if (currentScrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full px-4 md:px-8 py-3 md:py-5 flex justify-between items-center border-b border-gray-800 bg-gray-50 z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <h1 className="font-bold text-lg md:text-xl">Liam Viader</h1>
      <Navbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </header>
  );
}
