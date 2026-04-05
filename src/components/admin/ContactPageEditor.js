"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function ContactPageEditor() {
  const [content, setContent] = useState({
    hero: {
      label: "Contact Us",
      title: "Let's Start a\nConversation",
      description: "Every great transformation begins with a conversation. We'd love to hear about your challenges and explore how we can help.",
    },
    form: {
      title: "Send Us a Message",
      nameLabel: "Full Name *",
      emailLabel: "Email Address *",
      companyLabel: "Company",
      phoneLabel: "Phone Number *",
      messageLabel: "How Can We Help? *",
      submitButton: "Send Message",
    },
    info: {
      title: "Get in Touch",
      description: "Our team is available to discuss your strategic needs. Reach out through any of the channels below.",
      address: {
        title: "Headquarters",
        line1: "One World Trade Center",
        line2: "Suite 8500",
        line3: "New York, NY 10007",
      },
      email: {
        title: "Email",
        value: "hello@apexconsulting.com",
      },
      phone: {
        title: "Phone",
        value: "+1 (212) 555-1234",
      },
      hours: "Monday – Friday: 9:00 AM – 6:00 PM EST",
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
      const response = await fetch("/api/content?key=contact-page");
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
          key: "contact-page",
          type: "page",
          data: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Saved",
          description: "Contact page content saved successfully",
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
      <h3 className="text-lg font-semibold">Contact Page Content</h3>
      
      <div className="space-y-6">
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

        {/* Form Section */}
        <div className="space-y-4 p-4 bg-secondary rounded-lg">
          <h4 className="font-semibold">Form Section</h4>
          <div className="space-y-3">
            <Input
              value={content.form.title}
              onChange={(e) => setContent({ ...content, form: { ...content.form, title: e.target.value } })}
              placeholder="Form Title"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={content.form.nameLabel}
                onChange={(e) => setContent({ ...content, form: { ...content.form, nameLabel: e.target.value } })}
                placeholder="Name Label"
              />
              <Input
                value={content.form.emailLabel}
                onChange={(e) => setContent({ ...content, form: { ...content.form, emailLabel: e.target.value } })}
                placeholder="Email Label"
              />
            </div>
            <Input
              value={content.form.phoneLabel}
              onChange={(e) => setContent({ ...content, form: { ...content.form, phoneLabel: e.target.value } })}
              placeholder="Phone Label"
            />
            <Input
              value={content.form.companyLabel}
              onChange={(e) => setContent({ ...content, form: { ...content.form, companyLabel: e.target.value } })}
              placeholder="Company Label"
            />
            <Input
              value={content.form.messageLabel}
              onChange={(e) => setContent({ ...content, form: { ...content.form, messageLabel: e.target.value } })}
              placeholder="Message Label"
            />
            <Input
              value={content.form.submitButton}
              onChange={(e) => setContent({ ...content, form: { ...content.form, submitButton: e.target.value } })}
              placeholder="Submit Button Text"
            />
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-4 p-4 bg-secondary rounded-lg">
          <h4 className="font-semibold">Contact Information</h4>
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={content.info.title}
                onChange={(e) => setContent({ ...content, info: { ...content.info, title: e.target.value } })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.info.description}
                onChange={(e) => setContent({ ...content, info: { ...content.info, description: e.target.value } })}
                rows={2}
              />
            </div>
            <div className="space-y-3">
              <Label>Address</Label>
              <Input
                value={content.info.address.title}
                onChange={(e) => setContent({ ...content, info: { ...content.info, address: { ...content.info.address, title: e.target.value } } })}
                placeholder="Address Title"
              />
              <Input
                value={content.info.address.line1}
                onChange={(e) => setContent({ ...content, info: { ...content.info, address: { ...content.info.address, line1: e.target.value } } })}
                placeholder="Address Line 1"
              />
              <Input
                value={content.info.address.line2}
                onChange={(e) => setContent({ ...content, info: { ...content.info, address: { ...content.info.address, line2: e.target.value } } })}
                placeholder="Address Line 2"
              />
              <Input
                value={content.info.address.line3}
                onChange={(e) => setContent({ ...content, info: { ...content.info, address: { ...content.info.address, line3: e.target.value } } })}
                placeholder="Address Line 3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email Label</Label>
                <Input
                  value={content.info.email.title}
                  onChange={(e) => setContent({ ...content, info: { ...content.info, email: { ...content.info.email, title: e.target.value } } })}
                  placeholder="Email Label"
                />
                <Label>Email Address</Label>
                <Input
                  value={content.info.email.value}
                  onChange={(e) => setContent({ ...content, info: { ...content.info, email: { ...content.info.email, value: e.target.value } } })}
                  placeholder="Email Address"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Label</Label>
                <Input
                  value={content.info.phone.title}
                  onChange={(e) => setContent({ ...content, info: { ...content.info, phone: { ...content.info.phone, title: e.target.value } } })}
                  placeholder="Phone Label"
                />
                <Label>Phone Number</Label>
                <Input
                  value={content.info.phone.value}
                  onChange={(e) => setContent({ ...content, info: { ...content.info, phone: { ...content.info.phone, value: e.target.value } } })}
                  placeholder="Phone Number"
                />
              </div>
            </div>
            <div>
              <Label>Office Hours</Label>
              <Input
                value={content.info.hours}
                onChange={(e) => setContent({ ...content, info: { ...content.info, hours: e.target.value } })}
                placeholder="Office Hours"
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





