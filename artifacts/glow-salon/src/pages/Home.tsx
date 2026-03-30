import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star, Clock, CheckCircle2, MapPin, Phone, Trophy, Award, ThumbsUp } from "lucide-react";
import { useGetServices, useSubmitContact } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

// Gallery data — real Unsplash salon photos
const galleryItems = [
  { id: 1, src: "photo-1562322140-8baeececf3df", alt: "Hair colour highlights", label: "Hair Colour", category: "hair", featured: true },
  { id: 2, src: "photo-1583939003579-730e3918a45a", alt: "Indian bridal makeup", label: "Bridal Makeup", category: "bridal", featured: false },
  { id: 3, src: "photo-1570172619644-dfd03ed5d881", alt: "Facial skincare treatment", label: "Facial & Skincare", category: "skin", featured: false },
  { id: 4, src: "photo-1604654894610-df63bc536371", alt: "Nail art design", label: "Nail Art", category: "nails", featured: false },
  { id: 6, src: "photo-1605497788044-5a32c7078486", alt: "Hair blowout and styling", label: "Hair Styling", category: "hair", featured: false },
  { id: 7, src: "photo-1596755389378-c31d21fd1273", alt: "Skin care facial", label: "Skin Treatment", category: "skin", featured: false },
  { id: 8, src: "photo-1604902396830-aca29e19b067", alt: "Manicure and nail colour", label: "Manicure", category: "nails", featured: false },
  { id: 9, src: "photo-1522337233671-de82e3a96c8e", alt: "Hair spa treatment", label: "Hair Spa", category: "hair", featured: false },
];

const categoryFilters = [
  { key: "all",    label: "All" },
  { key: "hair",   label: "Hair" },
  { key: "bridal", label: "Bridal" },
  { key: "skin",   label: "Skin Care" },
  { key: "nails",  label: "Nail Art" },
];

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useGetServices();
  const { toast } = useToast();
  
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState("all");

  const testimonials = [
    {
      name: "Priya Sharma",
      quote: "Best bridal makeup in the city! My wedding look was absolutely stunning. Every detail was perfect. Highly recommend Glow Salon!",
      stars: 5,
      initials: "PS"
    },
    {
      name: "Anjali Reddy",
      quote: "I had my hair spa and facial done here. The staff is so caring and professional. Left feeling like a queen. Will definitely come back!",
      stars: 5,
      initials: "AR"
    },
    {
      name: "Sneha Patel",
      quote: "Got my mehendi done here for Navratri. The design was so intricate and beautiful. The artist was very skilled and patient!",
      stars: 5,
      initials: "SP"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const { mutate: submitContact, isPending: contactPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "We'll get back to you as soon as possible.",
        });
        contactForm.reset();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmitContact = (data: ContactFormData) => {
    submitContact({ data });
  };

  return (
    <div className="min-h-screen bg-background relative pb-20 md:pb-0">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=85" 
            alt="Luxury Indian Salon Interior" 
            className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl text-white"
          >
            <motion.p variants={fadeUp} className="text-secondary uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              Welcome to Luxury
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              Premium Salon Experience <br/>
              <span className="italic font-light text-secondary">for Your Perfect Look</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/80 mb-10 max-w-lg font-light">
              Expert hairstyling, bridal makeup, and beauty services tailored for you
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/booking"
                className="px-8 py-4 bg-primary text-white tracking-wider uppercase text-sm font-medium rounded-sm hover:bg-white hover:text-primary transition-all duration-300 text-center"
              >
                Book Appointment
              </Link>
              <a 
                href="#services"
                className="px-8 py-4 bg-transparent border border-white/30 text-white tracking-wider uppercase text-sm font-medium rounded-sm hover:bg-white/10 transition-all duration-300 text-center"
              >
                View Services
              </a>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm">
                🔥 Limited slots available today
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">Our Offerings</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Signature Services</h3>
            <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full opacity-50" />
          </motion.div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services?.map((service, idx) => (
                <Link key={service.id} href={`/booking?service=${service.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -10, transition: { duration: 0.22, ease: "easeOut" } }}
                    whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                    className="group relative bg-card p-8 rounded-2xl border border-border/50 shadow-md overflow-hidden cursor-pointer select-none"
                    style={{ boxShadow: "0 4px 20px -4px rgba(0,0,0,0.07)" }}
                  >
                    {/* Glow gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

                    {/* Top border accent on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary via-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                        {service.name}
                      </h4>
                      <span className="text-secondary font-bold text-lg tabular-nums">
                        ₹{Number(service.price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 h-20 overflow-hidden">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-border pt-4 transition-colors duration-200">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        <Clock className="w-4 h-4 text-primary" />
                        {service.duration} Mins
                      </div>
                      {/* Arrow + "Book Now" reveal */}
                      <div className="flex items-center gap-1.5 text-primary font-semibold text-sm">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs uppercase tracking-wider">
                          Book Now
                        </span>
                        <motion.span
                          animate={{ x: 0 }}
                          whileHover={{ x: 3 }}
                          className="text-primary group-hover:text-secondary transition-colors duration-200"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </div>
                    </div>

                    {/* Bottom "Book This Service" bar slides up on hover */}
                    <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-sm font-semibold text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out tracking-wide">
                      Book This Service →
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Awards & Trust Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-2">Recognition</p>
            <h3 className="text-3xl md:text-4xl font-serif font-bold">Awards & Achievements</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Trophy, title: "Best Salon in City", desc: "Awarded by Lifestyle Magazine 2024", color: "text-yellow-500" },
              { icon: Award, title: "Customer Choice Award", desc: "Voted by 500+ happy customers", color: "text-primary" },
              { icon: ThumbsUp, title: "Excellence in Bridal", desc: "Top bridal studio in the region", color: "text-secondary" },
            ].map((award, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm hover:shadow-md transition-all">
                <award.icon className={"w-12 h-12 mx-auto mb-4 " + award.color} />
                <h4 className="text-xl font-serif font-bold text-foreground mb-2">{award.title}</h4>
                <p className="text-muted-foreground text-sm">{award.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-lg font-medium text-foreground">✨ Trusted by <span className="text-primary font-bold">500+ happy customers</span> across the city</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-secondary rounded-full blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/4" />
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" 
                alt="Expert Stylist" 
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -right-8 glass-panel p-6 rounded-2xl max-w-[200px] hidden md:block z-20">
                <div className="text-4xl font-serif font-bold text-primary mb-1">10+</div>
                <div className="text-sm font-medium text-foreground">Years of Beauty Excellence</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">Our Story</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Artistry Rooted in Indian Beauty</h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                At Glow Salon, we celebrate the rich tradition of Indian beauty. Founded by experts with over 10 years of experience, our sanctuary blends ancient beauty rituals with modern techniques to highlight your natural radiance.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                From bridal mehendi to luxurious spa treatments, our master stylists and beauticians ensure every client leaves feeling confident, refreshed, and truly glowing.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Certified bridal makeup artists",
                  "Premium organic beauty products",
                  "Expert in traditional & modern styles",
                  "Personalized consultation for every client"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link 
                href="/booking"
                className="inline-flex items-center gap-2 text-primary font-bold tracking-wider uppercase border-b-2 border-primary pb-1 hover:text-secondary hover:border-secondary transition-all"
              >
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">Our Lookbook</h3>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Real transformations by our expert artists — from everyday glam to unforgettable bridal moments.
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categoryFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setGalleryFilter(f.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 border ${
                  galleryFilter === f.key
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white text-foreground/70 border-border hover:border-primary/40 hover:text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {galleryItems
                .filter((item) => galleryFilter === "all" || item.category === galleryFilter)
                .map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500 ${
                      item.featured && galleryFilter === "all" ? "sm:col-span-2 lg:col-span-1 lg:row-span-1" : ""
                    }`}
                    style={{ aspectRatio: "4/3" }}
                  >
                    {/* Image */}
                    <img
                      src={`https://images.unsplash.com/${item.src}?w=700&q=82&fit=crop&crop=entropy`}
                      alt={item.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Gradient overlay — always subtle */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    {/* Category badge — top left, always visible */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {item.label}
                      </span>
                    </div>

                    {/* Hover caption — slides up from bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-10">
                      <p className="text-white font-semibold text-sm">{item.alt}</p>
                      <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-secondary text-secondary" /> Glow Salon
                      </p>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA below gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">Love what you see? Let us create your perfect look.</p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-medium tracking-wide rounded-full hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              Book Your Session <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Star className="w-12 h-12 text-secondary mx-auto mb-8 opacity-80" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl text-left hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-white/80 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {testimonial.initials}
                  </div>
                  <p className="text-secondary font-bold tracking-wide">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">Get in Touch</h2>
              <h3 className="text-4xl font-serif font-bold text-foreground mb-6">Let's Connect</h3>
              <p className="text-muted-foreground mb-10 text-lg">
                Have a question about our services or want to consult with a specialist? Send us a message and we'll be delighted to assist you.
              </p>
              
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <input 
                      {...contactForm.register("name")}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="Jane Doe"
                    />
                    {contactForm.formState.errors.name && (
                      <p className="text-destructive text-xs mt-1">{contactForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                      <input 
                        {...contactForm.register("email")}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="jane@example.com"
                      />
                      {contactForm.formState.errors.email && (
                        <p className="text-destructive text-xs mt-1">{contactForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone (Optional)</label>
                      <input 
                        {...contactForm.register("phone")}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea 
                      {...contactForm.register("message")}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                      placeholder="How can we help you?"
                    />
                    {contactForm.formState.errors.message && (
                      <p className="text-destructive text-xs mt-1">{contactForm.formState.errors.message.message}</p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={contactPending}
                    className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {contactPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Google Maps Embed — Vijayawada, India */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-border/40" style={{ height: 320 }}>
                <iframe
                  title="Glow Salon Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60989.836069862406!2d80.57628471406295!3d16.50694956521849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9db021f25%3A0xb96b0e8d1e98c16e!2sVijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1695000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Location Info Card */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                <h4 className="text-xl font-serif font-bold text-foreground mb-2">Visit Us</h4>
                <p className="flex items-start gap-3 text-muted-foreground text-sm">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>14, MG Road, Koramangala, Vijayawada, Andhra Pradesh 520001</span>
                </p>
                <p className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a>
                </p>
                <p className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                  <span>Mon–Sat: 10:00 AM – 8:00 PM &nbsp;|&nbsp; Sun: Closed</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Mobile Sticky Book Now Button */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <Link href="/booking" className="block w-full py-4 bg-primary text-white text-center font-bold rounded-xl shadow-2xl shadow-primary/40 text-base tracking-wide">
          📅 Book Appointment Now
        </Link>
      </div>
    </div>
  );
}
