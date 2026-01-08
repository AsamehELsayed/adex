"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.data || []);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (serviceData) => {
    setIsSaving(true);
    try {
      const url = editingService
        ? `/api/services/${editingService.id}`
        : "/api/services";
      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: editingService ? "Updated" : "Created",
          description: `Service ${editingService ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        setEditingService(null);
        loadServices();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Deleted",
          description: "Service deleted successfully",
        });
        loadServices();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 p-6 border border-border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Services Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Create New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Update the service details below"
                  : "Fill in the details to create a new service"}
              </DialogDescription>
            </DialogHeader>
            <ServiceForm
              service={editingService}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No services found. Create your first service.
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="p-4 border border-border rounded-lg flex items-start justify-between"
            >
              <div className="flex-1">
                <h4 className="font-semibold">{service.title}</h4>
                {service.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.subtitle}
                  </p>
                )}
                {service.description && (
                  <p className="text-sm mt-2 line-clamp-2">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Order: {service.order || 0}</span>
                  <span>Active: {service.isActive ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(service)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ServiceForm({ service, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon: "",
    capabilities: [],
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        subtitle: service.subtitle || "",
        description: service.description || "",
        icon: service.icon || "",
        capabilities: service.capabilities || [],
        order: service.order || 0,
        isActive: service.isActive !== undefined ? service.isActive : true,
      });
    }
  }, [service]);

  const [newCapability, setNewCapability] = useState("");

  const addCapability = () => {
    if (newCapability.trim()) {
      setFormData({
        ...formData,
        capabilities: [...formData.capabilities, newCapability.trim()],
      });
      setNewCapability("");
    }
  };

  const removeCapability = (index) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={formData.subtitle}
          onChange={(e) =>
            setFormData({ ...formData, subtitle: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Icon (Lucide icon name)</Label>
        <Input
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="e.g., TrendingUp"
        />
      </div>

      <div className="space-y-2">
        <Label>Capabilities</Label>
        <div className="flex gap-2">
          <Input
            value={newCapability}
            onChange={(e) => setNewCapability(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCapability();
              }
            }}
            placeholder="Add capability"
          />
          <Button type="button" onClick={addCapability}>
            Add
          </Button>
        </div>
        <div className="space-y-1 mt-2">
          {formData.capabilities.map((cap, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-secondary rounded"
            >
              <span className="text-sm">{cap}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCapability(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Order</Label>
          <Input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Active</Label>
          <select
            value={formData.isActive ? "true" : "false"}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.value === "true" })
            }
            className="w-full h-10 px-3 border border-border rounded-md"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </form>
  );
}





