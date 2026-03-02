"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import IconSelect from "@/components/admin/IconSelect";

export default function WhyChooseUsEditor() {
  const [content, setContent] = useState({
    label: "The Adex Difference",
    title: "Why Leaders Choose\nto Partner With Us",
    reasons: [
      {
        icon: "Target",
        title: "Results-Driven Approach",
        description: "Every engagement is measured by tangible outcomes. We define success metrics upfront and hold ourselves accountable to delivering measurable impact.",
        stat: "94%",
        statLabel: "Client Satisfaction",
      },
      {
        icon: "Award",
        title: "Industry Expertise",
        description: "Our consultants bring deep domain knowledge across industries—from technology and healthcare to finance and manufacturing.",
        stat: "50+",
        statLabel: "Industries Served",
      },
      {
        icon: "Users",
        title: "Hands-On Execution",
        description: "We don't just deliver recommendations and walk away. Our team works alongside yours to ensure successful implementation.",
        stat: "200+",
        statLabel: "Projects Delivered",
      },
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
      const response = await fetch("/api/content?key=why-choose-us-section");
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
          key: "why-choose-us-section",
          type: "section",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "Why Choose Us section content saved successfully",
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

  const addReason = () => {
    setContent({
      ...content,
      reasons: [...content.reasons, { icon: "", title: "", description: "", stat: "", statLabel: "" }],
    });
  };

  const removeReason = (index) => {
    setContent({
      ...content,
      reasons: content.reasons.filter((_, i) => i !== index),
    });
  };

  const updateReason = (index, field, value) => {
    const updated = [...content.reasons];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, reasons: updated });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 p-6 border border-border rounded-lg">
      <h3 className="text-lg font-semibold">Why Choose Us Section</h3>
      
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Reasons</Label>
            <Button type="button" variant="outline" size="sm" onClick={addReason}>
              <Plus className="mr-2 h-4 w-4" />
              Add Reason
            </Button>
          </div>

          {content.reasons.map((reason, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reason {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReason(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <IconSelect
                label="Icon"
                value={reason.icon || ""}
                onChange={(icon) => updateReason(index, "icon", icon)}
              />
              <Input
                value={reason.title}
                onChange={(e) => updateReason(index, "title", e.target.value)}
                placeholder="Reason Title"
              />
              <Textarea
                value={reason.description}
                onChange={(e) => updateReason(index, "description", e.target.value)}
                placeholder="Reason Description"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={reason.stat}
                  onChange={(e) => updateReason(index, "stat", e.target.value)}
                  placeholder="Stat (e.g., 94%)"
                />
                <Input
                  value={reason.statLabel}
                  onChange={(e) => updateReason(index, "statLabel", e.target.value)}
                  placeholder="Stat Label"
                />
              </div>
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





