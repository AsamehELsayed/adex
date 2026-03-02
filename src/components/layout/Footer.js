"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { socialIconMap } from "@/lib/footer-social-icons";
import { useLanguage } from "@/contexts/language-context";
import { localizeContent } from "@/lib/localization";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const [content, setContent] = useState({
    brandName: "Adex",
    brandDescription: "Strategic consulting for enterprises ready to transform their vision into measurable results. We partner with leaders who demand excellence.",
    socialLinks: [
      { name: "LinkedIn", url: "#", icon: "linkedin" },
      { name: "Twitter", url: "#", icon: "twitter" },
    ],
    navigationLinks: [
      { name: "About Us", path: "/about" },
      { name: "Our Services", path: "/services" },
      { name: "Vision & Values", path: "/vision" },
      { name: "Contact", path: "/contact" },
    ],
    navigateLabel: "Navigate",
    contactLabel: "Contact",
    contactInfo: {
      address: "One World Trade Center\nSuite 8500\nNew York, NY 10007",
      email: "hello@apexconsulting.com",
      phone: "+1 (212) 555-1234",
    },
    bottomLinks: [
      { name: "Privacy Policy", url: "#" },
      { name: "Terms of Service", url: "#" },
    ],
    copyrightText: "Adex Consulting. All rights reserved.",
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch("/api/content?key=footer-section");
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setContent({ ...content, ...data.data[0].data });
      }
    } catch (error) {
      console.error("Error loading footer content:", error);
    }
  };

  const getSocialIcon = (iconName) => {
    const key = iconName?.toLowerCase();
    return socialIconMap[key] || socialIconMap.linkedin;
  };

  const displayContent = localizeContent(content, language) || content;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-luxury py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-3xl font-medium tracking-tight">
                {displayContent.brandName}<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 max-w-md leading-relaxed mb-8">
              {displayContent.brandDescription}
            </p>
            <div className="flex gap-4">
              {(displayContent.socialLinks || []).map((link, index) => {
                const Icon = getSocialIcon(link.icon);
                return (
                  <a
                    key={index}
                    href={link.url}
                    className="w-10 h-10 flex items-center justify-center border border-primary-foreground/20 hover:border-accent hover:text-accent transition-colors duration-300"
                    aria-label={link.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6">
              {displayContent.navigateLabel}
            </h4>
            <ul className="space-y-4">
              {(displayContent.navigationLinks || []).map((link, index) => (
                <li key={index}>
                  {(() => {
                    const fallbackPath = content.navigationLinks?.[index]?.path || "/";
                    const href = link?.path || fallbackPath;
                    return (
                  <Link
                    href={href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Link>
                    );
                  })()}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-6">
              {displayContent.contactLabel}
            </h4>
            <address className="not-italic space-y-4 text-primary-foreground/70">
              <p>
                {(displayContent.contactInfo?.address || "")
                  .split("\n")
                  .map((line, index, arr) => (
                  <span key={index}>
                    {line}
                    {index < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <p>
                <a
                  href={`mailto:${displayContent.contactInfo?.email || ""}`}
                  className="hover:text-accent transition-colors duration-300"
                >
                  {displayContent.contactInfo?.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${(displayContent.contactInfo?.phone || "").replace(/\s/g, "")}`}
                  className="hover:text-accent transition-colors duration-300"
                >
                  {displayContent.contactInfo?.phone}
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {currentYear} {displayContent.copyrightText}
          </p>
          <div className="flex gap-8 text-sm text-primary-foreground/50">
            {(displayContent.bottomLinks || []).map((link, index) => (
              <a
                key={index}
                href={link?.url || content.bottomLinks?.[index]?.url || "#"}
                className="hover:text-accent transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





