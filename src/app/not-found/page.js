"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container-luxury text-center">
        <span className="label-uppercase mb-4 block">Error 404</span>
        <h1 className="heading-display mb-6">Page Not Found</h1>
        <p className="body-large max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button variant="premium" size="premium" asChild>
          <Link href="/">
            <ArrowLeft size={16} className="mr-2" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}





