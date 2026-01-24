"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Home, 
  FileText, 
  Briefcase, 
  Mail, 
  Settings,
  Save,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import HeroEditor from "@/components/admin/HeroEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import ServicesEditor from "@/components/admin/ServicesEditor";
import WhyChooseUsEditor from "@/components/admin/WhyChooseUsEditor";
import CTAEditor from "@/components/admin/CTAEditor";
import ServicesManager from "@/components/admin/ServicesManager";
import ContactsManager from "@/components/admin/ContactsManager";
import ContactPageEditor from "@/components/admin/ContactPageEditor";
import AboutPageEditor from "@/components/admin/AboutPageEditor";
import ServicesPageEditor from "@/components/admin/ServicesPageEditor";
import ImageManager from "@/components/admin/ImageManager";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include", // Ensure cookies are sent
        cache: "no-store", // Don't cache auth checks
      });
      const data = await response.json();

      if (data.authenticated) {
        setUser(data.user);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container-luxury py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.username}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-luxury py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="home">
              <Home className="mr-2 h-4 w-4" />
              Home Page
            </TabsTrigger>
            <TabsTrigger value="about">
              <FileText className="mr-2 h-4 w-4" />
              About Page
            </TabsTrigger>
            <TabsTrigger value="services">
              <Briefcase className="mr-2 h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <Mail className="mr-2 h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="contact-page">
              <Settings className="mr-2 h-4 w-4" />
              Contact Page
            </TabsTrigger>
            <TabsTrigger value="images">
              <ImageIcon className="mr-2 h-4 w-4" />
              Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8">
            <div className="bg-card border border-border p-6">
              <h2 className="text-xl font-semibold mb-6">Home Page Content</h2>
              <div className="space-y-8">
                <HeroEditor />
                <AboutEditor />
                <ServicesEditor />
                <WhyChooseUsEditor />
                <CTAEditor />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-8">
            <AboutPageEditor />
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <div className="bg-card border border-border p-6">
              <h2 className="text-xl font-semibold mb-6">Services Page Content</h2>
              <ServicesPageEditor />
            </div>
            <ServicesManager />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-8">
            <ContactsManager />
          </TabsContent>

          <TabsContent value="contact-page" className="space-y-8">
            <ContactPageEditor />
          </TabsContent>

          <TabsContent value="images" className="space-y-8">
            <ImageManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

