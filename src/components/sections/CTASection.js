"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocalizedContent } from "@/hooks/use-localized-content";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultContent = {
    label: "Ready to Transform?",
    title: "Let's Build Your\nNext Chapter",
    description: "Every great transformation begins with a conversation. Share your vision with us, and together we'll chart the path forward.",
    primaryButton: "Schedule a Consultation",
    secondaryButton: "View Our Services",
  };

  const { content } = useLocalizedContent("cta-section", defaultContent);
  const displayContent = content || defaultContent;
  const titleLines = displayContent.title?.split("\n") || ["Let's Build Your", "Next Chapter"];

  return (
    <section
      ref={ref}
      className="section-padding bg-primary text-primary-foreground relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container-luxury relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-block text-accent text-sm tracking-[0.2em] uppercase mb-6">
            {displayContent.label}
          </span>
          <h2 className="heading-section mb-8">
            {titleLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            {displayContent.description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="premium-gold"
              size="premium"
              asChild
            >
              <Link href="/contact">
                {displayContent.primaryButton}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button
              variant="premium-outline"
              size="premium"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/services">{displayContent.secondaryButton}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

