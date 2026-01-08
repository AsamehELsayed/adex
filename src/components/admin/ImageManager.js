"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Image as ImageIcon, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import ImageUploader from "./ImageUploader";

export default function ImageManager() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/upload");
      const data = await response.json();
      if (data.success) {
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Error loading images:", error);
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setIsDeleting(filename);
    try {
      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Deleted",
          description: "Image deleted successfully",
        });
        loadImages();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUploadSuccess = async (url) => {
    if (url) {
      // Image was uploaded, reload the list
      await loadImages();
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Upload successful",
          description: "Image uploaded successfully",
        });
        loadImages();
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6 border border-border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Image Manager</h3>
        <Button onClick={loadImages} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Upload Section */}
      <div className="p-4 bg-secondary rounded-lg">
        <h4 className="text-sm font-medium mb-4">Upload New Image</h4>
        <ImageUploader
          value=""
          onChange={handleUploadSuccess}
          label=""
        />
      </div>

      {/* Images Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.filename}
              className="group relative aspect-square border border-border rounded-lg overflow-hidden bg-secondary"
            >
              <Image
                src={image.url}
                alt={image.filename}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.filename)}
                    disabled={isDeleting === image.filename}
                  >
                    {isDeleting === image.filename ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <p className="text-xs text-white truncate">{image.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

