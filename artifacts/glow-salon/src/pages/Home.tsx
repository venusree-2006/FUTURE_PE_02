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

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useGetServices();
  const { toast } = useToast();
  
  const [selectedModal, setSelectedModal] = useState<typeof services[0] | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

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
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
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
                <motion.div
                  key={service.id}
                  onClick={() => setSelectedModal(service)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-card p-8 rounded-2xl border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:border-secondary/30 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{service.name}</h4>
                    <span className="text-secondary font-medium">₹{Number(service.price).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 h-20 overflow-hidden">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-primary" />
                      {service.duration} Mins
                    </div>
                    <span className="text-primary hover:text-secondary transition-colors p-2 -mr-2">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </motion.div>
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
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Lookbook</h3>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
            <div className="relative rounded-xl col-span-2 row-span-2 overflow-hidden group cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" alt="Indian salon interior" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-primary shadow-lg z-10">
                Customer Favourite
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80" alt="Facial treatment" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-primary shadow-lg z-10">
                Top Rated
              </div>
            </div>
            
            <div className="relative rounded-xl row-span-2 overflow-hidden group cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80" alt="Bridal makeup" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-primary shadow-lg z-10">
                Bridal Special
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80" alt="Hair styling" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            
            <div className="relative rounded-xl col-span-2 overflow-hidden group cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1500840216050-6ffa99d75160?w=800&q=80" alt="Bridal traditional" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                ⭐ 4.8/5
              </div>
            </div>
          </div>
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
              className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] lg:h-auto"
            >
              <img 
                src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80" 
                alt="Salon Location" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/30" />
              <div className="absolute bottom-8 left-8 right-8 glass-panel p-8 rounded-2xl text-foreground">
                <h4 className="text-2xl font-serif font-bold mb-4">Visit Us</h4>
                <p className="flex items-center gap-3 mb-3 text-muted-foreground"><MapPin className="w-5 h-5 text-primary shrink-0" /> 14, MG Road, Koramangala, Bengaluru, Karnataka 560034</p>
                <p className="flex items-center gap-3 mb-3 text-muted-foreground"><Phone className="w-5 h-5 text-primary shrink-0" /> +91 98765 43210</p>
                <p className="flex items-center gap-3 text-muted-foreground"><Clock className="w-5 h-5 text-primary shrink-0" /> Mon-Sat: 10:00 AM – 8:00 PM | Sun: Closed</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedModal(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-serif font-bold text-foreground">{selectedModal.name}</h3>
                <button onClick={() => setSelectedModal(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1 bg-muted rounded-full w-8 h-8 flex items-center justify-center">✕</button>
              </div>
              <div className="text-3xl font-bold text-primary mb-4">₹{Number(selectedModal.price).toLocaleString('en-IN')}</div>
              <p className="text-muted-foreground font-medium mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-primary"/> Duration: {selectedModal.duration} minutes</p>
              <p className="text-muted-foreground mb-8 leading-relaxed">{selectedModal.description}</p>
              <Link href={"/booking?service=" + selectedModal.id} onClick={() => setSelectedModal(null)} className="block w-full py-4 bg-primary text-white text-center font-bold tracking-wide rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Book This Service
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
