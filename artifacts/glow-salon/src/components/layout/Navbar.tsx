import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "Gallery", href: "/#gallery" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled || location !== "/"
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <Sparkles className={`w-6 h-6 transition-colors duration-300 ${isScrolled || location !== "/" ? "text-primary" : "text-white group-hover:text-secondary"}`} />
          <span className={`text-2xl font-serif font-bold transition-colors duration-300 ${isScrolled || location !== "/" ? "text-foreground" : "text-white"}`}>
            Glow Salon
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 hover:text-secondary relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-secondary hover:after:w-full after:transition-all after:duration-300 ${
                isScrolled || location !== "/" ? "text-foreground/80" : "text-white/90"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/booking"
            className="px-6 py-2.5 bg-primary text-white text-sm tracking-wider uppercase font-medium rounded-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 ${isScrolled || location !== "/" ? "text-foreground" : "text-white"}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isScrolled || location !== "/" ? "text-foreground" : "text-white"}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-6 px-4 flex flex-col gap-4 md:hidden border-t border-border"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-serif text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 px-6 py-3 bg-primary text-white text-center font-medium rounded-sm"
            >
              Book Appointment
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
