import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, Sparkles, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays } from "date-fns";
import { useGetServices, useCreateBooking } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";

const bookingSchema = z.object({
  serviceId: z.coerce.number().min(1, "Please select a service"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  notes: z.string().optional()
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function Booking() {
  const [, setLocation] = useLocation();
  const { data: services, isLoading: servicesLoading } = useGetServices();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [success, setSuccess] = useState(false);
  
  // Extract pre-selected service from URL if present
  const searchParams = new URLSearchParams(window.location.search);
  const initialServiceId = searchParams.get('service');

  const { mutate: createBooking, isPending } = useCreateBooking({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        toast({
          title: "Booking Failed",
          description: "There was an error securing your appointment. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: initialServiceId ? parseInt(initialServiceId) : undefined,
    }
  });

  const selectedServiceId = form.watch("serviceId");
  const selectedDate = form.watch("date");
  const selectedTime = form.watch("time");

  const selectedServiceDetails = services?.find(s => s.id === selectedServiceId);

  // Auto-advance to step 2 when arriving from a service card with pre-selected service
  useEffect(() => {
    if (initialServiceId && services && services.length > 0) {
      const id = parseInt(initialServiceId);
      const exists = services.find(s => s.id === id);
      if (exists) {
        form.setValue("serviceId", id);
        // Small delay so the user sees the highlighted service before advancing
        const t = setTimeout(() => setStep(2), 600);
        return () => clearTimeout(t);
      }
    }
  }, [initialServiceId, services]);

  const onSubmit = (data: BookingFormData) => {
    createBooking({ data });
  };

  // Generate available dates (next 14 days)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    // Skip Sundays
    if (d.getDay() === 0) return null;
    return d;
  }).filter(Boolean) as Date[];

  const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const formatTime = (time: string) => {
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    return `${hour}:${minuteStr} ${ampm}`;
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-24 max-w-4xl mx-auto w-full px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Reserve Your Time</h1>
          <p className="text-muted-foreground text-lg">Your luxurious escape is just a few clicks away.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative max-w-md mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -z-10 -translate-y-1/2 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                step >= i ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-card text-muted-foreground border-2 border-border"
              }`}
            >
              {i}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-3xl border border-border/50 shadow-2xl p-6 md:p-10">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            
            {/* STEP 1: Select Service */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Select a Service</h2>
                {servicesLoading ? (
                  <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {services?.map(service => {
                      const isSelected = selectedServiceId === service.id;
                      const isPreSelected = initialServiceId && parseInt(initialServiceId) === service.id;
                      return (
                        <motion.div
                          key={service.id}
                          onClick={() => form.setValue("serviceId", service.id)}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.99 }}
                          animate={isPreSelected && isSelected
                            ? { boxShadow: ["0 0 0 0 rgba(var(--primary-rgb,168,50,80),0)", "0 0 0 6px rgba(var(--primary-rgb,168,50,80),0.12)", "0 0 0 0 rgba(var(--primary-rgb,168,50,80),0)"] }
                            : {}}
                          transition={{ duration: 0.8, repeat: isPreSelected && isSelected ? 2 : 0 }}
                          className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 flex justify-between items-center group ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                              : "border-border hover:border-primary/40 hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors duration-200 ${
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground/30 group-hover:border-primary/50"
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div>
                              <h3 className={`font-serif font-bold text-lg transition-colors duration-200 ${isSelected ? "text-primary" : "text-foreground"}`}>
                                {service.name}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.duration} mins</span>
                                <span className="capitalize px-2 py-0.5 bg-muted rounded-full text-xs">{service.category}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`text-lg font-bold tabular-nums transition-colors duration-200 ${isSelected ? "text-primary" : "text-secondary"}`}>
                            ₹{Number(service.price).toLocaleString('en-IN')}
                          </div>
                        </motion.div>
                      );
                    })}
                    {form.formState.errors.serviceId && (
                      <p className="text-destructive text-sm mt-2">{form.formState.errors.serviceId.message}</p>
                    )}
                  </div>
                )}
                <div className="mt-10 flex justify-end">
                  <button 
                    type="button"
                    disabled={!selectedServiceId}
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Date & Time
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Date & Time */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-medium text-sm transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to Services
                </button>
                <h2 className="text-2xl font-serif font-bold mb-8 text-foreground">Choose Date & Time</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                      <CalendarIcon className="w-4 h-4 text-primary" /> Select Date
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {availableDates.map(date => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isSelected = selectedDate === dateStr;
                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => form.setValue("date", dateStr)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isSelected 
                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                                : "bg-background border-border text-foreground hover:border-primary/50"
                            }`}
                          >
                            <div className="text-xs uppercase tracking-wider mb-1 opacity-80">{format(date, 'EEE')}</div>
                            <div className="font-bold text-lg">{format(date, 'd')}</div>
                            <div className="text-xs opacity-80">{format(date, 'MMM')}</div>
                          </button>
                        );
                      })}
                    </div>
                    {form.formState.errors.date && (
                      <p className="text-destructive text-sm mt-2">{form.formState.errors.date.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                      <Clock className="w-4 h-4 text-primary" /> Select Time
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map(time => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={!selectedDate}
                            onClick={() => form.setValue("time", time)}
                            className={`p-3 rounded-xl border text-center transition-all font-medium ${
                              !selectedDate ? "opacity-40 cursor-not-allowed bg-muted border-border" :
                              isSelected 
                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                                : "bg-background border-border text-foreground hover:border-primary/50"
                            }`}
                          >
                            {formatTime(time)}
                          </button>
                        );
                      })}
                    </div>
                    {!selectedDate && (
                      <p className="text-muted-foreground text-xs mt-3 italic">Please select a date first.</p>
                    )}
                    {form.formState.errors.time && (
                      <p className="text-destructive text-sm mt-2">{form.formState.errors.time.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button 
                    type="button"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(3)}
                    className="px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Details
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Client Details */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-medium text-sm transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to Date & Time
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Your Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                        <input 
                          {...form.register("name")}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          placeholder="Jane Doe"
                        />
                        {form.formState.errors.name && <p className="text-destructive text-xs mt-1">{form.formState.errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                        <input 
                          {...form.register("phone")}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          placeholder="+91 XXXXX XXXXX"
                        />
                        {form.formState.errors.phone && <p className="text-destructive text-xs mt-1">{form.formState.errors.phone.message}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                      <input 
                        {...form.register("email")}
                        type="email"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="jane@example.com"
                      />
                      {form.formState.errors.email && <p className="text-destructive text-xs mt-1">{form.formState.errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Special Notes (Optional)</label>
                      <textarea 
                        {...form.register("notes")}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        placeholder="Any allergies, preferences, or specific stylist requests?"
                      />
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-background rounded-2xl p-6 border border-border/50 h-fit sticky top-32">
                    <h3 className="font-serif font-bold text-xl mb-6 pb-4 border-b border-border">Booking Summary</h3>
                    
                    {selectedServiceDetails && (
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground mb-1">Service</p>
                        <p className="font-medium text-foreground">{selectedServiceDetails.name}</p>
                        <p className="text-primary font-bold mt-1">₹{Number(selectedServiceDetails.price).toLocaleString('en-IN')}</p>
                      </div>
                    )}
                    
                    {selectedDate && selectedTime && (
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                        <p className="font-medium text-foreground">
                          {format(new Date(selectedDate), 'MMMM do, yyyy')} at {formatTime(selectedTime)}
                        </p>
                      </div>
                    )}

                    <p className="text-center text-sm text-muted-foreground mb-4">🔥 Limited slots available today</p>

                    <button 
                      type="submit"
                      disabled={isPending}
                      className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Confirming..." : "Confirm Booking"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </form>
        </div>
      </div>

      {/* Booking Confirmation Popup */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-card rounded-3xl p-10 max-w-md w-full shadow-2xl border border-border text-center relative"
            >
              <button
                onClick={() => setSuccess(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Animated check circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
                className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </motion.div>

              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Booking Confirmed</span>
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>

              <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                You're all set!
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your appointment at <span className="font-semibold text-foreground">Glow Salon</span> has been booked successfully. We'll send a confirmation on WhatsApp and SMS shortly.
              </p>

              <div className="bg-muted/50 rounded-2xl p-4 mb-8 text-sm text-muted-foreground border border-border/50">
                📍 14, MG Road, Vijayawada &nbsp;•&nbsp; 📞 +91 98765 43210
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setSuccess(false); }}
                  className="flex-1 py-3 border border-border rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
                >
                  Book Another
                </button>
                <button
                  onClick={() => setLocation("/")}
                  className="flex-1 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Return Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
