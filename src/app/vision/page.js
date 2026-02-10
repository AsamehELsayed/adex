"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Compass, Lightbulb, Shield, Globe, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useContent } from "@/hooks/use-content";

// Icon mapping for dynamic icon rendering
const iconMap = {
  Lightbulb,
  Shield,
  Globe,
  Heart,
  Eye,
  Compass,
  // Add more icons as needed - just import them above and add to this map
};

// Default content (mirrors VisionPageEditor defaults)
const defaultContent = {
  hero: {
    label: "Vision & Values",
    title: "Guided by Purpose,\nDriven by Excellence",
    description: "Our vision and values shape everything we do—from how we engage with clients to how we develop our people and contribute to the business community.",
  },
  vision: {
    label: "Our Vision",
    title: "To Be the Catalyst\nfor Transformational Change",
    description: "We envision a world where every organization has access to the strategic insight and execution capability needed to realize its full potential. We aim to be the partner that makes that possible.",
  },
  mission: {
    label: "Our Mission",
    title: "Empowering Leaders\nto Achieve the Extraordinary",
    description: "We partner with visionary leaders to transform ambitious strategies into measurable outcomes, building organizations that thrive in an ever-changing world.",
  },
  values: {
    label: "Core Values",
    title: "The Principles We Live By",
    values: [
      {
        icon: "Lightbulb",
        title: "Innovation",
        description: "We embrace new ideas and methodologies, constantly evolving to deliver cutting-edge solutions.",
      },
      {
        icon: "Shield",
        title: "Integrity",
        description: "Honest counsel and ethical practice form the foundation of every client relationship.",
      },
      {
        icon: "Globe",
        title: "Global Perspective",
        description: "We bring international expertise and diverse viewpoints to every engagement.",
      },
      {
        icon: "Heart",
        title: "Partnership",
        description: "We succeed when our clients succeed. Their objectives become our objectives.",
      },
    ],
  },
  commitment: {
    label: "Our Commitment",
    title: "Results That Matter,\nRelationships That Last",
    description: "We believe that true success is measured not just by the results we deliver, but by the lasting relationships we build with our clients. Every engagement is an opportunity to create value that endures.",
    buttonText: "Partner With Us",
  },
};

export default function Vision() {
  const { content } = useContent("vision-page", defaultContent);
  const displayContent = content || defaultContent;

  const hero = displayContent.hero || defaultContent.hero;
  const vision = displayContent.vision || defaultContent.vision;
  const mission = displayContent.mission || defaultContent.mission;
  const valuesSection = displayContent.values || defaultContent.values;
  const commitment = displayContent.commitment || defaultContent.commitment;

  // Helper function to get icon component from string name
  const getIcon = (iconName) => {
    if (!iconName) return Lightbulb;
    return iconMap[iconName] || Lightbulb;
  };

  const heroTitleLines = typeof hero.title === "string" && hero.title.length > 0
    ? hero.title.split("\n")
    : ["Guided by Purpose", "Driven by Excellence"];

  const visionTitleLines = typeof vision.title === "string" && vision.title.length > 0
    ? vision.title.split("\n")
    : ["To Be the Catalyst", "for Transformational Change"];

  const missionTitleLines = typeof mission.title === "string" && mission.title.length > 0
    ? mission.title.split("\n")
    : ["Empowering Leaders", "to Achieve the Extraordinary"];

  const commitmentTitleLines = typeof commitment.title === "string" && commitment.title.length > 0
    ? commitment.title.split("\n")
    : ["Results That Matter", "Relationships That Last"];
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-40 pb-20 bg-background relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 opacity-30">
          <Image
            src="/abstract-strategy.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container-luxury relative z-10">
          <div className="max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="label-uppercase mb-6 block"
            >
              {hero.label}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-display mb-8"
            >
              {heroTitleLines.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < heroTitleLines.length - 1 && <br />}
                </span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-large max-w-2xl"
            >
              {hero.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="section-padding bg-secondary">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-accent text-accent-foreground">
                <Eye size={32} />
              </div>
              <div>
                <span className="label-uppercase mb-4 block">{vision.label}</span>
                <h2 className="heading-section mb-6">
                  {visionTitleLines.map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < visionTitleLines.length - 1 && <br />}
                    </span>
                  ))}
                </h2>
                <p className="body-large">
                  {vision.description}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-primary text-primary-foreground">
                <Compass size={32} />
              </div>
              <div>
                <span className="label-uppercase mb-4 block">{mission.label}</span>
                <h2 className="heading-section mb-6">
                  {missionTitleLines.map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < missionTitleLines.length - 1 && <br />}
                    </span>
                  ))}
                </h2>
                <p className="body-large">
                  {mission.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="label-uppercase mb-4 block">{valuesSection.label}</span>
            <h2 className="heading-section">
              {(valuesSection.title || "").split("\n").map((line, index, arr) => (
                <span key={index}>
                  {line}
                  {index < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(valuesSection.values || []).map((value, index) => {
              const IconComponent = getIcon(value.icon);
              return (
                <motion.div
                  key={value.title || index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-8 border border-border hover:border-accent/50 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-secondary group-hover:bg-accent/10 transition-colors duration-300">
                    <IconComponent
                      size={28}
                      className="text-accent"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="heading-subsection mb-4">{value.title}</h3>
                  <p className="body-regular">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block text-accent text-sm tracking-[0.2em] uppercase mb-6">
              {commitment.label}
            </span>
            <h2 className="heading-section mb-8">
              {commitmentTitleLines.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < commitmentTitleLines.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              {commitment.description}
            </p>
            <Button variant="premium-gold" size="premium" asChild>
              <Link href="/contact">
                {commitment.buttonText}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}





