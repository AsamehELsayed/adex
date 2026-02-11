"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function FooterEditor() {
  const [content, setContent] = useState({
    brandName: "Adex",
    brandDescription: "Strategic consulting for enterprises ready to transform their vision into measurable results. We partner with leaders who demand excellence.",
    socialLinks: [
      { name: "LinkedIn", url: "#", icon: "linkedin" },
      { name: "Twitter", url: "#", icon: "twitter" },
    ],
    navigationLinks: [
      { name: "About Us", path: "/about" },
      { name: "Our Services", path: "/services" },
      { name: "Vision & Values", path: "/vision" },
      { name: "Contact", path: "/contact" },
    ],
    contactInfo: {
      address: "One World Trade Center\nSuite 8500\nNew York, NY 10007",
      email: "hello@apexconsulting.com",
      phone: "+1 (212) 555-1234",
    },
    bottomLinks: [
      { name: "Privacy Policy", url: "#" },
      { name: "Terms of Service", url: "#" },
    ],
    copyrightText: "Adex Consulting. All rights reserved.",
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
      const response = await fetch("/api/content?key=footer-section");
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
          key: "footer-section",
          type: "section",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "Footer content saved successfully",
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

  const addNavigationLink = () => {
    setContent({
      ...content,
      navigationLinks: [...content.navigationLinks, { name: "", path: "" }],
    });
  };

  const removeNavigationLink = (index) => {
    const newLinks = content.navigationLinks.filter((_, i) => i !== index);
    setContent({ ...content, navigationLinks: newLinks });
  };

  const updateNavigationLink = (index, field, value) => {
    const newLinks = [...content.navigationLinks];
    newLinks[index][field] = value;
    setContent({ ...content, navigationLinks: newLinks });
  };

  const addSocialLink = () => {
    setContent({
      ...content,
      socialLinks: [...content.socialLinks, { name: "", url: "#", icon: "linkedin" }],
    });
  };

  const removeSocialLink = (index) => {
    const newLinks = content.socialLinks.filter((_, i) => i !== index);
    setContent({ ...content, socialLinks: newLinks });
  };

  const updateSocialLink = (index, field, value) => {
    const newLinks = [...content.socialLinks];
    newLinks[index][field] = value;
    setContent({ ...content, socialLinks: newLinks });
  };

  const addBottomLink = () => {
    setContent({
      ...content,
      bottomLinks: [...content.bottomLinks, { name: "", url: "#" }],
    });
  };

  const removeBottomLink = (index) => {
    const newLinks = content.bottomLinks.filter((_, i) => i !== index);
    setContent({ ...content, bottomLinks: newLinks });
  };

  const updateBottomLink = (index, field, value) => {
    const newLinks = [...content.bottomLinks];
    newLinks[index][field] = value;
    setContent({ ...content, bottomLinks: newLinks });
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
      <h3 className="text-lg font-semibold">Footer Section</h3>

      <div className="space-y-6">
        {/* Brand Section */}
        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <h4 className="font-semibold text-sm">Brand Section</h4>
          
          <div className="space-y-2">
            <Label>Brand Name</Label>
            <Input
              value={content.brandName}
              onChange={(e) => setContent({ ...content, brandName: e.target.value })}
              placeholder="Adex"
            />
          </div>

          <div className="space-y-2">
            <Label>Brand Description</Label>
            <Textarea
              value={content.brandDescription}
              onChange={(e) => setContent({ ...content, brandDescription: e.target.value })}
              placeholder="Brand description..."
              rows={3}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Social Links</h4>
            <Button size="sm" variant="outline" onClick={addSocialLink}>
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>

          {content.socialLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label>Name</Label>
                <Input
                  value={link.name}
                  onChange={(e) => updateSocialLink(index, "name", e.target.value)}
                  placeholder="LinkedIn"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Icon</Label>
                <Input
                  value={link.icon}
                  onChange={(e) => updateSocialLink(index, "icon", e.target.value)}
                  placeholder="linkedin"
                />
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeSocialLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Navigation Links */}
        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Navigation Links</h4>
            <Button size="sm" variant="outline" onClick={addNavigationLink}>
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>

          {content.navigationLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label>Name</Label>
                <Input
                  value={link.name}
                  onChange={(e) => updateNavigationLink(index, "name", e.target.value)}
                  placeholder="About Us"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Path</Label>
                <Input
                  value={link.path}
                  onChange={(e) => updateNavigationLink(index, "path", e.target.value)}
                  placeholder="/about"
                />
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeNavigationLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <h4 className="font-semibold text-sm">Contact Information</h4>

          <div className="space-y-2">
            <Label>Address (use \n for line breaks)</Label>
            <Textarea
              value={content.contactInfo.address}
              onChange={(e) =>
                setContent({
                  ...content,
                  contactInfo: { ...content.contactInfo, address: e.target.value },
                })
              }
              placeholder="Address..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={content.contactInfo.email}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contactInfo: { ...content.contactInfo, email: e.target.value },
                  })
                }
                placeholder="hello@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={content.contactInfo.phone}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contactInfo: { ...content.contactInfo, phone: e.target.value },
                  })
                }
                placeholder="+1 (212) 555-1234"
              />
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Bottom Links (Privacy, Terms, etc.)</h4>
            <Button size="sm" variant="outline" onClick={addBottomLink}>
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>

          {content.bottomLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label>Name</Label>
                <Input
                  value={link.name}
                  onChange={(e) => updateBottomLink(index, "name", e.target.value)}
                  placeholder="Privacy Policy"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) => updateBottomLink(index, "url", e.target.value)}
                  placeholder="#"
                />
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeBottomLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Copyright Text */}
        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <h4 className="font-semibold text-sm">Copyright</h4>
          
          <div className="space-y-2">
            <Label>Copyright Text (year will be added automatically)</Label>
            <Input
              value={content.copyrightText}
              onChange={(e) => setContent({ ...content, copyrightText: e.target.value })}
              placeholder="Adex Consulting. All rights reserved."
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
