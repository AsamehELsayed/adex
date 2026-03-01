"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocalizedContent } from "@/hooks/use-localized-content";

const HeroSection = () => {
  const defaultContent = {
    label: "Strategic Consulting",
    title: "Where Strategy\nMeets Execution",
    description: "We partner with visionary leaders to transform ambitious strategies into measurable outcomes. Your success is our commitment.",
    primaryButton: "Start a Conversation",
    secondaryButton: "Explore Services",
    scrollText: "Scroll",
  };

  const { content, isLoading } = useLocalizedContent("hero-section", defaultContent);
  const displayContent = content || defaultContent;

  // Split title by \n for line breaks
  const titleLines = displayContent.title?.split("\n") || ["Where Strategy", "Meets Execution"];

  if (isLoading && !content) {
    return (
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="container-luxury relative z-10 pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="h-8 bg-muted animate-pulse mb-6 w-48" />
            <div className="h-16 bg-muted animate-pulse mb-8 w-full" />
            <div className="h-24 bg-muted animate-pulse mb-12 w-full" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={displayContent.backgroundImage || "/hero-consulting.jpg"}
          alt="Executive boardroom overlooking city skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="container-luxury relative z-10 pt-32 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="label-uppercase mb-6 block">
              {displayContent.label}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="heading-display mb-8 text-foreground"
          >
            {titleLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
            {titleLines.length === 1 && (
              <span className="relative inline-block">
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-accent origin-left animate-line-expand" />
              </span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="body-large max-w-xl mb-12"
          >
            {displayContent.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="hero" size="premium" asChild>
              <Link href="/contact">
                {displayContent.primaryButton}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="premium" asChild>
              <Link href="/services">{displayContent.secondaryButton}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs tracking-widest uppercase text-muted-foreground">
            {displayContent.scrollText}
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

