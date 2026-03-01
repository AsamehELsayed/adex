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
  const [services, setServices] = useState([]);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isServicesSaving, setIsServicesSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
    loadServices();
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

  const loadServices = async () => {
    setIsServicesLoading(true);
    try {
      const response = await fetch("/api/services");
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const mappedServices = result.data.map((service) => ({
          id: service.id,
          title: service.title || "",
          subtitle: service.subtitle || "",
          description: service.description || "",
          capabilities: Array.isArray(service.capabilities) ? service.capabilities : [],
          ar: {
            title: service.serviceData?.ar?.title || "",
            subtitle: service.serviceData?.ar?.subtitle || "",
            description: service.serviceData?.ar?.description || "",
            capabilities: Array.isArray(service.serviceData?.ar?.capabilities)
              ? service.serviceData.ar.capabilities
              : [],
          },
        }));
        setServices(mappedServices);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsServicesLoading(false);
    }
  };

  const updateServiceArabicField = (index, field, value) => {
    setServices((previous) =>
      previous.map((service, serviceIndex) =>
        serviceIndex === index
          ? { ...service, ar: { ...service.ar, [field]: value } }
          : service
      )
    );
  };

  const handleSaveServiceTranslations = async () => {
    setIsServicesSaving(true);
    try {
      const saveRequests = services.map((service) =>
        fetch(`/api/services/${service.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceData: {
              ar: {
                title: service.ar.title,
                subtitle: service.ar.subtitle,
                description: service.ar.description,
                capabilities: service.ar.capabilities,
              },
            },
          }),
        })
      );

      const responses = await Promise.all(saveRequests);
      const results = await Promise.all(responses.map((response) => response.json()));
      const failedSave = results.find((result) => !result.success);

      if (failedSave) {
        throw new Error(failedSave.error || "Failed to save service translations");
      }

      toast({
        title: "Saved",
        description: "Service translations saved successfully",
      });
      loadServices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service translations",
        variant: "destructive",
      });
    } finally {
      setIsServicesSaving(false);
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

        {/* Services Arabic Translation */}
        <div className="space-y-4 p-4 bg-secondary rounded-lg">
          <h4 className="font-semibold">Service Cards Arabic Translation</h4>
          <p className="text-sm text-muted-foreground">
            Service cards on the Services page come from Services Management. Translate them here.
          </p>
          {isServicesLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : services.length ? (
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={service.id} className="space-y-3 p-4 border border-border rounded-md bg-background">
                  <h5 className="font-medium">Service {index + 1}</h5>
                  <div className="space-y-2">
                    <Label>English Title</Label>
                    <Input value={service.title} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Arabic Title</Label>
                    <Input
                      dir="rtl"
                      value={service.ar.title}
                      onChange={(event) => updateServiceArabicField(index, "title", event.target.value)}
                      placeholder="عنوان الخدمة"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>English Subtitle</Label>
                    <Input value={service.subtitle} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Arabic Subtitle</Label>
                    <Input
                      dir="rtl"
                      value={service.ar.subtitle}
                      onChange={(event) => updateServiceArabicField(index, "subtitle", event.target.value)}
                      placeholder="العنوان الفرعي"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>English Description</Label>
                    <Textarea value={service.description} readOnly rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Arabic Description</Label>
                    <Textarea
                      dir="rtl"
                      value={service.ar.description}
                      onChange={(event) => updateServiceArabicField(index, "description", event.target.value)}
                      rows={3}
                      placeholder="وصف الخدمة"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>English Capabilities (one per line)</Label>
                    <Textarea value={service.capabilities.join("\n")} readOnly rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Arabic Capabilities (one per line)</Label>
                    <Textarea
                      dir="rtl"
                      value={service.ar.capabilities.join("\n")}
                      onChange={(event) =>
                        updateServiceArabicField(
                          index,
                          "capabilities",
                          event.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        )
                      }
                      rows={4}
                      placeholder={"ميزة 1\nميزة 2\nميزة 3"}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveServiceTranslations} disabled={isServicesSaving}>
                {isServicesSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Service Translations...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Service Translations
                  </>
                )}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No services found. Add services in Services Management first.
            </p>
          )}
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





