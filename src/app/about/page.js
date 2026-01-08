"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const values = [
  {
    title: "Excellence Without Compromise",
    description:
      "We set the highest standards for ourselves and our work. Every deliverable reflects our commitment to exceptional quality.",
  },
  {
    title: "Client Partnership",
    description:
      "We succeed when you succeed. Our interests are aligned with yours, creating a true partnership built on mutual trust.",
  },
  {
    title: "Integrity First",
    description:
      "We provide honest counsel, even when it's difficult. Our reputation is built on transparency and ethical practice.",
  },
  {
    title: "Innovation-Driven",
    description:
      "We continuously evolve our methodologies and embrace new technologies to deliver cutting-edge solutions.",
  },
];

export default function About() {
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
              About Adex
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-display mb-8"
            >
              Trusted Advisors to
              <br />
              Industry Leaders
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-large max-w-2xl"
            >
              For over two decades, Apex Consulting has partnered with the
              world's most ambitious organizations to navigate complexity and
              achieve breakthrough results.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-secondary">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="heading-section mb-8">Our Story</h2>
              <div className="space-y-6">
                <p className="body-large">
                  Founded in 1998 by former Fortune 100 executives, Adex was
                  built on a simple premise: consulting should deliver tangible
                  results, not just presentations.
                </p>
                <p className="body-regular">
                  Today, we've grown into a global firm with offices across North
                  America, Europe, and Asia. Our team of 200+ consultants brings
                  diverse perspectives and deep expertise across industries.
                </p>
                <p className="body-regular">
                  What hasn't changed is our founding commitment: we measure our
                  success by the success we create for our clients.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src="/team-meeting.jpg"
                  alt="Adex Consulting team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 right-8 bg-accent text-accent-foreground p-8">
                <span className="block font-serif text-5xl font-medium">1998</span>
                <span className="text-sm">Founded</span>
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
            className="max-w-3xl mb-16"
          >
            <span className="label-uppercase mb-4 block">Our Values</span>
            <h2 className="heading-section">
              Principles That Guide
              <br />
              Every Engagement
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 p-8 border border-border hover:border-accent/50 transition-colors duration-300"
              >
                <CheckCircle className="flex-shrink-0 text-accent mt-1" size={24} />
                <div>
                  <h3 className="heading-subsection mb-3">{value.title}</h3>
                  <p className="body-regular">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
            <h2 className="heading-section mb-6">Join Our Team</h2>
            <p className="text-lg text-primary-foreground/70 mb-10">
              We're always looking for exceptional talent to join our growing
              team of consultants and thought leaders.
            </p>
            <Button variant="premium-gold" size="premium" asChild>
              <Link href="/contact">
                Get in Touch
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}





