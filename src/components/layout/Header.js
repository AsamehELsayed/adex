"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Vision", path: "/vision" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-elegant-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container-luxury">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center">
            <Image
              src="/logo.png"
              alt="Adex Consulting"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative font-sans text-sm tracking-wide transition-colors duration-300 ${
                  pathname === link.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                {pathname === link.path && (
                  <motion.span
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button variant="premium" size="premium" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative z-50 p-2.5 rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-200"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </nav>

        {/* Mobile Menu Overlay & Content */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 200,
                  duration: 0.4 
                }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background/98 backdrop-blur-xl shadow-2xl z-50 lg:hidden overflow-y-auto"
              >
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <Link 
                      href="/" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center"
                    >
                      <Image
                        src="/logo.png"
                        alt="Adex Consulting"
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain"
                        priority
                      />
                    </Link>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors duration-200"
                      aria-label="Close menu"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 px-6 py-8 flex flex-col gap-2">
                    {navLinks.map((link, index) => {
                      const isActive = pathname === link.path;
                      return (
                        <motion.div
                          key={link.path}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: index * 0.05,
                            duration: 0.3 
                          }}
                        >
                          <Link
                            href={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`group relative flex items-center py-4 px-4 rounded-lg font-sans text-lg tracking-wide transition-all duration-300 ${
                              isActive
                                ? "text-foreground bg-muted/50"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            }`}
                          >
                            {link.name}
                            {isActive && (
                              <motion.div
                                layoutId="mobileActiveIndicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full"
                                initial={false}
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            <motion.div
                              className="absolute inset-0 rounded-lg border border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              whileHover={{ scale: 1.02 }}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* CTA Button */}
                  <div className="p-6 border-t border-border">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Button 
                        variant="premium" 
                        size="premium" 
                        className="w-full" 
                        asChild
                      >
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                          Get in Touch
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

