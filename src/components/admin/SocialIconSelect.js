"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { socialIconMap, SOCIAL_ICON_OPTIONS } from "@/lib/footer-social-icons";

export default function SocialIconSelect({ value, onChange, label = "Icon" }) {
  const SelectedIcon = value ? socialIconMap[value?.toLowerCase()] : null;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value?.toLowerCase() || ""}
        onValueChange={(v) => onChange(v || "")}
      >
        <SelectTrigger className="flex items-center gap-2">
          <SelectValue placeholder="Select social icon">
            {value ? (
              <span className="flex items-center gap-2">
                {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
                {SOCIAL_ICON_OPTIONS.find(
                  (o) => o.value === value?.toLowerCase()
                )?.label || value}
              </span>
            ) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SOCIAL_ICON_OPTIONS.map((option) => {
            const IconComponent = option.value
              ? socialIconMap[option.value]
              : null;
            return (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {option.label}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
