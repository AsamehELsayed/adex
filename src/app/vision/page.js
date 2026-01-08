"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Compass, Lightbulb, Shield, Globe, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace new ideas and methodologies, constantly evolving to deliver cutting-edge solutions.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "Honest counsel and ethical practice form the foundation of every client relationship.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description:
      "We bring international expertise and diverse viewpoints to every engagement.",
  },
  {
    icon: Heart,
    title: "Partnership",
    description:
      "We succeed when our clients succeed. Their objectives become our objectives.",
  },
];

export default function Vision() {
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
              Vision & Values
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-display mb-8"
            >
              Guided by Purpose,
              <br />
              Driven by Excellence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-large max-w-2xl"
            >
              Our vision and values shape everything we do—from how we engage
              with clients to how we develop our people and contribute to the
              business community.
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
                <span className="label-uppercase mb-4 block">Our Vision</span>
                <h2 className="heading-section mb-6">
                  To Be the Catalyst
                  <br />
                  for Transformational Change
                </h2>
                <p className="body-large">
                  We envision a world where every organization has access to the
                  strategic insight and execution capability needed to realize its
                  full potential. We aim to be the partner that makes that
                  possible.
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
                <span className="label-uppercase mb-4 block">Our Mission</span>
                <h2 className="heading-section mb-6">
                  Empowering Leaders
                  <br />
                  to Achieve the Extraordinary
                </h2>
                <p className="body-large">
                  We partner with visionary leaders to transform ambitious
                  strategies into measurable outcomes, building organizations that
                  thrive in an ever-changing world.
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
            <span className="label-uppercase mb-4 block">Core Values</span>
            <h2 className="heading-section">The Principles We Live By</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 border border-border hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-secondary group-hover:bg-accent/10 transition-colors duration-300">
                  <value.icon
                    size={28}
                    className="text-accent"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="heading-subsection mb-4">{value.title}</h3>
                <p className="body-regular">{value.description}</p>
              </motion.div>
            ))}
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
              Our Commitment
            </span>
            <h2 className="heading-section mb-8">
              Results That Matter,
              <br />
              Relationships That Last
            </h2>
            <p className="text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              We believe that true success is measured not just by the results we
              deliver, but by the lasting relationships we build with our clients.
              Every engagement is an opportunity to create value that endures.
            </p>
            <Button variant="premium-gold" size="premium" asChild>
              <Link href="/contact">
                Partner With Us
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}





