"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";

const INITIAL_ARTISTS = [
  {
    name: "Arijit Singh",
    role: "Playback Singer",
    image: "https://c.saavncdn.com/artists/Arijit_Singh_004_20241118063717_500x500.jpg",
  },
  {
    name: "Shreya Ghoshal",
    role: "Melody Queen",
    image: "https://c.saavncdn.com/artists/Shreya_Ghoshal_007_20241101074144_500x500.jpg",
  },
  {
    name: "Atif Aslam",
    role: "Pop / Romantic",
    image: "https://c.saavncdn.com/963/Best-of-Romance-Atif-Aslam-Hindi-2026-20260907173844-500x500.jpg",
  },
  {
    name: "Diljit Dosanjh",
    role: "Punjabi / Pop",
    image: "https://c.saavncdn.com/artists/Diljit_Dosanjh_005_20231025073054_500x500.jpg",
  },
  {
    name: "Jubin Nautiyal",
    role: "Soulful Singer",
    image: "https://c.saavncdn.com/artists/Jubin_Nautiyal_003_20231130204020_500x500.jpg",
  },
  {
    name: "Vishal Mishra",
    role: "Composer & Singer",
    image: "https://c.saavncdn.com/artists/Vishal_Mishra_005_20251120085316_500x500.jpg",
  },
  {
    name: "Yo Yo Honey Singh",
    role: "Hip-Hop / Rap",
    image: "https://c.saavncdn.com/artists/Yo_Yo_Honey_Singh_004_20260811095253_500x500.jpg",
  },
  {
    name: "Darshan Raval",
    role: "Indie Pop",
    image: "https://c.saavncdn.com/artists/Darshan_Raval_006_20250807060352_500x500.jpg",
  },
  {
    name: "Udit Narayan",
    role: "Legendary Singer",
    image: "https://c.saavncdn.com/artists/Udit_Narayan_004_20241029065120_500x500.jpg",
  },
  {
    name: "Neha Kakkar",
    role: "Party & Pop",
    image: "https://c.saavncdn.com/artists/Neha_Kakkar_007_20241212115832_500x500.jpg",
  },
  {
    name: "Alka Yagnik",
    role: "Melody Maestro",
    image: "https://c.saavncdn.com/artists/Alka_Yagnik_002_20220314192930_500x500.jpg",
  },
];

const TopArtists = () => {
  const [artists] = useState(INITIAL_ARTISTS);
  const [failedImages, setFailedImages] = useState({});

  return (
    <div className="my-6 lg:mt-14 select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white text-2xl lg:text-3xl font-extrabold tracking-tight">
            Top Artists
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Discover music from your favorite voices
          </p>
        </div>
      </div>

      <Swiper
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={14}
        freeMode={true}
        mousewheel={{ forceToAxis: true }}
        className="w-full !overflow-visible [&_.swiper-slide]:w-[125px] [&_.swiper-slide]:sm:w-[150px] [&_.swiper-slide]:lg:w-[170px]"
      >
        {artists.map((artist) => {
          const initials = artist.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          const hasFailed = failedImages[artist.name];

          return (
            <SwiperSlide key={artist.name}>
              <Link
                href={`/artist/${encodeURIComponent(artist.name)}`}
                className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-3xl bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-xl border border-white/10 hover:border-white/25 shadow-lg transition-all duration-300 cursor-pointer block"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 ring-2 ring-white/15 group-hover:ring-[#00e6e6] transition-all duration-300 shadow-md">
                  {hasFailed ? (
                    <div className="w-full h-full bg-gradient-to-br from-teal-500/80 to-blue-600/80 flex items-center justify-center text-white font-black text-xl sm:text-2xl tracking-wider">
                      {initials}
                    </div>
                  ) : (
                    <img
                      src={artist.image}
                      alt={artist.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={() => {
                        setFailedImages((prev) => ({
                          ...prev,
                          [artist.name]: true,
                        }));
                      }}
                    />
                  )}
                </div>
                <p className="text-white font-bold text-xs sm:text-sm truncate w-full group-hover:text-[#00e6e6] transition-colors">
                  {artist.name}
                </p>
                <p className="text-gray-400 text-[10px] sm:text-xs truncate w-full mt-0.5 font-medium">
                  {artist.role}
                </p>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TopArtists;
