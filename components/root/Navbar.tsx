"use client";

import { useState } from "react";
import Image from "next/image";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

// Navigation items
const navItems = ["Home", "About", "Portfolio", "Contact"];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed w-full z-50 bg-gray-900/30 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            className="relative w-12 h-12 cursor-pointer"
            onClick={() => scroll.scrollToTop()}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={50}
              objectFit="contain"
              priority
            />
          </ScrollLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavItem key={item} item={item} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-purple-400 focus:outline-none focus:text-purple-400"
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <X />
              ) : (
                <Menu />
                // <p>dccddc</p>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-gray-900/50 backdrop-blur-md"
          >
            {navItems.map((item) => (
              <ScrollLink
                key={item}
                to={item.toLowerCase()}
                spy={true}
                smooth={true}
                duration={200}
                onClick={closeMenu}
                className="block w-full text-left py-3 px-6 text-sm font-medium transition-colors hover:text-purple-400 text-gray-300 cursor-pointer"
                activeClass="text-purple-400"
              >
                {item}
              </ScrollLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// NavItem component for desktop navigation
function NavItem({ item }: { item: string }) {
  return (
    <ScrollLink
      to={item.toLowerCase()}
      spy={true}
      smooth={true}
      duration={200}
      className="text-sm font-medium transition-colors hover:text-purple-400 text-gray-300 cursor-pointer"
      activeClass="text-purple-400"
    >
      {item}
    </ScrollLink>
  );
}
