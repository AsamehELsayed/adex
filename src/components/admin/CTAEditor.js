"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

export default function CTAEditor() {
  const [content, setContent] = useState({
    label: "Ready to Transform?",
    title: "Let's Build Your\nNext Chapter",
    description: "Every great transformation begins with a conversation. Share your vision with us, and together we'll chart the path forward.",
    primaryButton: "Schedule a Consultation",
    secondaryButton: "View Our Services",
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
      const response = await fetch("/api/content?key=cta-section");
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
          key: "cta-section",
          type: "section",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "CTA section content saved successfully",
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
      <h3 className="text-lg font-semibold">Call-to-Action Section</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={content.label}
            onChange={(e) => setContent({ ...content, label: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Title (use \n for line breaks)</Label>
          <Textarea
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Button Text</Label>
            <Input
              value={content.primaryButton}
              onChange={(e) => setContent({ ...content, primaryButton: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Secondary Button Text</Label>
            <Input
              value={content.secondaryButton}
              onChange={(e) => setContent({ ...content, secondaryButton: e.target.value })}
            />
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





