import { Link } from "wouter";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Sparkles, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white/80 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 text-white group cursor-pointer">
              <Sparkles className="w-6 h-6 text-secondary" />
              <span className="text-2xl font-serif font-bold">Glow Salon</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 mb-6">
              Experience the pinnacle of luxury beauty. Our expert stylists are dedicated to bringing out your inner glow.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/#services" className="hover:text-secondary transition-colors text-sm">Our Services</Link></li>
              <li><Link href="/#gallery" className="hover:text-secondary transition-colors text-sm">Gallery</Link></li>
              <li><Link href="/#about" className="hover:text-secondary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/booking" className="hover:text-secondary transition-colors text-sm">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-6">Opening Hours</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex justify-between"><span>Monday - Saturday</span> <span>10:00 AM - 8:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-white/60">14, MG Road, Koramangala, Bengaluru, Karnataka 560034</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-white/60">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-white/60">hello@glowsalon.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Glow Salon. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
