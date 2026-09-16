import Lyrics from "./Lyrics";
import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setFullScreen } from "@/redux/features/playerSlice";
import { useSwipeable } from "react-swipeable";

const FullscreenTrack = ({
  fullScreen,
  activeSong,
  handlePrevSong,
  handleNextSong,
}) => {
  const dispatch = useDispatch();
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextSong(),
    onSwipedRight: () => handlePrevSong(),
    onSwipedDown: () => dispatch(setFullScreen(false)),
    preventDefaultTouchmoveEvent: true,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const primaryArtists = Array.isArray(activeSong?.artists?.primary)
    ? activeSong.artists.primary
    : Array.isArray(activeSong?.artists)
    ? activeSong.artists
    : [];

  return (
    <div
      className={`${
        fullScreen ? "flex" : "hidden"
      } w-full flex-col lg:flex-row items-center justify-center lg:justify-between max-w-6xl mx-auto py-4 sm:py-6 px-2`}
    >
      <div className="flex flex-col items-center w-full lg:w-auto">
        <div
          {...handlers}
          className="relative group w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 my-3 cursor-grab active:cursor-grabbing select-none"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#00e6e6]/30 via-purple-500/20 to-[#ec4899]/30 blur-2xl opacity-80" />
          <img
            src={
              activeSong?.image?.[2]?.url ||
              activeSong?.image?.[1]?.url ||
              activeSong?.image?.[0]?.url ||
              "https://avatars.githubusercontent.com/u/143804558?v=4"
            }
            alt="cover art"
            className="relative w-full h-full object-cover rounded-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg select-none cursor-pointer text-center my-3 px-4"
        >
          <p className="truncate text-white font-extrabold text-2xl sm:text-3xl tracking-tight mb-1.5">
            {activeSong?.name
              ? activeSong?.name.replace("&#039;", "'").replace("&amp;", "&")
              : "Song"}
          </p>
          <p className="truncate text-gray-300 text-sm sm:text-base font-medium">
            {primaryArtists.length > 0 ? (
              primaryArtists.map((artist, index) => (
                <React.Fragment key={artist?.id || index}>
                  <Link
                    className="hover:underline hover:text-[#00e6e6] transition-colors mx-0.5"
                    href={`/artist/${artist?.id}`}
                    onClick={() => {
                      dispatch(setFullScreen(false));
                    }}
                  >
                    {artist?.name?.trim()}
                  </Link>
                </React.Fragment>
              ))
            ) : typeof activeSong?.artists === "string" ? (
              activeSong.artists
            ) : (
              "Artist"
            )}
          </p>
        </div>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex-col items-center min-[1180px]:flex hidden flex-1 max-w-md ml-8"
      >
        <div className="w-full rounded-3xl bg-white/[0.05] border border-white/15 backdrop-blur-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          <Lyrics activeSong={activeSong} />
        </div>
      </div>
    </div>
  );
};

export default FullscreenTrack;
