import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star, Clock, CheckCircle2, MapPin, Phone } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Luxury Salon Interior" 
            className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent mix-blend-multiply" />
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
              Reveal Your <br/>
              <span className="italic font-light text-secondary">Inner Glow</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/80 mb-10 max-w-lg font-light">
              Experience personalized beauty treatments in an oasis of elegance and tranquility. Your transformation begins here.
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
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background relative">
        <div className="absolute top-0 right-0 w-64 opacity-5 pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/decorative-leaf.png`} alt="Decorative" />
        </div>
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-card p-8 rounded-2xl border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:border-secondary/30 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{service.name}</h4>
                    <span className="text-secondary font-medium">${service.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 h-20">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-primary" />
                      {service.duration} Mins
                    </div>
                    <Link href={`/booking?service=${service.id}`} className="text-primary hover:text-secondary transition-colors p-2 -mr-2">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-muted/30">
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
                src={`${import.meta.env.BASE_URL}images/about-stylist.png`} 
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
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Artistry in Every Detail</h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                At Glow Salon, we believe beauty is an art form. Founded on the principle that every client deserves a bespoke experience, our sanctuary offers an escape from the ordinary.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Our master stylists and aestheticians combine passion with cutting-edge techniques to highlight your natural radiance, ensuring you leave feeling confident, refreshed, and truly glowing.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Award-winning master stylists",
                  "Premium organic beauty products",
                  "Personalized consultation for every client",
                  "Luxurious and relaxing atmosphere"
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
      <section id="gallery" className="py-24 bg-background">
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
            {/* beautiful soft waves hair back view */}
            <img src="https://pixabay.com/get/g906aaaffd7a26e786a40f5f720ae5976dd64f8a594f74541b88c49c5b44ca1ecaba4152b84f8a83847db372bafdb70c7734fe0f2afe0714d7f96e824623e235c_1280.jpg" alt="Hair styling" className="w-full h-full object-cover rounded-xl col-span-2 row-span-2 hover:opacity-90 transition-opacity cursor-pointer" />
            
            {/* clean facial aesthetics spa */}
            <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80" alt="Facial treatment" className="w-full h-full object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer" />
            
            {/* elegant nail art manicure */}
            <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80" alt="Manicure" className="w-full h-full object-cover rounded-xl row-span-2 hover:opacity-90 transition-opacity cursor-pointer" />
            
            {/* salon styling tools elegant */}
            <img src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&q=80" alt="Salon interior" className="w-full h-full object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer" />
            
            {/* smooth elegant bride hair styling */}
            <img src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80" alt="Bridal hair" className="w-full h-full object-cover rounded-xl col-span-2 hover:opacity-90 transition-opacity cursor-pointer" />
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
            className="max-w-3xl mx-auto"
          >
            <h3 className="text-3xl md:text-5xl font-serif italic font-light leading-snug mb-10">
              "An absolute dream. The attention to detail and level of care at Glow is unmatched. I left feeling completely revitalized and beautiful."
            </h3>
            <p className="text-secondary font-bold tracking-widest uppercase text-sm">Elena Rodriguez</p>
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
                        placeholder="+1 (555) 000-0000"
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
              {/* map beautiful salon location aesthetic */}
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" 
                alt="Salon Location" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/20" />
              <div className="absolute bottom-8 left-8 right-8 glass-panel p-8 rounded-2xl text-foreground">
                <h4 className="text-2xl font-serif font-bold mb-4">Visit Us</h4>
                <p className="flex items-center gap-3 mb-3 text-muted-foreground"><MapPin className="w-5 h-5 text-primary" /> 123 Luxury Avenue, Beverly Hills</p>
                <p className="flex items-center gap-3 text-muted-foreground"><Phone className="w-5 h-5 text-primary" /> +1 (555) 123-4567</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
