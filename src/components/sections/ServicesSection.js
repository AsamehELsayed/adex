"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { iconMap } from "@/lib/lucide-icons";

const DEFAULT_ICON = iconMap.TrendingUp;

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [services, setServices] = useState([]);

  const defaultContent = {
    label: "Our Expertise",
    title: "Comprehensive Solutions for\nComplex Challenges",
    description: "We deliver end-to-end consulting services that address your most pressing business challenges and unlock new opportunities for growth.",
    learnMoreText: "Learn More",
    services: [
      {
        icon: "TrendingUp",
        title: "Strategy Consulting",
        description: "Define market-winning strategies that position your organization for sustainable growth and competitive advantage.",
      },
      {
        icon: "RefreshCw",
        title: "Business Transformation",
        description: "Navigate complex change initiatives with confidence. We guide organizations through digital, cultural, and operational transformations.",
      },
      {
        icon: "Settings",
        title: "Operational Excellence",
        description: "Optimize processes, reduce costs, and enhance efficiency across your entire value chain without compromising quality.",
      },
      {
        icon: "Expand",
        title: "Growth & Expansion",
        description: "Enter new markets, launch new products, and scale your business with data-driven strategies and proven frameworks.",
      },
    ],
  };

  const { content, language } = useLocalizedContent("services-section", defaultContent);
  const displayContent = content || defaultContent;
  const titleLines = displayContent.title?.split("\n") || ["Comprehensive Solutions for", "Complex Challenges"];

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services?isActive=true");
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          // Use services from API, limit to 4 for home page
          const mapped = data.data.slice(0, 4).map((service, index) => {
            if (language !== "ar") {
              return service;
            }

            const ar = service.serviceData?.ar || {};
            const localizedFallback = Array.isArray(displayContent.services)
              ? displayContent.services[index]
              : null;

            return {
              ...service,
              title: ar.title || localizedFallback?.title || service.title,
              subtitle: ar.subtitle || localizedFallback?.subtitle || service.subtitle,
              description: ar.description || localizedFallback?.description || service.description,
              capabilities:
                Array.isArray(ar.capabilities) && ar.capabilities.length
                  ? ar.capabilities
                  : Array.isArray(localizedFallback?.capabilities)
                    ? localizedFallback.capabilities
                    : service.capabilities,
            };
          });
          setServices(mapped);
        } else if (displayContent.services) {
          // Fallback to content services
          setServices(displayContent.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        // Fallback to content services
        if (displayContent.services) {
          setServices(displayContent.services);
        }
      }
    };

    fetchServices();
  }, [displayContent.services, language]);

  const servicesToDisplay = services.length > 0 ? services : (displayContent.services || []);

  return (
    <section ref={ref} className="section-padding bg-secondary">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="label-uppercase mb-4 block">{displayContent.label}</span>
          <h2 className="heading-section mb-6">
            {titleLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="body-large">
            {displayContent.description}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {servicesToDisplay.map((service, index) => {
            const IconComponent = typeof service.icon === 'string' 
              ? iconMap[service.icon] || DEFAULT_ICON 
              : service.icon || DEFAULT_ICON;
            
            return (
              <motion.div
                key={service.title || index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group bg-card p-10 border border-border hover:border-accent/50 hover:shadow-elegant-lg transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-500">
                    <IconComponent size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-subsection mb-4">{service.title}</h3>
                    <p className="body-regular mb-6">{service.description}</p>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors duration-300 group/link"
                    >
                      {displayContent.learnMoreText}
                      <ArrowRight
                        size={14}
                        className="group-hover/link:translate-x-1 transition-transform duration-300"
                      />
                    </Link>
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

export default ServicesSection;

