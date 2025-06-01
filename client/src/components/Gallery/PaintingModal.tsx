import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Painting } from "@shared/schema";

interface PaintingModalProps {
  painting: Painting;
  onClose: () => void;
}

export function PaintingModal({ painting, onClose }: PaintingModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleInquiry = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      onClose();
      contactSection.scrollIntoView({ behavior: 'smooth' });
      
      // Pre-fill contact form if possible
      setTimeout(() => {
        const subjectSelect = document.querySelector('select[name="subject"]') as HTMLSelectElement;
        const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
        
        if (subjectSelect) {
          subjectSelect.value = 'purchase';
        }
        
        if (messageTextarea && painting) {
          messageTextarea.value = `I'm interested in purchasing "${painting.title}" (${painting.year}). Could you please provide more information about pricing and availability?`;
        }
      }, 100);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white max-w-4xl mx-4 rounded-lg overflow-hidden shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button 
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors z-10"
            onClick={onClose}
          >
            <i className="fas fa-times text-lg"></i>
          </button>
          
          <img 
            src={painting.imageUrl}
            alt={painting.title}
            className="w-full h-96 object-cover"
          />
        </div>
        
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-3xl font-semibold text-deep-charcoal mb-4">
                {painting.title}
              </h3>
              
              <div className="space-y-3 text-gray-700 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Year:</span>
                  <span>{painting.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Medium:</span>
                  <span>{painting.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dimensions:</span>
                  <span>{painting.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      painting.availability === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : painting.availability === 'sold'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <i className={`fas fa-circle mr-2 text-xs ${
                      painting.availability === 'available' ? 'text-green-500' : 'text-orange-500'
                    }`}></i>
                    {painting.availability === 'available' ? 'Available' : 
                     painting.availability === 'sold' ? 'Sold' : 'Not for Sale'}
                  </span>
                </div>
              </div>
              
              {painting.description && (
                <p className="text-gray-600 leading-relaxed mb-6">
                  {painting.description}
                </p>
              )}

              {painting.tags && painting.tags.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 mb-3">Tags:</h5>
                  <div className="flex flex-wrap gap-2">
                    {painting.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="bg-warm-gray p-6 rounded-lg">
                <h4 className="font-serif text-xl font-semibold text-deep-charcoal mb-4">
                  Interested in this piece?
                </h4>
                
                {painting.availability === 'available' ? (
                  <>
                    <p className="text-gray-600 mb-6">
                      This artwork is available for purchase. Get in touch to discuss pricing, 
                      shipping options, and payment arrangements.
                    </p>
                    <Button 
                      className="w-full bg-deep-charcoal text-white hover:bg-gray-800"
                      onClick={handleInquiry}
                    >
                      Inquire About Purchase
                      <i className="fas fa-envelope ml-2"></i>
                    </Button>
                  </>
                ) : painting.availability === 'sold' ? (
                  <>
                    <p className="text-gray-600 mb-6">
                      This piece has been sold to a private collector. However, I may have similar works available or can create a commission piece.
                    </p>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={handleInquiry}
                    >
                      <i className="fas fa-check-circle mr-2"></i>
                      Inquire About Similar Works
                    </Button>
                  </>
                ) : (
                  <div className="w-full text-center py-3 px-6 bg-gray-200 text-gray-500 font-medium rounded">
                    <i className="fas fa-info-circle mr-2"></i>
                    This piece is not for sale
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h5 className="font-medium text-gray-700 mb-3">Share this artwork:</h5>
                <div className="flex space-x-3">
                  <button 
                    className="text-gray-500 hover:text-deep-charcoal transition-colors"
                    onClick={() => navigator.share?.({ 
                      title: painting.title, 
                      text: `Check out "${painting.title}" by Elena Rodriguez`,
                      url: window.location.href 
                    })}
                  >
                    <i className="fab fa-facebook text-xl"></i>
                  </button>
                  <button 
                    className="text-gray-500 hover:text-deep-charcoal transition-colors"
                    onClick={() => navigator.share?.({ 
                      title: painting.title, 
                      text: `Check out "${painting.title}" by Elena Rodriguez`,
                      url: window.location.href 
                    })}
                  >
                    <i className="fab fa-twitter text-xl"></i>
                  </button>
                  <button 
                    className="text-gray-500 hover:text-deep-charcoal transition-colors"
                    onClick={() => navigator.share?.({ 
                      title: painting.title, 
                      text: `Check out "${painting.title}" by Elena Rodriguez`,
                      url: window.location.href 
                    })}
                  >
                    <i className="fab fa-pinterest text-xl"></i>
                  </button>
                  <button 
                    className="text-gray-500 hover:text-deep-charcoal transition-colors"
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                  >
                    <i className="fas fa-link text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
