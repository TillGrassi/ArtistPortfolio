import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaintingModal } from "./PaintingModal";
import { GalleryNavigation } from "./GalleryNavigation";
import type { Painting } from "@shared/schema";

export function GalleryView() {
  const [currentPaintingIndex, setCurrentPaintingIndex] = useState(0);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: paintings = [], isLoading } = useQuery({
    queryKey: ["/api/paintings"],
    refetchInterval: false,
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextPainting = () => {
    if (isRotating || paintings.length === 0) return;
    
    if (!isMobile) {
      setIsRotating(true);
      setTimeout(() => setIsRotating(false), 800);
    }
    
    setCurrentPaintingIndex((prev) => (prev + 1) % paintings.length);
  };

  const previousPainting = () => {
    if (isRotating || paintings.length === 0) return;
    
    if (!isMobile) {
      setIsRotating(true);
      setTimeout(() => setIsRotating(false), 800);
    }
    
    setCurrentPaintingIndex((prev) => prev === 0 ? paintings.length - 1 : prev - 1);
  };

  const openModal = (painting: Painting) => {
    setSelectedPainting(painting);
  };

  const closeModal = () => {
    setSelectedPainting(null);
  };

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-deep-charcoal mb-4">Gallery</h2>
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (paintings.length === 0) {
    return (
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-deep-charcoal mb-4">Gallery</h2>
            <p className="text-lg text-gray-700">No artworks available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentPainting = paintings[currentPaintingIndex];

  return (
    <>
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-deep-charcoal mb-4">Gallery</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Navigate through the gallery using the arrows to experience each painting as if walking through a contemporary art space
            </p>
          </div>

          {/* Desktop Gallery View */}
          <div className="hidden md:block">
            <div className="gallery-container relative h-96 mb-8" style={{ perspective: '1000px' }}>
              <div 
                className={`gallery-wall absolute inset-0 bg-white shadow-2xl rounded-lg overflow-hidden transition-transform duration-800 ease-in-out ${
                  isRotating ? 'animate-gallery-rotate' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white">
                  <img 
                    src={currentPainting.imageUrl}
                    alt={currentPainting.title}
                    className="max-h-full max-w-full object-contain shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openModal(currentPainting)}
                    loading="lazy"
                  />
                </div>
              </div>
              
              <GalleryNavigation 
                onNext={nextPainting}
                onPrevious={previousPainting}
                disabled={isRotating}
              />
            </div>
            
            {/* Painting Info */}
            <div className="text-center">
              <h3 className="font-serif text-2xl font-semibold text-deep-charcoal mb-2">
                {currentPainting.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentPainting.year} • {currentPainting.medium} • {currentPainting.size}
              </p>
              <span 
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentPainting.availability === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : currentPainting.availability === 'sold'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {currentPainting.featured && (
                  <i className="fas fa-star text-yellow-500 mr-2 text-xs"></i>
                )}
                <i className={`fas fa-circle mr-2 text-xs ${
                  currentPainting.availability === 'available' ? 'text-green-500' : 'text-orange-500'
                }`}></i>
                {currentPainting.availability === 'available' ? 'Available' : 
                 currentPainting.availability === 'sold' ? 'Sold' : 'Not for Sale'}
              </span>
            </div>

            {/* Gallery Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {paintings.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPaintingIndex ? 'bg-deep-charcoal' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentPaintingIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Mobile Gallery Grid */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {paintings.map((painting) => (
              <div 
                key={painting.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img 
                  src={painting.imageUrl}
                  alt={painting.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => openModal(painting)}
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-serif text-lg font-semibold text-deep-charcoal mb-1">
                    {painting.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {painting.year} • {painting.medium} • {painting.size}
                  </p>
                  <span 
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      painting.availability === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : painting.availability === 'sold'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {painting.featured && (
                      <i className="fas fa-star text-yellow-500 mr-1 text-xs"></i>
                    )}
                    {painting.availability === 'available' ? 'Available' : 
                     painting.availability === 'sold' ? 'Sold' : 'Not for Sale'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedPainting && (
        <PaintingModal 
          painting={selectedPainting}
          onClose={closeModal}
        />
      )}
    </>
  );
}
