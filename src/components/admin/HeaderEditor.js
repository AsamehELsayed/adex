"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function HeaderEditor() {
  const [content, setContent] = useState({
    navLinks: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Services", path: "/services" },
      { name: "Vision", path: "/vision" },
      { name: "Contact", path: "/contact" },
    ],
    ctaText: "Get in Touch",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/content?key=header-section");
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setContent({ ...content, ...data.data[0].data });
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "header-section",
          type: "section",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "Header content saved successfully",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addNavLink = () => {
    setContent({
      ...content,
      navLinks: [...content.navLinks, { name: "", path: "" }],
    });
  };

  const removeNavLink = (index) => {
    setContent({
      ...content,
      navLinks: content.navLinks.filter((_, i) => i !== index),
    });
  };

  const updateNavLink = (index, field, value) => {
    const updated = [...content.navLinks];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, navLinks: updated });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 border border-border rounded-lg">
      <h3 className="text-lg font-semibold">Header / Navigation</h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>CTA Button Text</Label>
          <Input
            value={content.ctaText}
            onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
            placeholder="Get in Touch"
          />
        </div>

        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Navigation Links</h4>
            <Button size="sm" variant="outline" onClick={addNavLink}>
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>

          {content.navLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label>Name</Label>
                <Input
                  value={link.name}
                  onChange={(e) => updateNavLink(index, "name", e.target.value)}
                  placeholder="About"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Path</Label>
                <Input
                  value={link.path}
                  onChange={(e) => updateNavLink(index, "path", e.target.value)}
                  placeholder="/about"
                />
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeNavLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}
