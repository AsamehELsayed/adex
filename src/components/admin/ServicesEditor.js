"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import IconSelect from "@/components/admin/IconSelect";

export default function ServicesEditor() {
  const [content, setContent] = useState({
    label: "Our Expertise",
    title: "Comprehensive Solutions for\nComplex Challenges",
    description: "We deliver end-to-end consulting services that address your most pressing business challenges and unlock new opportunities for growth.",
    learnMoreText: "Learn More",
    services: [
      { icon: "TrendingUp", title: "Strategy Consulting", description: "Define market-winning strategies that position your organization for sustainable growth and competitive advantage." },
      { icon: "RefreshCw", title: "Business Transformation", description: "Navigate complex change initiatives with confidence. We guide organizations through digital, cultural, and operational transformations." },
      { icon: "Settings", title: "Operational Excellence", description: "Optimize processes, reduce costs, and enhance efficiency across your entire value chain without compromising quality." },
      { icon: "Expand", title: "Growth & Expansion", description: "Enter new markets, launch new products, and scale your business with data-driven strategies and proven frameworks." },
    ],
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
      const response = await fetch("/api/content?key=services-section");
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
          key: "services-section",
          type: "section",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "Services section content saved successfully",
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

  const addService = () => {
    setContent({
      ...content,
      services: [...content.services, { icon: "", title: "", description: "" }],
    });
  };

  const removeService = (index) => {
    setContent({
      ...content,
      services: content.services.filter((_, i) => i !== index),
    });
  };

  const updateService = (index, field, value) => {
    const updated = [...content.services];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, services: updated });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 p-6 border border-border rounded-lg">
      <h3 className="text-lg font-semibold">Services Section</h3>
      
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

        <div className="space-y-2">
          <Label>Learn More Button Text</Label>
          <Input
            value={content.learnMoreText}
            onChange={(e) => setContent({ ...content, learnMoreText: e.target.value })}
            placeholder="Learn More"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Services</Label>
            <Button type="button" variant="outline" size="sm" onClick={addService}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>

          {content.services.map((service, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Service {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <IconSelect
                label="Icon"
                value={service.icon || ""}
                onChange={(icon) => updateService(index, "icon", icon)}
              />
              <Input
                value={service.title}
                onChange={(e) => updateService(index, "title", e.target.value)}
                placeholder="Service Title"
              />
              <Textarea
                value={service.description}
                onChange={(e) => updateService(index, "description", e.target.value)}
                placeholder="Service Description"
                rows={2}
              />
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





