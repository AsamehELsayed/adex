"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/hooks/use-content";

// Default content (matches ContactPageEditor defaults)
const defaultContent = {
  hero: {
    label: "Contact Us",
    title: "Let's Start a\nConversation",
    description:
      "Every great transformation begins with a conversation. We'd love to hear about your challenges and explore how we can help.",
  },
  form: {
    title: "Send Us a Message",
    nameLabel: "Full Name *",
    emailLabel: "Email Address *",
    companyLabel: "Company",
    messageLabel: "How Can We Help? *",
    submitButton: "Send Message",
  },
  info: {
    title: "Get in Touch",
    description:
      "Our team is available to discuss your strategic needs. Reach out through any of the channels below.",
    address: {
      title: "Headquarters",
      line1: "One World Trade Center",
      line2: "Suite 8500",
      line3: "New York, NY 10007",
    },
    email: {
      title: "Email",
      value: "hello@apexconsulting.com",
    },
    phone: {
      title: "Phone",
      value: "+1 (212) 555-1234",
    },
    hours: "Monday – Friday: 9:00 AM – 6:00 PM EST",
  },
};

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  // Load page copy from /api/content via useContent
  const { content } = useContent("contact-page", defaultContent);
  const displayContent = content || defaultContent;
  const hero = displayContent.hero || defaultContent.hero;
  const form = displayContent.form || defaultContent.form;
  const info = displayContent.info || defaultContent.info;

  const heroTitleLines =
    typeof hero.title === "string" && hero.title.length > 0
      ? hero.title.split("\n")
      : ["Let's Start a", "Conversation"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          formData: {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            message: formData.message,
          },
          metadata: {
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message Sent",
          description:
            "Thank you for reaching out. A member of our team will be in touch within 24 hours.",
        });
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

      {/* Contact Form & Info */}
      <section className="section-padding bg-secondary">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="bg-card border border-border p-10 md:p-12">
                <h2 className="heading-subsection mb-8">{form.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        {form.nameLabel}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-border focus:border-accent rounded-none h-12"
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        {form.emailLabel}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-border focus:border-accent rounded-none h-12"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">
                      {form.companyLabel}
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="border-border focus:border-accent rounded-none h-12"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      {form.messageLabel}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="border-border focus:border-accent rounded-none resize-none"
                      placeholder="Tell us about your challenges and objectives..."
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="premium"
                    size="premium"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        {form.submitButton}
                        <Send size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="space-y-12">
                <div>
                  <h3 className="heading-subsection mb-6">{info.title}</h3>
                  <p className="body-regular mb-8">{info.description}</p>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-accent/10 text-accent">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">
                        {info.address?.title || "Headquarters"}
                      </h4>
                      <address className="not-italic text-muted-foreground leading-relaxed">
                        {info.address?.line1}
                        <br />
                        {info.address?.line2}
                        <br />
                        {info.address?.line3}
                      </address>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-accent/10 text-accent">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">
                        {info.email?.title || "Email"}
                      </h4>
                      <a
                        href={`mailto:${info.email?.value || "hello@apexconsulting.com"}`}
                        className="text-muted-foreground hover:text-accent transition-colors duration-300"
                      >
                        {info.email?.value || "hello@apexconsulting.com"}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-accent/10 text-accent">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">
                        {info.phone?.title || "Phone"}
                      </h4>
                      <a
                        href={`tel:${info.phone?.value || "+12125551234"}`}
                        className="text-muted-foreground hover:text-accent transition-colors duration-300"
                      >
                        {info.phone?.value || "+1 (212) 555-1234"}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Office Hours
                    <br />
                    {info.hours}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

