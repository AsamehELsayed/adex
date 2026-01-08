"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function AboutPageEditor() {
  const [content, setContent] = useState({
    hero: {
      label: "About Adex",
      title: "Trusted Advisors to\nIndustry Leaders",
      description: "For over two decades, Apex Consulting has partnered with the world's most ambitious organizations to navigate complexity and achieve breakthrough results.",
    },
    story: {
      title: "Our Story",
      paragraphs: [
        "Founded in 1998 by former Fortune 100 executives, Adex was built on a simple premise: consulting should deliver tangible results, not just presentations.",
        "Today, we've grown into a global firm with offices across North America, Europe, and Asia. Our team of 200+ consultants brings diverse perspectives and deep expertise across industries.",
        "What hasn't changed is our founding commitment: we measure our success by the success we create for our clients.",
      ],
      foundedYear: "1998",
    },
    values: {
      label: "Our Values",
      title: "Principles That Guide\nEvery Engagement",
      values: [
        {
          title: "Excellence Without Compromise",
          description: "We set the highest standards for ourselves and our work. Every deliverable reflects our commitment to exceptional quality.",
        },
        {
          title: "Client Partnership",
          description: "We succeed when you succeed. Our interests are aligned with yours, creating a true partnership built on mutual trust.",
        },
        {
          title: "Integrity First",
          description: "We provide honest counsel, even when it's difficult. Our reputation is built on transparency and ethical practice.",
        },
        {
          title: "Innovation-Driven",
          description: "We continuously evolve our methodologies and embrace new technologies to deliver cutting-edge solutions.",
        },
      ],
    },
    cta: {
      title: "Join Our Team",
      description: "We're always looking for exceptional talent to join our growing team of consultants and thought leaders.",
      buttonText: "Get in Touch",
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
      const response = await fetch("/api/content?key=about-page");
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
          key: "about-page",
          type: "page",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "About page content saved successfully",
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
        values: [...content.values.values, { title: "", description: "" }],
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
        <h3 className="text-lg font-semibold">About Page Content</h3>
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

      {/* Story Section */}
      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h4 className="font-semibold">Story Section</h4>
        <div className="space-y-3">
          <Input
            value={content.story.title}
            onChange={(e) => setContent({ ...content, story: { ...content.story, title: e.target.value } })}
            placeholder="Title"
          />
          {content.story.paragraphs.map((para, idx) => (
            <Textarea
              key={idx}
              value={para}
              onChange={(e) => {
                const updated = [...content.story.paragraphs];
                updated[idx] = e.target.value;
                setContent({ ...content, story: { ...content.story, paragraphs: updated } });
              }}
              placeholder={`Paragraph ${idx + 1}`}
              rows={2}
            />
          ))}
          <Input
            value={content.story.foundedYear}
            onChange={(e) => setContent({ ...content, story: { ...content.story, foundedYear: e.target.value } })}
            placeholder="Founded Year"
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

      {/* CTA Section */}
      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h4 className="font-semibold">CTA Section</h4>
        <div className="space-y-3">
          <Input
            value={content.cta.title}
            onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })}
            placeholder="Title"
          />
          <Textarea
            value={content.cta.description}
            onChange={(e) => setContent({ ...content, cta: { ...content.cta, description: e.target.value } })}
            placeholder="Description"
            rows={2}
          />
          <Input
            value={content.cta.buttonText}
            onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonText: e.target.value } })}
            placeholder="Button Text"
          />
        </div>
      </div>
    </div>
  );
}





