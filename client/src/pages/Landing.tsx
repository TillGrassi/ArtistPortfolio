import { Navigation } from "@/components/Navigation/Navigation";
import { GalleryView } from "@/components/Gallery/GalleryView";
import { AboutSection } from "@/components/About/AboutSection";
import { ContactForm } from "@/components/Contact/ContactForm";

export default function Landing() {
  return (
    <div className="min-h-screen bg-warm-gray">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-warm-gray">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-deep-charcoal mb-6">
            Contemporary Expressions
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Exploring the intersection of emotion and form through oil paintings that capture the essence of modern life
          </p>
          <a 
            href="#gallery" 
            className="inline-flex items-center bg-deep-charcoal text-white px-8 py-4 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 font-medium"
          >
            View Gallery
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </section>

      <GalleryView />
      <AboutSection />
      <ContactForm />

      {/* Footer */}
      <footer className="bg-deep-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-2xl font-semibold mb-4">Elena Rodriguez</h3>
              <p className="text-gray-300 leading-relaxed">
                Contemporary artist exploring the intersection of emotion and form through 
                bold expressions and carefully crafted compositions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#gallery" className="block text-gray-300 hover:text-white transition-colors">Gallery</a>
                <a href="#about" className="block text-gray-300 hover:text-white transition-colors">About</a>
                <a href="#contact" className="block text-gray-300 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Elena Rodriguez. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
