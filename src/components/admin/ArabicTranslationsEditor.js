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

export default function ArabicTranslationsEditor() {
  const [selectedKey, setSelectedKey] = useState(CONTENT_KEYS[0].key);
  const [englishJson, setEnglishJson] = useState("{}");
  const [arabicJson, setArabicJson] = useState("{}");
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

      setEnglishJson(JSON.stringify(englishOnly, null, 2));
      setArabicJson(JSON.stringify(data.ar || {}, null, 2));
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
      const parsedArabic = JSON.parse(arabicJson || "{}");

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
          Edit the Arabic content inside the `ar` object. Keep the same structure as English.
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
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>English Structure (read-only)</Label>
            <Textarea value={englishJson} readOnly rows={18} className="font-mono text-xs" />
          </div>
          <div className="space-y-2">
            <Label>Arabic JSON (saved as `ar`)</Label>
            <Textarea
              value={arabicJson}
              onChange={(e) => setArabicJson(e.target.value)}
              rows={18}
              className="font-mono text-xs"
            />
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
