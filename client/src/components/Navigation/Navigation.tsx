import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  showAdminAccess?: boolean;
}

export function Navigation({ showAdminAccess = false }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [language, setLanguage] = useState('en');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['gallery', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-light-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a 
              href="#" 
              className="font-serif text-2xl font-semibold text-deep-charcoal hover:text-gray-600 transition-colors"
            >
              Till Graßmann
            </a>
            <div className="hidden md:flex space-x-6">
              <a 
                href="#gallery" 
                className="text-gray-700 hover:text-deep-charcoal transition-colors font-medium"
              >
                Gallery
              </a>
              <a 
                href="#about" 
                className="text-gray-700 hover:text-deep-charcoal transition-colors font-medium"
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-gray-700 hover:text-deep-charcoal transition-colors font-medium"
              >
                Contact
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 hover:text-deep-charcoal"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            
            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                {user && (
                  <span className="text-sm text-gray-600">
                    Welcome, {user.firstName || user.email}
                  </span>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex">
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  size="sm"
                >
                  Login
                </Button>
              </div>
            )}
            
            {/* Admin Access */}
            {showAdminAccess && isAuthenticated && (
              <button 
                className="text-sm text-gray-500 hover:text-deep-charcoal transition-colors"
                onClick={() => {
                  const event = new CustomEvent('openAdminPanel');
                  window.dispatchEvent(event);
                }}
              >
                <i className="fas fa-user-cog"></i>
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-light-border mt-4">
            <div className="px-6 py-4 space-y-3">
              <a 
                href="#gallery" 
                className="block text-gray-700 hover:text-deep-charcoal transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </a>
              <a 
                href="#about" 
                className="block text-gray-700 hover:text-deep-charcoal transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="block text-gray-700 hover:text-deep-charcoal transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              {isAuthenticated ? (
                <button 
                  className="block w-full text-left text-gray-700 hover:text-deep-charcoal transition-colors"
                  onClick={() => window.location.href = '/api/logout'}
                >
                  Logout
                </button>
              ) : (
                <button 
                  className="block w-full text-left text-gray-700 hover:text-deep-charcoal transition-colors"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
