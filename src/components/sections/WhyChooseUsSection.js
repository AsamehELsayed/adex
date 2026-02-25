"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { iconMap } from "@/lib/lucide-icons";

const DEFAULT_ICON = iconMap.Target;

const WhyChooseUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultContent = {
    label: "The Adex Difference",
    title: "Why Leaders Choose\nto Partner With Us",
    reasons: [
      {
        icon: "Target",
        title: "Results-Driven Approach",
        description: "Every engagement is measured by tangible outcomes. We define success metrics upfront and hold ourselves accountable to delivering measurable impact.",
        stat: "94%",
        statLabel: "Client Satisfaction",
      },
      {
        icon: "Award",
        title: "Industry Expertise",
        description: "Our consultants bring deep domain knowledge across industries—from technology and healthcare to finance and manufacturing.",
        stat: "50+",
        statLabel: "Industries Served",
      },
      {
        icon: "Users",
        title: "Hands-On Execution",
        description: "We don't just deliver recommendations and walk away. Our team works alongside yours to ensure successful implementation.",
        stat: "200+",
        statLabel: "Projects Delivered",
      },
    ],
  };

  const { content } = useLocalizedContent("why-choose-us-section", defaultContent);
  const displayContent = content || defaultContent;
  const titleLines = displayContent.title?.split("\n") || ["Why Leaders Choose", "to Partner With Us"];

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-20"
        >
          <span className="label-uppercase mb-4 block">{displayContent.label}</span>
          <h2 className="heading-section">
            {titleLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </motion.div>

        {/* Reasons */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
          {(displayContent.reasons || []).map((reason, index) => {
            const IconComponent = typeof reason.icon === 'string' 
              ? iconMap[reason.icon] || DEFAULT_ICON 
              : reason.icon || DEFAULT_ICON;
            
            return (
              <motion.div
                key={reason.title || index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="relative"
              >
                {/* Decorative line */}
                <div className="hidden lg:block absolute -top-8 left-0 right-0 h-px bg-border">
                  <div
                    className="absolute left-0 h-full bg-accent"
                    style={{ width: `${(index + 1) * 33.33}%` }}
                  />
                </div>

                <div className="pt-8">
                  <IconComponent
                    size={32}
                    className="text-accent mb-6"
                    strokeWidth={1.5}
                  />
                  <h3 className="heading-subsection mb-4">{reason.title}</h3>
                  <p className="body-regular mb-8">{reason.description}</p>
                  <div className="pt-6 border-t border-border">
                    <span className="block font-serif text-4xl text-foreground mb-1">
                      {reason.stat}
                    </span>
                    <span className="text-sm text-muted-foreground tracking-wide">
                      {reason.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;

