import React, { useState, useEffect } from "react";
import {
  Code,
  Users,
  Zap,
  Trophy,
  Brain,
  Terminal,
  GitBranch,
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [animateHero, setAnimateHero] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    problems: 0,
    rooms: 0,
    solutions: 0,
  });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setAnimateHero(true);

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStats({
        users: Math.floor((15000 / steps) * step),
        problems: Math.floor((850 / steps) * step),
        rooms: Math.floor((2500 / steps) * step),
        solutions: Math.floor((50000 / steps) * step),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(testimonialTimer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-7 h-7" />,
      title: "Curated Problem Sets",
      description:
        "Access 850+ handpicked DSA problems covering arrays, trees, graphs, DP, and more with detailed solutions",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Real-time Collaboration",
      description:
        "Create private rooms, invite teammates, and solve problems together with synchronized code editing",
    },
    {
      icon: <Terminal className="w-7 h-7" />,
      title: "Multi-language Support",
      description:
        "Write and execute code in C++, Java, Python, JavaScript with instant compilation and test results",
    },
    {
      icon: <Trophy className="w-7 h-7" />,
      title: "Smart Progress Tracking",
      description:
        "Visualize your learning journey with detailed analytics, skill graphs, and achievement milestones",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Lightning Fast IDE",
      description:
        "Professional code editor with syntax highlighting, auto-completion, and intelligent error detection",
    },
    {
      icon: <GitBranch className="w-7 h-7" />,
      title: "Version Control",
      description:
        "Track your solution history, compare approaches, and learn from your previous attempts",
    },
  ];

  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      text: "This platform helped me crack my dream job. The collaborative rooms feature made practicing with peers incredibly effective.",
    },
    {
      name: "Raj Patel",
      role: "Senior Developer at Microsoft",
      text: "The best DSA platform I've used. Clean interface, challenging problems, and the real-time collaboration is a game-changer.",
    },
    {
      name: "Emily Rodriguez",
      role: "Tech Lead at Amazon",
      text: "I've tried many coding platforms, but this one stands out. The problem quality and collaborative features are unmatched.",
    },
  ];

  const problemCategories = [
    {
      name: "Arrays & Strings",
      count: 145,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Trees & Graphs",
      count: 178,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Dynamic Programming",
      count: 132,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Sorting & Searching",
      count: 98,
      color: "from-green-500 to-emerald-500",
    },
    { name: "Linked Lists", count: 87, color: "from-indigo-500 to-blue-500" },
    {
      name: "Greedy & Backtracking",
      count: 110,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-100">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* All Content Wrapper */}
      <div className="relative bg-slate-950 z-10">
        {/* Navigation */}
        {/* <nav className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/80">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 blur-lg opacity-50"></div>
                  <div className="relative w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-2xl">
                    <Code className="w-6 h-6" />
                  </div>
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  Code<span className="text-blue-600">Collab</span>
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Problems
                </a>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Collaborate
                </a>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Leaderboard
                </a>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Learn
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-5 py-2.5 text-slate-300 hover:text-white transition-colors font-medium">
                  Sign In
                </button>
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all font-medium shadow-lg shadow-blue-600/30">
                  Start Free
                </button>
              </div>
            </div>
          </div>
        </nav> */}

        {/* Hero Section */}
        <section className="pt-20 pb-24">
          <div className="container mx-auto px-6">
            <div
              className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${animateHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-xs text-blue-400 backdrop-blur-sm mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-medium">
                  Trusted by 15,000+ developers worldwide
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Master{" "}
                <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-clip-text text-transparent">
                  DSA
                </span>
                <br />
                Through Collaboration
              </h1>

              <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                Solve algorithmic challenges, create collaborative coding rooms,
                and prepare for technical interviews with the most comprehensive
                DSA platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center space-x-2 text-base font-semibold">
                  <Play className="w-4 h-4" />
                  <span>Start Coding Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-6 py-3 border-2 border-slate-700 hover:border-blue-600 rounded-xl transition-all flex items-center space-x-2 text-base font-semibold backdrop-blur-sm hover:bg-slate-800/50">
                  <Users className="w-4 h-4" />
                  <span>Create a Room</span>
                </button>
              </div>

              {/* Trusted by companies */}
              <div className="mt-16">
                <p className="text-slate-500 text-xs font-medium mb-6 uppercase tracking-wider">
                  Trusted by engineers at
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                  {companies.map((company, index) => (
                    <div
                      key={index}
                      className="text-slate-600 hover:text-slate-400 transition-colors text-lg font-bold"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-slate-800/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center group cursor-pointer">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  {stats.users.toLocaleString()}+
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  Active Users
                </div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  {stats.problems}+
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  Problems
                </div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  {stats.rooms.toLocaleString()}+
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  Rooms Created
                </div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  {stats.solutions.toLocaleString()}+
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  Solutions
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to{" "}
                <span className="text-blue-600">Succeed</span>
              </h2>
              <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
                A comprehensive platform designed to help you master data
                structures, algorithms, and land your dream job
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-blue-600/50 transition-all duration-300 hover:bg-slate-900/80"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem Categories */}
        <section className="py-20 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Explore Problem{" "}
                <span className="text-blue-600">Categories</span>
              </h2>
              <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
                Practice with carefully curated problems across all major topics
              </p>
            </div>

            <div className="grid grid-rows-6 md:grid-rows-3 md:grid-cols-2 lg:grid-rows-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {problemCategories.map((category, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base md:text-lg font-bold">
                        {category.name}
                      </h3>
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-100 transition-opacity flex items-center justify-center`}
                      >
                        <Code className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-400 group-hover:text-white transition-colors">
                        {category.count}
                      </span>
                      <span className="text-slate-500 text-sm group-hover:text-blue-400 transition-colors">
                        Problems →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Loved by <span className="text-blue-600">Developers</span>
              </h2>
              <p className="text-base md:text-lg text-slate-400">
                See what our community has to say
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative min-h-56">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ${
                      activeTestimonial === index
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8 pointer-events-none"
                    }`}
                  >
                    <div className="p-8 md:p-10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-700">
                      <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6 italic">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-base">
                            {testimonial.name}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-2 mt-10">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeTestimonial === index
                        ? "bg-blue-600 w-10"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-12 md:p-14 text-center">
              <div className="absolute inset-0 bg-grid-white/5"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-base md:text-lg text-blue-100 mb-8 max-w-xl mx-auto leading-relaxed">
                  Join thousands of developers who are already mastering DSA and
                  landing their dream jobs
                </p>
                <button className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-lg font-bold shadow-2xl hover:scale-105 hover:shadow-white/20">
                  Get Started for Free
                </button>
                <p className="mt-5 text-blue-200 text-sm">
                  No credit card required • Free forever
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold">
                    Code<span className="text-blue-600">Collab</span>
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed max-w-md">
                  The ultimate platform for mastering data structures and
                  algorithms through collaborative learning and practice.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">Product</h3>
                <ul className="space-y-3 text-slate-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Problems
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Collaborate
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Leaderboard
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">Company</h3>
                <ul className="space-y-3 text-slate-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between">
              <div className="text-slate-500 text-sm mb-4 md:mb-0">
                © 2025 CodeClash. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-slate-500 text-sm">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
