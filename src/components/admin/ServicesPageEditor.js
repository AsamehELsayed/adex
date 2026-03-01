"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

export default function ServicesPageEditor() {
  const [content, setContent] = useState({
    hero: {
      label: "Our Services",
      title: "Comprehensive Solutions\nfor Complex Challenges",
      description: "We deliver end-to-end consulting services that address your most pressing business challenges and unlock new opportunities for sustainable growth.",
    },
    cta: {
      title: "Ready to Get Started?",
      description: "Every engagement begins with understanding your unique challenges and objectives. Let's start that conversation.",
      buttonText: "Schedule a Consultation",
    },
    discussButtonText: "Discuss Your Needs",
    capabilitiesLabel: "Core Capabilities",
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
      const response = await fetch("/api/content?key=services-page");
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
          key: "services-page",
          type: "page",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "Services page content saved successfully",
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

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 p-6 border border-border rounded-lg">
      <h3 className="text-lg font-semibold">Services Page Content</h3>
      
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="space-y-4 p-4 bg-secondary rounded-lg">
          <h4 className="font-semibold">Hero Section</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={content.hero.label}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, label: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label>Title (use \n for line breaks)</Label>
              <Textarea
                value={content.hero.title}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={content.hero.description}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* UI Labels */}
        <div className="space-y-4 p-4 bg-secondary rounded-lg">
          <h4 className="font-semibold">Service Card Labels</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discuss Button Text</Label>
              <Input
                value={content.discussButtonText}
                onChange={(e) => setContent({ ...content, discussButtonText: e.target.value })}
                placeholder="Discuss Your Needs"
              />
            </div>
            <div className="space-y-2">
              <Label>Capabilities Section Label</Label>
              <Input
                value={content.capabilitiesLabel}
                onChange={(e) => setContent({ ...content, capabilitiesLabel: e.target.value })}
                placeholder="Core Capabilities"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-4 p-4 bg-secondary rounded-lg">
          <h4 className="font-semibold">CTA Section</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={content.cta.title}
                onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={content.cta.description}
                onChange={(e) => setContent({ ...content, cta: { ...content.cta, description: e.target.value } })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={content.cta.buttonText}
                onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonText: e.target.value } })}
              />
            </div>
          </div>
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





