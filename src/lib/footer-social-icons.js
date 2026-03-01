/**
 * Social media icon options for footer.
 * Keys are lowercase; Footer uses them via getSocialIcon(link.icon).
 */
import {
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Github,
} from "lucide-react";

export const socialIconMap = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
};

export const SOCIAL_ICON_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "github", label: "GitHub" },
];
