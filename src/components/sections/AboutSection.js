"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLocalizedContent } from "@/hooks/use-localized-content";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultContent = {
    label: "About Our Firm",
    title: "Your Strategic Partner\nfor Lasting Impact",
    description1: "Adex Consulting stands apart as a strategic partner, not merely a consultant. We embed ourselves in your organization's vision, challenges, and aspirations.",
    description2: "Our team of seasoned executives and industry specialists brings decades of hands-on experience across Fortune 500 companies, high-growth startups, and global enterprises. We don't just advise—we execute alongside you.",
    linkText: "Learn More About Us",
    statNumber: "25+",
    statLabel: "Years of Excellence",
  };

  const { content } = useLocalizedContent("about-section", defaultContent);
  const displayContent = content || defaultContent;
  const titleLines = displayContent.title?.split("\n") || ["Your Strategic Partner", "for Lasting Impact"];

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden">
              <Image
                src={displayContent.image || "/team-meeting.jpg"}
                alt="Executive team in strategic discussion"
                fill
                className="object-cover"
              />
              {/* Decorative frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-accent -z-10" />
            </div>
            {/* Stats overlay */}
            <div className="absolute -bottom-8 -left-8 bg-primary text-primary-foreground p-8 shadow-elegant-xl">
              <span className="block font-serif text-5xl mb-2">{displayContent.statNumber}</span>
              <span className="text-sm tracking-wide text-primary-foreground/70">
                {displayContent.statLabel}
              </span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="label-uppercase mb-4 block">{displayContent.label}</span>
            <h2 className="heading-section mb-8">
              {titleLines.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <div className="space-y-6 mb-10">
              <p className="body-large">
                {displayContent.description1}
              </p>
              <p className="body-regular">
                {displayContent.description2}
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-foreground font-medium tracking-wide hover:text-accent transition-colors duration-300 group"
            >
              {displayContent.linkText}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

