"use client";
import React from "react";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { TbRepeat, TbRepeatOnce, TbArrowsShuffle } from "react-icons/tb";
import Downloader from "./Downloader";
import FavouriteButton from "./FavouriteButton";
import { RiEqualizerLine } from "react-icons/ri";

const Controls = ({
  isPlaying,
  repeat,
  setRepeat,
  shuffle,
  setShuffle,
  currentSongs,
  handlePlayPause,
  handlePrevSong,
  handleNextSong,
  activeSong,
  fullScreen,
  handleAddToFavourite,
  favouriteSongs,
  loading,
  onOpenEqualizer,
}) => {
  return (
    <div
      className={`flex items-center text-lg ${
        fullScreen
          ? "w-full max-w-md justify-around my-4 py-2"
          : "w-auto justify-end sm:justify-around md:w-72 gap-2 sm:gap-3"
      }`}
    >
      <FavouriteButton
        favouriteSongs={favouriteSongs}
        activeSong={activeSong}
        loading={loading}
        handleAddToFavourite={handleAddToFavourite}
        style={fullScreen ? "block" : "hidden sm:block"}
      />
      {!repeat ? (
        <TbRepeat
          title="Repeat"
          size={fullScreen ? 26 : 22}
          color={"white"}
          onClick={(e) => {
            e.stopPropagation();
            setRepeat((prev) => !prev);
          }}
          className={`${
            !fullScreen ? "hidden sm:block" : "m-2"
          } cursor-pointer hover:text-[#00e6e6] transition-colors`}
        />
      ) : (
        <TbRepeatOnce
          title="Repeat Once"
          size={fullScreen ? 26 : 22}
          color={repeat ? "#00e6e6" : "white"}
          onClick={(e) => {
            e.stopPropagation();
            setRepeat((prev) => !prev);
          }}
          className={`${
            !fullScreen ? "hidden sm:block" : "m-2"
          } cursor-pointer hover:text-[#00e6e6] transition-colors`}
        />
      )}

      <button
        type="button"
        title="Previous"
        onClick={handlePrevSong}
        className="text-white hover:text-[#00e6e6] active:scale-90 transition-transform p-1 cursor-pointer"
      >
        <MdSkipPrevious size={fullScreen ? 36 : 30} />
      </button>

      {isPlaying ? (
        <button
          type="button"
          title="Pause"
          onClick={handlePlayPause}
          className={`${
            fullScreen
              ? "w-14 h-14 sm:w-16 sm:h-16 shadow-[0_0_30px_rgba(0,230,230,0.6)]"
              : "w-12 h-12 sm:w-13 sm:h-13 shadow-[0_0_20px_rgba(0,230,230,0.55)]"
          } rounded-full bg-gradient-to-tr from-[#00e6e6] to-[#38bdf8] text-black flex items-center justify-center active:scale-95 transition-all cursor-pointer flex-shrink-0`}
        >
          <BsFillPauseFill size={fullScreen ? 34 : 28} />
        </button>
      ) : (
        <button
          type="button"
          title="Play"
          onClick={handlePlayPause}
          className={`${
            fullScreen
              ? "w-14 h-14 sm:w-16 sm:h-16 shadow-[0_0_30px_rgba(0,230,230,0.6)]"
              : "w-12 h-12 sm:w-13 sm:h-13 shadow-[0_0_20px_rgba(0,230,230,0.55)]"
          } rounded-full bg-gradient-to-tr from-[#00e6e6] to-[#38bdf8] text-black flex items-center justify-center active:scale-95 transition-all cursor-pointer pl-0.5 flex-shrink-0`}
        >
          <BsFillPlayFill size={fullScreen ? 34 : 28} />
        </button>
      )}

      <button
        type="button"
        title="Next"
        onClick={handleNextSong}
        className="text-white hover:text-[#00e6e6] active:scale-90 transition-transform p-1 cursor-pointer"
      >
        <MdSkipNext size={fullScreen ? 36 : 30} />
      </button>

      <TbArrowsShuffle
        title="Shuffle"
        size={fullScreen ? 26 : 22}
        color={shuffle ? "#00e6e6" : "white"}
        onClick={(e) => {
          e.stopPropagation();
          setShuffle((prev) => !prev);
        }}
        className={`${!fullScreen ? "hidden sm:block" : "m-2"} cursor-pointer hover:text-[#00e6e6] transition-colors`}
      />

      <button
        type="button"
        title="10-Band Equalizer"
        aria-label="Open Equalizer"
        onClick={(e) => {
          e.stopPropagation();
          onOpenEqualizer?.();
        }}
        className={`${
          !fullScreen ? "hidden sm:flex" : "flex"
        } items-center justify-center p-2 rounded-xl text-gray-300 hover:text-[#00e6e6] hover:bg-white/10 active:scale-95 transition-all cursor-pointer`}
      >
        <RiEqualizerLine size={fullScreen ? 24 : 20} />
      </button>

      {activeSong?.downloadUrl?.[4]?.url && (
        <div className={`${!fullScreen ? "hidden sm:block" : "block"} mt-1`}>
          <Downloader activeSong={activeSong} fullScreen={fullScreen} />
        </div>
      )}
    </div>
  );
};

export default Controls;
