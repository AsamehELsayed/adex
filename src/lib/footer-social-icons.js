/**
 * Social media icon options for footer.
 * All social/brand icons available in lucide-react.
 * Keys are lowercase; Footer uses them via getSocialIcon(link.icon).
 */
import {
  Linkedin,
  X,
  Instagram,
  Facebook,
  Youtube,
  Github,
  Dribbble,
  Slack,
  Twitch,
} from "lucide-react";

export const socialIconMap = {
  linkedin: Linkedin,
  twitter: X,
  x: X,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  dribbble: Dribbble,
  slack: Slack,
  twitch: Twitch,
};

export const SOCIAL_ICON_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "github", label: "GitHub" },
  { value: "dribbble", label: "Dribbble" },
  { value: "slack", label: "Slack" },
  { value: "twitch", label: "Twitch" },
];
