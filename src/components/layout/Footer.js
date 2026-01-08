"use client";

import Link from "next/link";
import { ArrowUpRight, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-luxury py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
          <Link href="/" className="inline-block mb-6">
            <span className="font-serif text-3xl font-medium tracking-tight">
              Adex<span className="text-accent">.</span>
            </span>
            </Link>
            <p className="text-primary-foreground/70 max-w-md leading-relaxed mb-8">
              Strategic consulting for enterprises ready to transform their
              vision into measurable results. We partner with leaders who demand
              excellence.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-primary-foreground/20 hover:border-accent hover:text-accent transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-primary-foreground/20 hover:border-accent hover:text-accent transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6">Navigate</h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", path: "/about" },
                { name: "Our Services", path: "/services" },
                { name: "Vision & Values", path: "/vision" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-6">Contact</h4>
            <address className="not-italic space-y-4 text-primary-foreground/70">
              <p>
                One World Trade Center
                <br />
                Suite 8500
                <br />
                New York, NY 10007
              </p>
              <p>
                <a
                  href="mailto:hello@apexconsulting.com"
                  className="hover:text-accent transition-colors duration-300"
                >
                  hello@apexconsulting.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+12125551234"
                  className="hover:text-accent transition-colors duration-300"
                >
                  +1 (212) 555-1234
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {currentYear} Adex Consulting. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-accent transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





