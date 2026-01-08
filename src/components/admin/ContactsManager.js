"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Mail, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      if (data.success) {
        setContacts(data.data || []);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Deleted",
          description: "Contact deleted successfully",
        });
        loadContacts();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Updated",
          description: "Contact status updated",
        });
        loadContacts();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 p-6 border border-border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contacts Management</h3>
        <div className="text-sm text-muted-foreground">
          Total: {contacts.length} contacts
        </div>
      </div>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No contacts found.
          </p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 border border-border rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{contact.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        contact.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : contact.status === "read"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-foreground"
                      >
                        {contact.email}
                      </a>
                    </div>
                    {contact.company && (
                      <div>Company: {contact.company}</div>
                    )}
                    <div className="mt-2 text-foreground">{contact.message}</div>
                    <div className="text-xs mt-2">
                      Received: {new Date(contact.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContact(contact)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact Details</DialogTitle>
                        <DialogDescription>
                          Full contact information
                        </DialogDescription>
                      </DialogHeader>
                      {selectedContact && (
                        <div className="space-y-4">
                          <div>
                            <strong>Name:</strong> {selectedContact.name}
                          </div>
                          <div>
                            <strong>Email:</strong> {selectedContact.email}
                          </div>
                          {selectedContact.company && (
                            <div>
                              <strong>Company:</strong> {selectedContact.company}
                            </div>
                          )}
                          <div>
                            <strong>Message:</strong>
                            <p className="mt-2 whitespace-pre-wrap">
                              {selectedContact.message}
                            </p>
                          </div>
                          <div>
                            <strong>Status:</strong> {selectedContact.status}
                          </div>
                          <div>
                            <strong>Received:</strong>{" "}
                            {new Date(selectedContact.createdAt).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <select
                    value={contact.status}
                    onChange={(e) =>
                      handleStatusChange(contact.id, e.target.value)
                    }
                    className="h-9 px-3 border border-border rounded-md text-sm"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}





