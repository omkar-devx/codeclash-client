import React from "react";
import { Code } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 w-screen h-screen bg-slate-950 overflow-hidden pointer-events-none -z-50">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-slate-950 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              WHAT IS CODECLASH
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-3 px-4">
              CodeClash is an innovative competitive programming platform where
              developers battle it out in real-time coding challenges. Test your
              skills, learn new algorithms, and climb the leaderboard while
              competing with programmers from around the world.
            </p>
            <p className="text-xs sm:text-sm text-blue-400 italic px-4">
              (Built with passion, determination, and Here is the full tutorial
              of codeclash)
            </p>
          </div>

          <div className="mb-12 sm:mb-16">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="aspect-video w-full rounded-lg sm:rounded-xl overflow-hidden bg-slate-800/50">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Rick Astley - Never Gonna Give You Up (Official Video)"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <span>Our Mission</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                We believe that learning to code should be exciting,
                challenging, and social. CodeClash brings together developers of
                all skill levels to compete, learn, and grow together. Every
                battle is an opportunity to improve your craft and discover new
                approaches to problem-solving.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span>The Spirit</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                This project was built on the principle that inspired that
                iconic song in the video above—never giving up. Through
                countless debugging sessions, feature iterations, and late-night
                coding marathons, CodeClash became a reality because we refused
                to quit. That same spirit drives our community today.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
              Why Choose CodeClash?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  Real-Time Battles
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Compete live against other developers with instant feedback
                  and dynamic leaderboards
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  Diverse Challenges
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  From algorithms to data structures, tackle problems that
                  sharpen your skills
                </p>
              </div>

              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  Growing Community
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Join thousands of developers pushing their limits and
                  supporting each other
                </p>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-600/30 rounded-xl sm:rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Ready to Join the Battle?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Start your journey today. Challenge yourself, compete with others,
              and never give up on becoming a better developer.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg shadow-lg shadow-blue-600/30 transition-all text-sm sm:text-base">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
