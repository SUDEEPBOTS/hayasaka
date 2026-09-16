import React from "react";
import { BsPlayFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import {
  playPause,
  setActiveSong,
  setFullScreen,
} from "@/redux/features/playerSlice";
import { BiHeadphone } from "react-icons/bi";
import { useSelector } from "react-redux";

const ListenAgainCard = ({ song, index, SongData }) => {
  const { activeSong } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const handlePlayClick = (song, index) => {
    dispatch(setActiveSong({ song, data: SongData, i: index }));
    dispatch(setFullScreen(true));
    dispatch(playPause(true));
  };

  const artistDisplay =
    (Array.isArray(song?.artists?.primary) &&
      song.artists.primary.map((artist) => artist?.name).join(", ")) ||
    (Array.isArray(song?.artists) &&
      song.artists.map((artist) => artist?.name).join(", ")) ||
    (Array.isArray(song?.artists?.all) &&
      song.artists.all.map((artist) => artist?.name).join(", ")) ||
    "";

  return (
    <div className="w-full">
      <div
        onClick={() => {
          handlePlayClick(song, index);
        }}
        className={`flex w-full items-center p-2.5 rounded-2xl backdrop-blur-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md ${
          activeSong?.id === song?.id ? "border-[#00e6e6]/40 bg-white/[0.08]" : ""
        }`}
      >
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="group w-12 h-12 md:w-14 md:h-14 relative rounded-xl overflow-hidden shadow-sm">
              <img
                src={song?.image?.[2]?.url || song?.image?.[1]?.url || song?.image?.[2]?.link || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop"}
                alt={song?.name}
                width={56}
                height={56}
                className="rounded-xl object-cover w-12 h-12 md:w-14 md:h-14 group-hover:scale-105 transition-transform"
              />
            </div>
            {activeSong?.id === song?.id ? (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                <BiHeadphone
                  size={24}
                  className="text-[#00e6e6] animate-pulse"
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <BsPlayFill
                  size={26}
                  className="text-white ml-0.5"
                />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm lg:text-base font-bold truncate ${
              activeSong?.id === song?.id ? "text-[#00e6e6]" : "text-white"
            }`}>
              {song?.name?.replace("&#039;", "'")?.replace("&amp;", "&")}
            </p>
            <p className="text-gray-400 truncate text-xs mt-0.5 font-medium">
              {artistDisplay}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenAgainCard;
