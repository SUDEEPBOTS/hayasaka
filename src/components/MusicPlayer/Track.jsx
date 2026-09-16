import Link from "next/link";
import React from "react";

const Track = ({ isPlaying, isActive, activeSong, fullScreen }) => {
  const primaryArtists = Array.isArray(activeSong?.artists?.primary)
    ? activeSong.artists.primary
    : Array.isArray(activeSong?.artists)
    ? activeSong.artists
    : [];

  return (
    <div
      className={`flex-1 flex items-center justify-start gap-3 min-w-0 ${
        fullScreen ? "hidden" : ""
      }`}
    >
      <div className="relative group">
        <div
          className={`${
            isPlaying && isActive ? "animate-[spin_18s_linear_infinite]" : ""
          } h-14 w-14 sm:h-14 sm:w-14 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/20`}
        >
          <img
            src={
              activeSong?.image?.[2]?.url ||
              activeSong?.image?.[1]?.url ||
              activeSong?.image?.[0]?.url ||
              "https://avatars.githubusercontent.com/u/143804558?v=4"
            }
            alt="cover art"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle center spindle dot for vinyl look when spinning */}
        {isPlaying && isActive && (
          <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-black/80 border border-white/40 pointer-events-none" />
        )}
      </div>

      <div className="min-w-0 max-w-[200px] sm:max-w-[240px] select-none cursor-pointer flex flex-col justify-center">
        <p className="truncate text-white font-semibold text-sm sm:text-base tracking-wide">
          {activeSong?.name
            ? activeSong?.name.replace("&#039;", "'").replace("&amp;", "&")
            : "Song"}
        </p>
        <div className="flex items-center gap-2">
          <p className="truncate text-xs sm:text-sm text-gray-400 font-medium">
            {primaryArtists.length > 0 ? (
              primaryArtists.map((artist, index) => (
                <React.Fragment key={artist?.id || index}>
                  {index > 0 ? ", " : ""}
                  {artist?.name?.trim()}
                </React.Fragment>
              ))
            ) : typeof activeSong?.artists === "string" ? (
              activeSong.artists
            ) : (
              "Artist"
            )}
          </p>
          {/* Animated sound bars */}
          {isPlaying && isActive && (
            <span className="flex items-end gap-[2px] h-3 ml-1 flex-shrink-0">
              <span className="w-[3px] bg-[#00e6e6] rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-2.5" />
              <span className="w-[3px] bg-[#38bdf8] rounded-full animate-[bounce_1.1s_ease-in-out_infinite_0.2s] h-3.5" />
              <span className="w-[3px] bg-[#ec4899] rounded-full animate-[bounce_0.9s_ease-in-out_infinite_0.4s] h-2" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Track;
