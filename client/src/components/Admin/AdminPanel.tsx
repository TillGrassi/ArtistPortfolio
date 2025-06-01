import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArtworkUpload } from "./ArtworkUpload";
import { useAuth } from "@/hooks/useAuth";
import type { Painting, ContactMessage } from "@shared/schema";

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const { data: paintings = [] } = useQuery({
    queryKey: ["/api/paintings"],
    enabled: isAuthenticated && isOpen,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/admin/messages"],
    enabled: isAuthenticated && isOpen,
  });

  useEffect(() => {
    const handleOpenAdmin = () => {
      if (isAuthenticated) {
        setIsOpen(true);
      }
    };

    window.addEventListener('openAdminPanel', handleOpenAdmin);
    return () => window.removeEventListener('openAdminPanel', handleOpenAdmin);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-semibold text-deep-charcoal">
            Gallery Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload New Artwork */}
            <div className="lg:col-span-2">
              <ArtworkUpload />
            </div>
            
            {/* Current Artworks Management */}
            <div>
              <div className="bg-warm-gray rounded-lg p-6 mb-6">
                <h3 className="font-serif text-xl font-semibold text-deep-charcoal mb-6">
                  Current Artworks
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-auto">
                  {paintings.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No artworks uploaded yet.</p>
                  ) : (
                    paintings.map((painting: Painting) => (
                      <div key={painting.id} className="border border-light-border rounded-lg p-4 bg-white">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={painting.imageUrl}
                            alt={painting.title}
                            className="w-12 h-12 object-cover rounded" 
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{painting.title}</h4>
                            <p className="text-sm text-gray-600">
                              {painting.year} • {painting.availability}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-500 hover:text-deep-charcoal transition-colors">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="text-gray-500 hover:text-red-500 transition-colors">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Contact Messages */}
              <div className="bg-warm-gray rounded-lg p-6">
                <h3 className="font-serif text-xl font-semibold text-deep-charcoal mb-6">
                  Recent Messages
                </h3>
                
                <div className="space-y-4 max-h-64 overflow-auto">
                  {messages.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No messages yet.</p>
                  ) : (
                    messages.slice(0, 5).map((message: ContactMessage) => (
                      <div key={message.id} className="border border-light-border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{message.name}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{message.email}</p>
                        <p className="text-sm text-gray-800 font-medium mb-2">{message.subject}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
