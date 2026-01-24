"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    fetch("/api/auth/session", {
      credentials: "include", // Ensure cookies are sent
      cache: "no-store", // Don't cache auth checks
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push("/admin");
        }
      })
      .catch((error) => {
        console.error("Session check error:", error);
        // Don't redirect on error, let user try to login
      });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent and received
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard",
        });
        
        // Wait a brief moment to ensure cookie is set, then verify session before redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verify session before redirecting
        try {
          const sessionResponse = await fetch("/api/auth/session", {
            credentials: "include",
          });
          const sessionData = await sessionResponse.json();
          
          if (sessionData.authenticated) {
            // Force a hard redirect to ensure fresh page load
            window.location.href = "/admin";
          } else {
            // If session check fails, try redirect anyway (cookie might still be setting)
            router.push("/admin");
            // Force reload after a short delay if still on login page
            setTimeout(() => {
              if (window.location.pathname === "/admin/login") {
                window.location.href = "/admin";
              }
            }, 500);
          }
        } catch (sessionError) {
          console.error("Session check error:", sessionError);
          // Redirect anyway - the middleware will handle auth
          window.location.href = "/admin";
        }
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Admin Login</h1>
            <p className="text-muted-foreground">Access the content management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12"
                placeholder="Enter your username or email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}





