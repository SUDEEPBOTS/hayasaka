"use client";
import React from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";

const MOODS = [
  {
    title: "Midnight Lo-Fi",
    subtitle: "Chill beats & calm night vibes",
    query: "Lofi Hindi chill slowed songs",
    icon: "🌙",
    gradient: "from-indigo-950/70 via-purple-950/50 to-slate-900/60",
    border: "border-indigo-500/20 hover:border-indigo-400/50",
    accent: "text-indigo-300",
    glow: "shadow-[0_8px_30px_rgba(99,102,241,0.2)]",
  },
  {
    title: "Bollywood Party",
    subtitle: "High-energy club & dance tracks",
    query: "Bollywood party dance songs 2026",
    icon: "🔥",
    gradient: "from-rose-950/70 via-orange-950/50 to-neutral-900/60",
    border: "border-rose-500/20 hover:border-rose-400/50",
    accent: "text-rose-300",
    glow: "shadow-[0_8px_30px_rgba(244,63,94,0.2)]",
  },
  {
    title: "Romantic Melodies",
    subtitle: "Soulful love tunes & acoustic hits",
    query: "Romantic hindi songs love playlist",
    icon: "💖",
    gradient: "from-pink-950/70 via-fuchsia-950/50 to-zinc-900/60",
    border: "border-pink-500/20 hover:border-pink-400/50",
    accent: "text-pink-300",
    glow: "shadow-[0_8px_30px_rgba(236,72,153,0.2)]",
  },
  {
    title: "High Energy Gym",
    subtitle: "Heavy bass, pump & motivation",
    query: "Gym workout motivation songs hindi english",
    icon: "⚡",
    gradient: "from-amber-950/70 via-orange-950/50 to-neutral-900/60",
    border: "border-amber-500/20 hover:border-amber-400/50",
    accent: "text-amber-300",
    glow: "shadow-[0_8px_30px_rgba(245,158,11,0.2)]",
  },
  {
    title: "Heartbreak & Rain",
    subtitle: "Emotional, slow acoustic melodies",
    query: "Sad hindi heartbreak songs acoustic",
    icon: "🌧️",
    gradient: "from-cyan-950/70 via-blue-950/50 to-slate-900/60",
    border: "border-cyan-500/20 hover:border-cyan-400/50",
    accent: "text-cyan-300",
    glow: "shadow-[0_8px_30px_rgba(6,182,212,0.2)]",
  },
  {
    title: "Deep Focus & Study",
    subtitle: "Ambient piano, peaceful soundscapes",
    query: "Deep focus study ambient instrumental music",
    icon: "🎧",
    gradient: "from-teal-950/70 via-emerald-950/50 to-stone-900/60",
    border: "border-teal-500/20 hover:border-teal-400/50",
    accent: "text-teal-300",
    glow: "shadow-[0_8px_30px_rgba(20,184,166,0.2)]",
  },
];

const MoodStations = () => {
  return (
    <div className="my-6 lg:mt-14 select-none">
      <div className="mb-4">
        <h2 className="text-white text-2xl lg:text-3xl font-extrabold tracking-tight">
          Moods & Vibes
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          Curated stations for every feeling and moment
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {MOODS.map((mood) => (
          <Link
            key={mood.title}
            href={`/search/${encodeURIComponent(mood.query)}`}
            className={`group relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br ${mood.gradient} backdrop-blur-2xl border ${mood.border} ${mood.glow} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer block`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-3">
                <span className="text-2xl sm:text-3xl mb-2 block">{mood.icon}</span>
                <h3 className="text-white font-bold text-base sm:text-lg tracking-wide group-hover:text-white transition-colors">
                  {mood.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-1 font-medium line-clamp-1">
                  {mood.subtitle}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#00e6e6] text-white group-hover:text-black flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 shadow-md flex-shrink-0">
                <FaPlay size={13} className="ml-0.5" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5 blur-xl pointer-events-none group-hover:bg-white/10 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MoodStations;
