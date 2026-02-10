"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function VisionPageEditor() {
  const [content, setContent] = useState({
    hero: {
      label: "Vision & Values",
      title: "Guided by Purpose,\nDriven by Excellence",
      description: "Our vision and values shape everything we do—from how we engage with clients to how we develop our people and contribute to the business community.",
    },
    vision: {
      label: "Our Vision",
      title: "To Be the Catalyst\nfor Transformational Change",
      description: "We envision a world where every organization has access to the strategic insight and execution capability needed to realize its full potential. We aim to be the partner that makes that possible.",
    },
    mission: {
      label: "Our Mission",
      title: "Empowering Leaders\nto Achieve the Extraordinary",
      description: "We partner with visionary leaders to transform ambitious strategies into measurable outcomes, building organizations that thrive in an ever-changing world.",
    },
    values: {
      label: "Core Values",
      title: "The Principles We Live By",
      values: [
        {
          icon: "Lightbulb",
          title: "Innovation",
          description: "We embrace new ideas and methodologies, constantly evolving to deliver cutting-edge solutions.",
        },
        {
          icon: "Shield",
          title: "Integrity",
          description: "Honest counsel and ethical practice form the foundation of every client relationship.",
        },
        {
          icon: "Globe",
          title: "Global Perspective",
          description: "We bring international expertise and diverse viewpoints to every engagement.",
        },
        {
          icon: "Heart",
          title: "Partnership",
          description: "We succeed when our clients succeed. Their objectives become our objectives.",
        },
      ],
    },
    commitment: {
      label: "Our Commitment",
      title: "Results That Matter,\nRelationships That Last",
      description: "We believe that true success is measured not just by the results we deliver, but by the lasting relationships we build with our clients. Every engagement is an opportunity to create value that endures.",
      buttonText: "Partner With Us",
    },
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
      const response = await fetch("/api/content?key=vision-page");
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
          key: "vision-page",
          type: "page",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "Vision page content saved successfully",
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

  const addValue = () => {
    setContent({
      ...content,
      values: {
        ...content.values,
        values: [...content.values.values, { icon: "", title: "", description: "" }],
      },
    });
  };

  const removeValue = (index) => {
    setContent({
      ...content,
      values: {
        ...content.values,
        values: content.values.values.filter((_, i) => i !== index),
      },
    });
  };

  const updateValue = (index, field, value) => {
    const updated = [...content.values.values];
    updated[index] = { ...updated[index], [field]: value };
    setContent({
      ...content,
      values: { ...content.values, values: updated },
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 p-6 border border-border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vision Page Content</h3>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h4 className="font-semibold">Hero Section</h4>
        <div className="space-y-3">
          <Input
            value={content.hero.label}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, label: e.target.value } })}
            placeholder="Label"
          />
          <Textarea
            value={content.hero.title}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
            placeholder="Title"
            rows={2}
          />
          <Textarea
            value={content.hero.description}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
            placeholder="Description"
            rows={3}
          />
        </div>
      </div>

      {/* Vision Section */}
      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h4 className="font-semibold">Vision Section</h4>
        <div className="space-y-3">
          <Input
            value={content.vision.label}
            onChange={(e) => setContent({ ...content, vision: { ...content.vision, label: e.target.value } })}
            placeholder="Label"
          />
          <Textarea
            value={content.vision.title}
            onChange={(e) => setContent({ ...content, vision: { ...content.vision, title: e.target.value } })}
            placeholder="Title"
            rows={2}
          />
          <Textarea
            value={content.vision.description}
            onChange={(e) => setContent({ ...content, vision: { ...content.vision, description: e.target.value } })}
            placeholder="Description"
            rows={3}
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h4 className="font-semibold">Mission Section</h4>
        <div className="space-y-3">
          <Input
            value={content.mission.label}
            onChange={(e) => setContent({ ...content, mission: { ...content.mission, label: e.target.value } })}
            placeholder="Label"
          />
          <Textarea
            value={content.mission.title}
            onChange={(e) => setContent({ ...content, mission: { ...content.mission, title: e.target.value } })}
            placeholder="Title"
            rows={2}
          />
          <Textarea
            value={content.mission.description}
            onChange={(e) => setContent({ ...content, mission: { ...content.mission, description: e.target.value } })}
            placeholder="Description"
            rows={3}
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Values Section</h4>
          <Button type="button" variant="outline" size="sm" onClick={addValue}>
            <Plus className="mr-2 h-4 w-4" />
            Add Value
          </Button>
        </div>
        <div className="space-y-3">
          <Input
            value={content.values.label}
            onChange={(e) => setContent({ ...content, values: { ...content.values, label: e.target.value } })}
            placeholder="Label"
          />
          <Textarea
            value={content.values.title}
            onChange={(e) => setContent({ ...content, values: { ...content.values, title: e.target.value } })}
            placeholder="Title"
            rows={2}
          />
          {content.values.values.map((value, index) => (
            <div key={index} className="p-3 border border-border rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Value {index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeValue(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={value.icon}
                onChange={(e) => updateValue(index, "icon", e.target.value)}
                placeholder="Icon Name (e.g., Lightbulb, Shield, Globe, Heart)"
              />
              <Input
                value={value.title}
                onChange={(e) => updateValue(index, "title", e.target.value)}
                placeholder="Value Title"
              />
              <Textarea
                value={value.description}
                onChange={(e) => updateValue(index, "description", e.target.value)}
                placeholder="Value Description"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Commitment Section */}
      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h4 className="font-semibold">Commitment Section</h4>
        <div className="space-y-3">
          <Input
            value={content.commitment.label}
            onChange={(e) => setContent({ ...content, commitment: { ...content.commitment, label: e.target.value } })}
            placeholder="Label"
          />
          <Textarea
            value={content.commitment.title}
            onChange={(e) => setContent({ ...content, commitment: { ...content.commitment, title: e.target.value } })}
            placeholder="Title"
            rows={2}
          />
          <Textarea
            value={content.commitment.description}
            onChange={(e) => setContent({ ...content, commitment: { ...content.commitment, description: e.target.value } })}
            placeholder="Description"
            rows={3}
          />
          <Input
            value={content.commitment.buttonText}
            onChange={(e) => setContent({ ...content, commitment: { ...content.commitment, buttonText: e.target.value } })}
            placeholder="Button Text"
          />
        </div>
      </div>
    </div>
  );
}
