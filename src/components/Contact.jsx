import { motion } from "framer-motion";
import { MapPin, Phone, Mail, User } from "lucide-react";
import GlassCard from "./ui/GlassCard";

const contactPeople = [
  { name: "Prabhu", phone: "+91 9791185402", email: "prabhu.officialworks@gmail.com " },
  { name: "Sushmithaa", phone: "+91 9042840326", email: "sushmithaabalamurugan@gmail.com" },
];


export default function Contact() {
  return (
    <section id="contact" className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 mt-4">
            Get in <span className="text-[#ff2d55] font-['Exo_2']">Touch</span>
          </h2>
          <p className="muted max-w-xl mx-auto text-lg">
            Have questions? We&apos;d love to hear from you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Contact Details Box */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-5 md:p-8 rounded-xl h-full" style={{ borderColor: 'rgba(0, 245, 255, 0.1)' }}>
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-widest uppercase font-mono">Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
                {contactPeople.map((person, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex flex-col gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors group"
                  >
                    <p className="text-cyan-400 font-bold text-sm uppercase tracking-wider font-mono">{person.name}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                        <Phone className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400" />
                        <a href={`tel:${person.phone}`} className="text-gray-300 text-xs hover:text-white transition-colors font-mono">
                          {person.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                        <Mail className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400" />
                        <a href={`mailto:${person.email}`} className="text-gray-300 text-xs hover:text-white transition-colors font-mono truncate">
                          {person.email}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Venue Address</p>
                    <p className="text-white text-sm font-mono mt-0.5">Sri Sairam Engineering College, Sai Leo Nagar, West Tambaram, Poonthandalam Village, Chennai, Tamil Nadu 600132</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-full min-h-[280px] md:min-h-[400px]"
          >
            <GlassCard className="overflow-hidden h-full rounded-xl border-white/10" interactive>
              <iframe
                src="https://maps.google.com/maps?q=Sri%20Sairam%20Engineering%20College,%20Tambaram&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "280px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
