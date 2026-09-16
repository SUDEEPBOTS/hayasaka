"use client";
import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setProgress } from "@/redux/features/loadingBarSlice";

export default function MeowLogo({ className = "" }) {
  const dispatch = useDispatch();

  return (
    <Link
      href="/"
      onClick={() => dispatch(setProgress(100))}
      className={`group flex items-center gap-2.5 select-none transition-transform duration-200 active:scale-95 ${className}`}
    >
      {/* Neon Cat Head with Headphones SVG */}
      <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#00e6e6]/20 via-[#ec4899]/20 to-purple-600/20 border border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(0,230,230,0.3)] group-hover:shadow-[0_0_22px_rgba(236,72,153,0.5)] transition-all duration-300">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-7 sm:h-7 text-white"
        >
          {/* Cat Ears */}
          <path
            d="M12 24L10 12L22 18"
            stroke="url(#catGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36 24L38 12L26 18"
            stroke="url(#catGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cat Face Outline */}
          <path
            d="M14 22C14 16 34 16 34 22C34 32 30 36 24 36C18 36 14 32 14 22Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Cat Eyes */}
          <circle cx="19" cy="24" r="2" fill="#00e6e6" />
          <circle cx="29" cy="24" r="2" fill="#00e6e6" />

          {/* Cat Nose & Mouth */}
          <path
            d="M24 28V29.5M24 29.5C22.5 29.5 22 30.5 22 30.5M24 29.5C25.5 29.5 26 30.5 26 30.5"
            stroke="#ff5e98"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* DJ Headphones Band */}
          <path
            d="M8 24C8 14 15 7 24 7C33 7 40 14 40 24"
            stroke="url(#hpGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Headphone Earcups */}
          <rect
            x="6"
            y="21"
            width="5"
            height="9"
            rx="2.5"
            fill="url(#catGrad)"
          />
          <rect
            x="37"
            y="21"
            width="5"
            height="9"
            rx="2.5"
            fill="url(#catGrad)"
          />

          <defs>
            <linearGradient id="catGrad" x1="6" y1="7" x2="40" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00e6e6" />
              <stop offset="0.5" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="hpGrad" x1="8" y1="7" x2="40" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00e6e6" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00e6e6] bg-clip-text text-transparent font-sans drop-shadow-sm">
            Meow
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#00e6e6]/20 to-[#ec4899]/20 text-[#00e6e6] border border-[#00e6e6]/30 hidden sm:inline-block">
            Hi-Fi
          </span>
        </div>
      </div>
    </Link>
  );
}
