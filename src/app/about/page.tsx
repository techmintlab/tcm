"use client";

import { motion } from "framer-motion";
import { Check, Target, Eye, Heart, Users, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const team = [
  { name: "Arjun Mehta", role: "CEO & Founder", bio: "Visionary leader with 15+ years in tech" },
  { name: "Priya Singh", role: "CTO", bio: "Full-stack architect and tech strategist" },
  { name: "Rahul Verma", role: "Head of Design", bio: "Award-winning UI/UX designer" },
  { name: "Ananya Patel", role: "Lead Developer", bio: "Open source contributor and React expert" },
];

const milestones = [
  { year: "2020", title: "The Beginning", desc: "TechMintLab was founded with a vision to democratize software" },
  { year: "2021", title: "First Product Launch", desc: "Launched our first SaaS boilerplate - 500+ developers onboarded" },
  { year: "2022", title: "Team Expansion", desc: "Grew to 25+ team members across India" },
  { year: "2023", title: "10K Downloads", desc: "Crossed 10,000 downloads milestone" },
  { year: "2024", title: "Global Reach", desc: "Expanded to 25+ countries worldwide" },
  { year: "2025", title: "Enterprise Launch", desc: "Launched enterprise solutions division" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950/50 dark:to-zinc-950">
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="default" className="mb-4">About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We Build Tools That
            <br />
            <span className="text-gradient">Empower Developers</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            TechMintLab is a premium software marketplace and development studio helping
            businesses build faster and scale smarter.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our <span className="text-gradient">Story</span>
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>
                Founded in 2020, TechMintLab started with a simple mission: make premium
                software accessible to everyone. What began as a small collection of React
                components has grown into a comprehensive marketplace serving thousands of
                developers worldwide.
              </p>
              <p>
                We believe in the power of great tools. Every product on our platform undergoes
                rigorous quality checks, ensuring that when you build with TechMintLab, you're
                building on a foundation of excellence.
              </p>
              <p>
                Today, we're a team of passionate developers, designers, and entrepreneurs
                dedicated to shipping the highest quality digital products.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: "Products", value: "50+" },
              { label: "Happy Clients", value: "500+" },
              { label: "Downloads", value: "10K+" },
              { label: "Countries", value: "25+" },
            ].map((stat) => (
              <div key={stat.label} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-center">
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-zinc-50/50 dark:bg-zinc-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
              <Target className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                To democratize premium software development by providing developers and
                businesses with high-quality, production-ready tools and solutions that
                accelerate their journey from idea to impact.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
              <Eye className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                To become the world's most trusted marketplace for premium digital products
                and development services, empowering millions of creators worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Our <span className="text-gradient">Journey</span>
        </h2>
        <div className="space-y-8">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-6"
            >
              <div className="text-right w-20 shrink-0">
                <span className="text-sm font-bold text-emerald-500">{m.year}</span>
              </div>
              <div className="w-px h-16 bg-emerald-500/30 relative">
                <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{m.title}</h3>
                <p className="text-sm text-zinc-500">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-zinc-50/50 dark:bg-zinc-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Meet Our Team</h2>
          <p className="text-zinc-500 mb-12 text-center max-w-xl mx-auto">
            The passionate people behind TechMintLab
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">{member.role}</p>
                <p className="text-sm text-zinc-500">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Our <span className="text-gradient">Values</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Heart, title: "Quality First", desc: "We never compromise on quality. Every product meets our strict standards." },
            { icon: Users, title: "Community Driven", desc: "We build for developers, with developers. Feedback shapes our roadmap." },
            { icon: Code2, title: "Innovation", desc: "We stay ahead of the curve with cutting-edge technologies and practices." },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center"
            >
              <v.icon className="w-10 h-10 mx-auto text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-zinc-500">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
