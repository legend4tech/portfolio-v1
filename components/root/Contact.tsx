"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { ContactForm } from "./ContactForm";
import { CommentsSection } from "./CommentsSection";

export function Contact() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="contact" className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl font-bold text-purple-400">Contact Me</h2>
          <p className="text-gray-400">
            Got a question? Send me a message, and I&#39;ll get back to you
            soon.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div ref={ref} className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Contact Form */}
          <ContactForm />

          {/* Right Column - Comments */}
          <CommentsSection />
        </div>
      </div>
    </section>
  );
}
