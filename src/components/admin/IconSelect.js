"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { iconMap, ICON_OPTIONS } from "@/lib/lucide-icons";

export default function IconSelect({ value, onChange, label = "Icon" }) {
  const SelectedIcon = value ? iconMap[value] : null;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value || ""} onValueChange={(v) => onChange(v || "")}>
        <SelectTrigger className="flex items-center gap-2">
          <SelectValue placeholder="Select an icon">
            {value ? (
              <span className="flex items-center gap-2">
                {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
                {ICON_OPTIONS.find((o) => o.value === value)?.label || value}
              </span>
            ) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {ICON_OPTIONS.filter((o) => o.value !== "").map((option) => {
            const IconComponent = option.value ? iconMap[option.value] : null;
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
