"use client";
import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";

const ARTISTS = [
  {
    name: "Arijit Singh",
    role: "Playback Singer",
    image: "https://c.saavncdn.com/artists/Arijit_Singh_002_20230323062147_500x500.jpg",
  },
  {
    name: "Shreya Ghoshal",
    role: "Melody Queen",
    image: "https://c.saavncdn.com/artists/Shreya_Ghoshal_006_20241119104043_500x500.jpg",
  },
  {
    name: "Atif Aslam",
    role: "Pop / Romantic",
    image: "https://c.saavncdn.com/artists/Atif_Aslam_002_20230727114557_500x500.jpg",
  },
  {
    name: "Diljit Dosanjh",
    role: "Punjabi / Pop",
    image: "https://c.saavncdn.com/artists/Diljit_Dosanjh_004_20221019174003_500x500.jpg",
  },
  {
    name: "Jubin Nautiyal",
    role: "Soulful Singer",
    image: "https://c.saavncdn.com/artists/Jubin_Nautiyal_003_20231127103415_500x500.jpg",
  },
  {
    name: "Vishal Mishra",
    role: "Composer & Singer",
    image: "https://c.saavncdn.com/artists/Vishal_Mishra_001_20230220100546_500x500.jpg",
  },
  {
    name: "Yo Yo Honey Singh",
    role: "Hip-Hop / Rap",
    image: "https://c.saavncdn.com/artists/Yo_Yo_Honey_Singh_005_20231025081951_500x500.jpg",
  },
  {
    name: "Darshan Raval",
    role: "Indie Pop",
    image: "https://c.saavncdn.com/artists/Darshan_Raval_005_20231025073404_500x500.jpg",
  },
  {
    name: "Udit Narayan",
    role: "Legendary Singer",
    image: "https://c.saavncdn.com/artists/Udit_Narayan_005_20231025073054_500x500.jpg",
  },
];

const TopArtists = () => {
  return (
    <div className="my-6 lg:mt-14 select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white text-2xl lg:text-3xl font-extrabold tracking-tight">
            Top Artists
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Discover music from legendary voices
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
        {ARTISTS.map((artist) => (
          <SwiperSlide key={artist.name}>
            <Link
              href={`/artist/${encodeURIComponent(artist.name)}`}
              className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-3xl bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-xl border border-white/10 hover:border-white/25 shadow-lg transition-all duration-300 cursor-pointer block"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 ring-2 ring-white/15 group-hover:ring-[#00e6e6] transition-all duration-300 shadow-md">
                <img
                  src={artist.image}
                  alt={artist.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://i.ytimg.com/vi/sDne5fEsxec/hqdefault.jpg";
                  }}
                />
              </div>
              <p className="text-white font-bold text-xs sm:text-sm truncate w-full group-hover:text-[#00e6e6] transition-colors">
                {artist.name}
              </p>
              <p className="text-gray-400 text-[10px] sm:text-xs truncate w-full mt-0.5 font-medium">
                {artist.role}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopArtists;
