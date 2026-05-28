"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { servicesList } from "@/config/site";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05 },
  }),
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950/50 dark:to-zinc-950">
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="default" className="mb-4">
            Our Services
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Comprehensive Development Services
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            From concept to deployment, we deliver end-to-end digital solutions
            that drive business growth and innovation.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, i) => (
            <motion.div
              key={service.slug}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Link href={`/services/${service.slug}`}>
                <Card className="h-full group hover:border-emerald-500/50 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <Code2 className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                      {service.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature) => (
                        <div key={feature} className="flex items-start space-x-2 text-sm">
                          <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-zinc-600 dark:text-zinc-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" className="group/btn p-0 h-auto">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Let's discuss your project requirements and create something amazing together.
          </p>
          <Link href="/contact">
            <Button size="xl" className="bg-white text-emerald-700 hover:bg-zinc-100">
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
