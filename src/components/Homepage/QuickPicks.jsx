"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import {
  playPause,
  setActiveSong,
  setFullScreen,
} from "@/redux/features/playerSlice";
import { getRecommendedSongs, getSongData } from "@/services/dataAPI";

const QuickPicks = ({ songs = [] }) => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying, currentSongs, autoAdd } = useSelector(
    (state) => state.player
  );
  const [loadingId, setLoadingId] = useState(null);

  if (!songs || songs.length === 0) return null;

  const handlePlaySong = async (song, index) => {
    if (activeSong?.id === song?.id) {
      dispatch(playPause(!isPlaying));
      return;
    }

    setLoadingId(song?.id);
    let songData = song;
    if (
      !song?.downloadUrl ||
      song?.name?.startsWith("Song ") ||
      song?.title?.startsWith("Song ")
    ) {
      const Data = await getSongData(song?.id);
      const fetched = Array.isArray(Data) ? Data[0] : Data;
      if (fetched) {
        songData = {
          ...song,
          ...fetched,
          name:
            fetched.name && !fetched.name.startsWith("Song ")
              ? fetched.name
              : song.name || song.title,
          title:
            fetched.title && !fetched.title.startsWith("Song ")
              ? fetched.title
              : song.title,
        };
      }
    }

    const primaryArtistsId =
      songData?.primaryArtistsId ||
      songData?.artists?.primary?.[0]?.id ||
      songData?.id;
    const recommended = await getRecommendedSongs(primaryArtistsId, songData?.id);
    const filteredRecommended =
      recommended?.filter(
        (s) => !currentSongs?.find((cs) => cs?.id === s?.id)
      ) || [];

    dispatch(
      setActiveSong({
        song: songData,
        data: currentSongs?.find((s) => s?.id === songData?.id)
          ? currentSongs
          : autoAdd
          ? [...currentSongs, songData, ...filteredRecommended]
          : [...currentSongs, songData],
        i: currentSongs?.find((s) => s?.id === songData?.id)
          ? currentSongs?.findIndex((s) => s?.id === songData?.id)
          : currentSongs?.length,
      })
    );
    dispatch(setFullScreen(true));
    dispatch(playPause(true));
    setLoadingId(null);
  };

  const displaySongs = songs.slice(0, 8);

  return (
    <div className="my-6 lg:mt-14 select-none">
      <div className="mb-4">
        <h2 className="text-white text-2xl lg:text-3xl font-extrabold tracking-tight">
          Quick Picks • Made For You
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          Tap any song to play instantly
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displaySongs.map((song, index) => {
          const isCurrent = activeSong?.id === song?.id;
          const isThisPlaying = isCurrent && isPlaying;
          const artistName =
            (Array.isArray(song?.artists?.primary) &&
              song.artists.primary.map((a) => a?.name).join(", ")) ||
            (song?.subtitle !== "JioSaavn" && song?.subtitle) ||
            song?.primaryArtists ||
            "Artist";

          return (
            <div
              key={song?.id || index}
              onClick={() => handlePlaySong(song, index)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl sm:rounded-3xl backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-md group ${
                isCurrent
                  ? "bg-white/[0.09] border-[#00e6e6]/40 shadow-[0_0_20px_rgba(0,230,230,0.15)]"
                  : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={
                    song?.image?.[2]?.url ||
                    song?.image?.[1]?.url ||
                    song?.image?.[0]?.url ||
                    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop"
                  }
                  alt={song?.name || "song"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop";
                  }}
                />
                <div
                  className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center transition-opacity ${
                    isCurrent
                      ? "opacity-100 bg-black/50"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {loadingId === song?.id ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isThisPlaying ? (
                    <BsFillPauseFill size={22} className="text-[#00e6e6]" />
                  ) : (
                    <BsFillPlayFill size={22} className="text-white ml-0.5" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <p
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isCurrent ? "text-[#00e6e6]" : "text-white"
                  }`}
                >
                  {song?.name?.replaceAll("&#039;", "'")?.replaceAll("&amp;", "&") ||
                    song?.title}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate mt-0.5 font-medium">
                  {artistName}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickPicks;
