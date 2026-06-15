'use client';
// app/page.tsx — CareerForge Pro Landing Page
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import {
  Sparkles, Zap, Target, FileDown, ArrowRight, Star,
  Brain, BarChart3, FileText, Shield,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'JD Analysis Agent',
    desc: 'Paste any job description. Our AI instantly extracts and ranks every critical keyword by importance.',
    color: 'from-indigo-500 to-purple-500',
    glow: 'rgba(99,102,241,0.3)',
  },
  {
    icon: Sparkles,
    title: 'AI Bullet Rewriter',
    desc: 'Transform weak bullet points into powerful, keyword-rich statements that bypass ATS filters instantly.',
    color: 'from-purple-500 to-pink-500',
    glow: 'rgba(168,85,247,0.3)',
  },
  {
    icon: BarChart3,
    title: 'Live ATS Score',
    desc: 'Real-time compatibility score showing exactly how well your resume matches the target job.',
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    icon: FileDown,
    title: 'Pixel-Perfect PDF',
    desc: 'Professional-grade PDFs rendered by headless Chrome — guaranteed to look perfect in any viewer.',
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.3)',
  },
  {
    icon: FileText,
    title: 'Cover Letter AI',
    desc: 'Generate personalized cover letters that match both your experience and the job requirements.',
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    icon: Shield,
    title: '3 Premium Templates',
    desc: 'Modern, Executive, and Minimal designs that are ATS-safe and visually striking.',
    color: 'from-rose-500 to-red-500',
    glow: 'rgba(244,63,94,0.3)',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Meta',
    avatar: 'SC',
    text: 'CareerForge Pro boosted my ATS score from 34% to 91%. Got 3 interviews in the first week. This tool is a game-changer.',
    stars: 5,
  },
  {
    name: 'Marcus Williams',
    role: 'Product Manager at Stripe',
    avatar: 'MW',
    text: "The AI rewrites are insane. It turned my bland bullet points into compelling achievements. I landed my dream job in 2 weeks.",
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Data Scientist at Google',
    avatar: 'PS',
    text: 'The JD analysis alone is worth the subscription. It shows exactly what keywords the hiring manager is looking for.',
    stars: 5,
  },
];

const STATS = [
  { value: '94%', label: 'Average ATS Improvement' },
  { value: '2.3x', label: 'More Interview Callbacks' },
  { value: '50K+', label: 'Resumes Generated' },
  { value: '4.9★', label: 'User Rating' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-40 right-20 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px]" 
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-indigo-500/30 text-sm text-indigo-300 mb-8 hover:bg-white/5 transition-colors cursor-default"
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Gemini AI · ATS-Proven Results</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[var(--font-outfit)] leading-tight mb-6"
          >
            Build a Resume That
            <br />
            <motion.span 
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
              style={{ backgroundSize: '200% auto' }}
            >
              Gets Past Any ATS
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your resume, paste a job description, and let AI rewrite your experience to perfectly match
            every keyword. Download a professional PDF that gets through ATS filters — every time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/builder"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-lg rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start Building Free
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Link>
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 px-8 py-4 glass hover:bg-white/10 text-white font-semibold text-lg rounded-2xl transition-all border border-white/10 hover:border-white/20 hover:scale-105"
            >
              View Pricing
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-sm text-gray-500"
          >
            ✓ Free plan available · ✓ No credit card required · ✓ PDF download included
          </motion.p>
        </div>

        {/* Stats bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {STATS.map((stat) => (
            <motion.div 
              key={stat.label} 
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-4 text-center cursor-default"
            >
              <div className="text-3xl font-bold text-gradient font-[var(--font-outfit)]">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold font-[var(--font-outfit)] text-white mb-4">
              Everything You Need to
              <span className="text-gradient"> Land the Job</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A complete AI-powered resume toolkit built for the modern job market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="glass-card p-6 group transition-colors duration-300 relative overflow-hidden"
                >
                  {/* Subtle hover background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}
                    style={{ boxShadow: `0 0 20px ${feature.glow}` }}
                  >
                    <Icon className="w-6 h-6 text-white group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 relative z-10">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed relative z-10">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-[#0d1226]/50">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-[var(--font-outfit)] text-white mb-4">
              From Resume to Interview in
              <span className="text-gradient"> 3 Steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Paste Job Description',
                desc: 'Copy-paste the job posting. Our AI agent instantly extracts and ranks all critical ATS keywords.',
                icon: Target,
                color: 'from-indigo-500 to-purple-500',
              },
              {
                step: '02',
                title: 'AI Optimizes Your Resume',
                desc: 'Click the magic ✨ button next to each bullet point. Watch AI rewrite them with perfect keywords.',
                icon: Sparkles,
                color: 'from-purple-500 to-pink-500',
              },
              {
                step: '03',
                title: 'Download Perfect PDF',
                desc: 'Get a pixel-perfect, ATS-safe PDF rendered by Chrome. Apply with confidence.',
                icon: FileDown,
                color: 'from-emerald-500 to-teal-500',
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="relative group"
                >
                  {i < 2 && (
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.2 + 0.3 }}
                      className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-indigo-500/50 to-transparent z-10 origin-left" 
                    />
                  )}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="glass-card p-6 text-center relative z-20 h-full"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-xl transform transition-transform group-hover:rotate-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-bold text-indigo-400 mb-2 tracking-wider">STEP {step.step}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-[var(--font-outfit)] text-white mb-4">
              Real Results from Real Users
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div 
                key={t.name} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex mb-3 gap-1">
                    {Array.from({ length: t.stars }).map((_, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, rotate: -180 }}
                        whileInView={{ opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.15 + idx * 0.1 }}
                      >
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-indigo-300">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass-card p-12 relative overflow-hidden group">
            <motion.div 
              animate={{ 
                background: [
                  'linear-gradient(to bottom right, rgba(79,70,229,0.2), rgba(147,51,234,0.2))',
                  'linear-gradient(to bottom right, rgba(147,51,234,0.2), rgba(236,72,153,0.2))',
                  'linear-gradient(to bottom right, rgba(79,70,229,0.2), rgba(147,51,234,0.2))'
                ] 
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0" 
            />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-outfit)] text-white mb-6">
                Ready to Get Hired Faster?
              </h2>
              <p className="text-gray-300 mb-10 text-lg max-w-xl mx-auto">
                Join 50,000+ job seekers who used CareerForge Pro to land their dream role.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 font-bold text-lg rounded-2xl transition-all shadow-xl shadow-white/10 hover:shadow-white/20"
                >
                  <Zap className="w-5 h-5 text-indigo-600" />
                  Start Free — No Card Required
                  <ArrowRight className="w-5 h-5 text-indigo-600" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-4 text-center bg-black/20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient font-[var(--font-outfit)] tracking-tight">CareerForge Pro</span>
        </div>
        <p className="text-sm text-gray-400">
          © 2026 CareerForge Pro. Built with ❤️ by <a href="https://github.com/sudipc2004" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Sudip</a> using Gemini AI.
        </p>
      </footer>
    </div>
  );
}
