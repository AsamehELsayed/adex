"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

const CONTENT_KEYS = [
  { key: "hero-section", label: "Home - Hero", type: "section" },
  { key: "about-section", label: "Home - About", type: "section" },
  { key: "services-section", label: "Home - Services", type: "section" },
  { key: "why-choose-us-section", label: "Home - Why Choose Us", type: "section" },
  { key: "cta-section", label: "Home - CTA", type: "section" },
  { key: "about-page", label: "About Page", type: "page" },
  { key: "services-page", label: "Services Page", type: "page" },
  { key: "vision-page", label: "Vision Page", type: "page" },
  { key: "contact-page", label: "Contact Page", type: "page" },
  { key: "footer-section", label: "Footer", type: "section" },
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function setAtPath(target, path, value) {
  if (!path.length) return;

  let current = target;
  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];
    const nextSegment = path[index + 1];
    if (current[segment] === undefined) {
      current[segment] = typeof nextSegment === "number" ? [] : {};
    }
    current = current[segment];
  }

  current[path[path.length - 1]] = value;
}

function toReadablePath(path) {
  return path.reduce((label, segment) => {
    if (typeof segment === "number") {
      return `${label}[${segment}]`;
    }
    return label ? `${label}.${segment}` : segment;
  }, "");
}

function collectFields(baseValue, arabicValue, path = [], fields = []) {
  if (typeof baseValue === "string") {
    fields.push({
      path,
      label: toReadablePath(path),
      englishValue: baseValue,
      arabicValue: typeof arabicValue === "string" ? arabicValue : "",
    });
    return fields;
  }

  if (Array.isArray(baseValue)) {
    baseValue.forEach((item, index) => {
      collectFields(item, arabicValue?.[index], [...path, index], fields);
    });
    return fields;
  }

  if (isPlainObject(baseValue)) {
    Object.entries(baseValue).forEach(([key, value]) => {
      collectFields(value, arabicValue?.[key], [...path, key], fields);
    });
  }

  return fields;
}

function buildArabicObject(fields) {
  const result = {};
  fields.forEach((field) => {
    const value = field.arabicValue.trim();
    if (!value) return;
    setAtPath(result, field.path, value);
  });
  return result;
}

export default function ArabicTranslationsEditor() {
  const [selectedKey, setSelectedKey] = useState(CONTENT_KEYS[0].key);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const selectedConfig = useMemo(
    () => CONTENT_KEYS.find((item) => item.key === selectedKey) || CONTENT_KEYS[0],
    [selectedKey]
  );

  useEffect(() => {
    loadTranslation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  const loadTranslation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/content?key=${selectedKey}`);
      const result = await response.json();
      const data = result?.success && result.data?.[0]?.data ? result.data[0].data : {};
      const englishOnly = { ...data };
      delete englishOnly.ar;

      const existingArabic = data.ar || {};
      setFields(collectFields(englishOnly, existingArabic));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load translations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTranslation = async () => {
    setIsSaving(true);
    try {
      const parsedArabic = buildArabicObject(fields);

      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: selectedKey,
          type: selectedConfig.type,
          data: { ar: parsedArabic },
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to save translation");
      }

      toast({
        title: "Saved",
        description: "Arabic translation saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof SyntaxError
            ? "Arabic JSON is invalid. Please fix JSON formatting."
            : "Failed to save Arabic translation",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 border border-border rounded-lg">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Arabic Translation Manager</h3>
        <p className="text-sm text-muted-foreground">
          Translate each field directly. No JSON editing is required.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Content Key</Label>
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="w-full h-10 px-3 border border-border rounded-md bg-background"
        >
          {CONTENT_KEYS.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4 max-h-[70vh] overflow-auto pr-1">
            {fields.map((field, index) => (
              <div key={`${field.label}-${index}`} className="space-y-2 border border-border rounded-md p-3">
                <Label>{field.label}</Label>
                <Textarea value={field.englishValue} readOnly rows={2} className="text-xs" />
                <Textarea
                  value={field.arabicValue}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setFields((previous) =>
                      previous.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, arabicValue: nextValue } : item
                      )
                    );
                  }}
                  rows={2}
                  placeholder="Write simple Arabic translation"
                  className="text-sm"
                />
              </div>
            ))}
            {!fields.length ? (
              <p className="text-sm text-muted-foreground">No translatable text found for this section.</p>
            ) : null}
          </div>
          <div className="text-xs text-muted-foreground">
            Empty Arabic fields are skipped and English text will be used as fallback.
          </div>
        </div>
      )}

      <Button onClick={saveTranslation} disabled={isSaving || isLoading}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Arabic Translation
          </>
        )}
      </Button>
    </div>
  );
}
