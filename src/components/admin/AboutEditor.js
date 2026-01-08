"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

export default function AboutEditor() {
  const [content, setContent] = useState({
    label: "About Our Firm",
    title: "Your Strategic Partner\nfor Lasting Impact",
    description1: "Adex Consulting stands apart as a strategic partner, not merely a consultant. We embed ourselves in your organization's vision, challenges, and aspirations.",
    description2: "Our team of seasoned executives and industry specialists brings decades of hands-on experience across Fortune 500 companies, high-growth startups, and global enterprises. We don't just advise—we execute alongside you.",
    linkText: "Learn More About Us",
    statNumber: "25+",
    statLabel: "Years of Excellence",
    image: "/team-meeting.jpg",
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
      const response = await fetch("/api/content?key=about-section");
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
          key: "about-section",
          type: "section",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "About section content saved successfully",
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
      <h3 className="text-lg font-semibold">About Section</h3>
      
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
          <Label>Description 1</Label>
          <Textarea
            value={content.description1}
            onChange={(e) => setContent({ ...content, description1: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Description 2</Label>
          <Textarea
            value={content.description2}
            onChange={(e) => setContent({ ...content, description2: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Link Text</Label>
          <Input
            value={content.linkText}
            onChange={(e) => setContent({ ...content, linkText: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Stat Number</Label>
            <Input
              value={content.statNumber}
              onChange={(e) => setContent({ ...content, statNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Stat Label</Label>
            <Input
              value={content.statLabel}
              onChange={(e) => setContent({ ...content, statLabel: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Section Image</Label>
          <ImageUploader
            value={content.image}
            onChange={(url) => setContent({ ...content, image: url })}
            label="About Section Image"
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

