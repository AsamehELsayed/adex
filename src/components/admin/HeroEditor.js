"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

export default function HeroEditor() {
  const [content, setContent] = useState({
    label: "Strategic Consulting",
    title: "Where Strategy\nMeets Execution",
    description: "We partner with visionary leaders to transform ambitious strategies into measurable outcomes. Your success is our commitment.",
    primaryButton: "Start a Conversation",
    secondaryButton: "Explore Services",
    backgroundImage: "/hero-consulting.jpg",
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
      const response = await fetch("/api/content?key=hero-section");
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
          key: "hero-section",
          type: "section",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "Hero section content saved successfully",
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
      <h3 className="text-lg font-semibold">Hero Section</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={content.label}
            onChange={(e) => setContent({ ...content, label: e.target.value })}
            placeholder="Strategic Consulting"
          />
        </div>

        <div className="space-y-2">
          <Label>Title (use \n for line breaks)</Label>
          <Textarea
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            placeholder="Where Strategy\nMeets Execution"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            placeholder="Description text..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Button Text</Label>
            <Input
              value={content.primaryButton}
              onChange={(e) => setContent({ ...content, primaryButton: e.target.value })}
              placeholder="Start a Conversation"
            />
          </div>

          <div className="space-y-2">
            <Label>Secondary Button Text</Label>
            <Input
              value={content.secondaryButton}
              onChange={(e) => setContent({ ...content, secondaryButton: e.target.value })}
              placeholder="Explore Services"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Background Image</Label>
          <ImageUploader
            value={content.backgroundImage}
            onChange={(url) => setContent({ ...content, backgroundImage: url })}
            label="Hero Background Image"
          />
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

