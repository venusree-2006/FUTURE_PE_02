import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash-based smooth scroll. If on home page, scroll directly.
  // If on another page, navigate to home with hash so browser scrolls on load.
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (location === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 80; // navbar height
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const navItems = [
    { name: "Home",     action: () => scrollToSection("home") },
    { name: "Services", action: () => scrollToSection("services") },
    { name: "Gallery",  action: () => scrollToSection("gallery") },
    { name: "About",    action: () => scrollToSection("about") },
    { name: "Contact",  action: () => scrollToSection("contact") },
  ];

  const scrolled = isScrolled || location !== "/";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <Sparkles className={`w-6 h-6 transition-colors duration-300 ${scrolled ? "text-primary" : "text-white group-hover:text-secondary"}`} />
          <span className={`text-2xl font-serif font-bold transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}>
            Glow Salon
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 hover:text-secondary relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-secondary hover:after:w-full after:transition-all after:duration-300 ${
                scrolled ? "text-foreground/80" : "text-white/90"
              }`}
            >
              {item.name}
            </button>
          ))}
          <Link
            href="/booking"
            className="px-6 py-2.5 bg-primary text-white text-sm tracking-wider uppercase font-medium rounded-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 transform"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen
            ? <X className={`w-6 h-6 ${scrolled ? "text-foreground" : "text-white"}`} />
            : <Menu className={`w-6 h-6 ${scrolled ? "text-foreground" : "text-white"}`} />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-6 px-6 flex flex-col gap-2 md:hidden border-t border-border"
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className="text-left py-3 text-lg font-serif text-foreground hover:text-primary transition-colors border-b border-border/30 last:border-0"
              >
                {item.name}
              </button>
            ))}
            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 px-6 py-3 bg-primary text-white text-center font-medium rounded-xl hover:bg-primary/90 transition-all"
            >
              Book Appointment
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
