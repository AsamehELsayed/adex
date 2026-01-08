"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, RefreshCw, Settings, Expand, ChevronRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: TrendingUp,
    title: "Strategy Consulting",
    subtitle: "Define Your Competitive Edge",
    description:
      "In today's rapidly evolving markets, strategy isn't just about planning—it's about building adaptable frameworks that respond to change while maintaining focus on long-term objectives.",
    capabilities: [
      "Corporate & Business Unit Strategy",
      "Market Entry & Expansion Planning",
      "Competitive Positioning",
      "Strategic Partnerships & M&A Advisory",
      "Scenario Planning & Risk Assessment",
    ],
  },
  {
    icon: RefreshCw,
    title: "Business Transformation",
    subtitle: "Navigate Change with Confidence",
    description:
      "Transformation initiatives fail when execution doesn't match ambition. We guide organizations through complex change programs, ensuring lasting impact across technology, culture, and operations.",
    capabilities: [
      "Digital Transformation",
      "Organizational Restructuring",
      "Change Management",
      "Culture & Leadership Development",
      "Post-Merger Integration",
    ],
  },
  {
    icon: Settings,
    title: "Operational Excellence",
    subtitle: "Maximize Efficiency & Quality",
    description:
      "Operational excellence isn't about cutting corners—it's about creating systems that deliver consistently superior results while eliminating waste and reducing costs.",
    capabilities: [
      "Process Optimization & Automation",
      "Supply Chain Transformation",
      "Cost Reduction Programs",
      "Quality Management Systems",
      "Performance Management",
    ],
  },
  {
    icon: Expand,
    title: "Growth & Expansion",
    subtitle: "Scale with Strategic Precision",
    description:
      "Growth requires more than ambition. We help organizations identify opportunities, build capabilities, and execute expansion strategies that deliver sustainable results.",
    capabilities: [
      "New Market Entry",
      "Product & Service Innovation",
      "Revenue Optimization",
      "Customer Experience Enhancement",
      "Channel Strategy & Development",
    ],
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-40 pb-20 bg-background">
        <div className="container-luxury">
          <div className="max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="label-uppercase mb-6 block"
            >
              Our Services
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-display mb-8"
            >
              Comprehensive Solutions
              <br />
              for Complex Challenges
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-large max-w-2xl"
            >
              We deliver end-to-end consulting services that address your most
              pressing business challenges and unlock new opportunities for
              sustainable growth.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="pb-20">
        {services.map((service, index) => (
          <div
            key={service.title}
            className={`section-padding ${
              index % 2 === 0 ? "bg-background" : "bg-secondary"
            }`}
          >
            <div className="container-luxury">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid lg:grid-cols-2 gap-16 lg:gap-24"
              >
                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 flex items-center justify-center bg-accent/10 text-accent">
                      <service.icon size={28} />
                    </div>
                    <span className="text-sm text-muted-foreground tracking-wide">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="heading-section mb-4">{service.title}</h2>
                  <p className="text-accent text-lg mb-6">{service.subtitle}</p>
                  <p className="body-large mb-10">{service.description}</p>
                  <Button variant="premium" size="premium" asChild>
                    <Link href="/contact">
                      Discuss Your Needs
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>

                {/* Capabilities */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="bg-card border border-border p-10">
                    <h3 className="text-sm font-sans font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-8">
                      Core Capabilities
                    </h3>
                    <ul className="space-y-5">
                      {service.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="flex items-center gap-4 text-foreground"
                        >
                          <ChevronRight
                            size={16}
                            className="text-accent flex-shrink-0"
                          />
                          <span className="font-sans">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-luxury text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="heading-section mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-primary-foreground/70 mb-10">
              Every engagement begins with understanding your unique challenges
              and objectives. Let's start that conversation.
            </p>
            <Button variant="premium-gold" size="premium" asChild>
              <Link href="/contact">
                Schedule a Consultation
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}





