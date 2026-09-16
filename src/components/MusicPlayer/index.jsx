"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  nextSong,
  prevSong,
  playPause,
  setFullScreen,
} from "../../redux/features/playerSlice";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";
import FullscreenTrack from "./FullscreenTrack";
import Lyrics from "./Lyrics";
import Downloader from "./Downloader";
import { HiOutlineChevronDown } from "react-icons/hi";
import { addFavourite, getFavourite } from "@/services/dataAPI";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FavouriteButton from "./FavouriteButton";
import getPixels from "get-pixels";
import { extractColors } from "extract-colors";
import EqualizerModal from "./EqualizerModal";

const MusicPlayer = () => {
  const {
    activeSong,
    currentSongs,
    currentIndex,
    isActive,
    isPlaying,
    fullScreen,
  } = useSelector((state) => state.player);
  const { isTyping } = useSelector((state) => state.loadingBar);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { status } = useSession();
  const router = useRouter();
  const [bgColor, setBgColor] = useState();
  const [showEqualizer, setShowEqualizer] = useState(false);

  useEffect(() => {
    if (currentSongs?.length) dispatch(playPause(true));
  }, [currentIndex]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const res = await getFavourite();
        // console.log("favourites",res);
        if (res) {
          setFavouriteSongs(res);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchFavourites();
    // set ambient background
    const src = activeSong?.image?.[1]?.url;

    if (src) {
      getPixels(src, (err, pixels) => {
        if (!err) {
          const data = [...pixels.data];
          const width = Math.round(Math.sqrt(data.length / 4));
          const height = width;

          extractColors({ data, width, height })
            .then((colors) => {
              setBgColor(colors[0]);
            })
            .catch(console.log);
        }
      });
    }
    // change page title to song name
    if (activeSong?.name) {
      document.title = activeSong?.name;
    }
  }, [activeSong]);

  // off scroll when full screen
  useEffect(() => {
    document.documentElement.style.overflow = fullScreen ? "hidden" : "auto";

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [fullScreen]);

  // Hotkey for play pause
  const handleKeyPress = (event) => {
    // Check if the pressed key is the spacebar (keyCode 32 or key " ")
    if (!isTyping && (event.keyCode === 32 || event.key === " ")) {
      event.preventDefault();
      handlePlayPause();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handlePlayPause = (e) => {
    e?.stopPropagation();
    if (!isActive) return;

    if (isPlaying) {
      dispatch(playPause(false));
    } else {
      dispatch(playPause(true));
    }
  };

  const handleNextSong = (e) => {
    e?.stopPropagation();
    dispatch(playPause(false));

    if (!shuffle) {
      dispatch(nextSong((currentIndex + 1) % currentSongs.length));
    } else {
      dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
    }
  };

  const handlePrevSong = (e) => {
    e?.stopPropagation();
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else if (shuffle) {
      dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  };

  const handleAddToFavourite = async (favsong) => {
    if (status === "unauthenticated") {
      dispatch(setFullScreen(false));
      router.push("/login");
    }

    if (favsong?.id && status === "authenticated") {
      try {
        setLoading(true);
        // optimistic update
        if (favouriteSongs?.find((song) => song === favsong?.id)) {
          setFavouriteSongs(
            favouriteSongs?.filter((song) => song !== favsong?.id),
          );
        } else {
          setFavouriteSongs([...favouriteSongs, favsong?.id]);
        }
        const res = await addFavourite(favsong);
        if (res?.success === true) {
          setFavouriteSongs(res?.data?.favourites);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("add to fav error", error);
      }
    }
  };

  if (!activeSong?.name && !activeSong?.id && (!currentSongs || currentSongs.length === 0)) {
    return null;
  }

  return (
    <>
      <div
        className={`transition-all duration-300 select-none ${
          fullScreen
            ? "fixed inset-0 z-50 h-screen w-screen overflow-y-auto hideScrollBar px-4 sm:px-12 flex flex-col bg-black/40 backdrop-blur-3xl border-t border-white/15"
            : "fixed bottom-3 inset-x-2 sm:inset-x-6 max-w-5xl mx-auto z-50 h-[80px] sm:h-[84px] rounded-3xl sm:rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)] px-3.5 sm:px-6 flex flex-col justify-center cursor-pointer overflow-hidden"
        }`}
        onClick={() => {
          if (activeSong?.id) {
            dispatch(setFullScreen(!fullScreen));
          }
        }}
        style={{
          background: fullScreen
            ? bgColor
              ? `radial-gradient(circle at 50% 25%, rgba(${bgColor.red}, ${bgColor.green}, ${bgColor.blue}, 0.25) 0%, rgba(0,0,0,0.45) 85%)`
              : "radial-gradient(circle at 50% 25%, rgba(0, 230, 230, 0.18) 0%, rgba(0,0,0,0.45) 85%)"
            : undefined,
          boxShadow: !fullScreen && bgColor
            ? `0 8px 32px rgba(${bgColor.red}, ${bgColor.green}, ${bgColor.blue}, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)`
            : undefined,
        }}
      >
        {/* Fullscreen iOS Header */}
        {fullScreen && (
          <div className="sticky top-0 z-20 flex flex-col items-center pt-2 pb-2 w-full bg-transparent">
            <div
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setFullScreen(false));
              }}
              className="w-12 h-1.5 bg-white/40 hover:bg-white/70 rounded-full cursor-pointer transition-all duration-200 mb-3"
            />
            <div className="flex items-center justify-between w-full max-w-6xl px-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setFullScreen(false));
                }}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-xl text-white transition-all active:scale-90 cursor-pointer shadow-lg"
                aria-label="Close Fullscreen"
              >
                <HiOutlineChevronDown size={22} />
              </button>
              <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#00e6e6] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                  Now Playing
                </span>
              </div>
              <div className="w-9" />
            </div>
          </div>
        )}

        <div
          className={`flex flex-col ${
            fullScreen ? "max-md:min-h-screen pb-6" : "w-full"
          }`}
        >
          <FullscreenTrack
            handleNextSong={handleNextSong}
            handlePrevSong={handlePrevSong}
            activeSong={activeSong}
            fullScreen={fullScreen}
          />
          <div
            className={`flex items-center justify-between w-full ${
              fullScreen ? "flex-col max-w-xl mx-auto mt-2" : "max-w-[1300px]"
            }`}
          >
            <Track
              isPlaying={isPlaying}
              isActive={isActive}
              activeSong={activeSong}
              fullScreen={fullScreen}
            />
            <div
              className={`flex flex-col items-center justify-center ${
                fullScreen ? "w-full my-2" : "flex-1"
              }`}
            >
              <div
                className={`${
                  fullScreen ? "" : "hidden"
                } sm:hidden flex items-center justify-center gap-4`}
              >
                <FavouriteButton
                  favouriteSongs={favouriteSongs}
                  activeSong={activeSong}
                  loading={loading}
                  handleAddToFavourite={handleAddToFavourite}
                  style={"mb-4"}
                />
                <div className="mb-3 sm:hidden flex items-center justify-center">
                  <Downloader activeSong={activeSong} fullScreen={fullScreen} />
                </div>
              </div>

              {fullScreen && (
                <Seekbar
                  value={appTime}
                  min="0"
                  max={duration}
                  fullScreen={fullScreen}
                  onInput={(event) => setSeekTime(event.target.value)}
                  setSeekTime={setSeekTime}
                  appTime={appTime}
                />
              )}

              <Controls
                isPlaying={isPlaying}
                isActive={isActive}
                repeat={repeat}
                setRepeat={setRepeat}
                shuffle={shuffle}
                setShuffle={setShuffle}
                currentSongs={currentSongs}
                activeSong={activeSong}
                fullScreen={fullScreen}
                handlePlayPause={handlePlayPause}
                handlePrevSong={handlePrevSong}
                handleNextSong={handleNextSong}
                handleAddToFavourite={handleAddToFavourite}
                favouriteSongs={favouriteSongs}
                loading={loading}
                onOpenEqualizer={() => setShowEqualizer(true)}
              />

              <Player
                activeSong={activeSong}
                volume={volume}
                isPlaying={isPlaying}
                seekTime={seekTime}
                repeat={repeat}
                currentIndex={currentIndex}
                onEnded={handleNextSong}
                handlePlayPause={handlePlayPause}
                handleNextSong={handleNextSong}
                handlePrevSong={handlePrevSong}
                onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
                onLoadedData={(event) => setDuration(event.target.duration)}
                appTime={appTime}
                setSeekTime={setSeekTime}
              />
            </div>

            <VolumeBar
              activeSong={activeSong}
              bgColor={bgColor}
              fullScreen={fullScreen}
              value={volume}
              min="0"
              max="1"
              onChange={(event) => setVolume(event.target.value)}
              setVolume={setVolume}
              onOpenEqualizer={() => setShowEqualizer(true)}
            />
          </div>
        </div>

        {/* Real-time glowing progress line along bottom of compact pill */}
        {!fullScreen && (
          <div className="absolute bottom-0 inset-x-8 h-[2.5px] bg-white/10 rounded-full overflow-hidden pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-[#00e6e6] via-[#38bdf8] to-[#ec4899] rounded-full transition-all duration-150"
              style={{
                width: `${
                  duration ? Math.min(100, Math.max(0, (appTime / duration) * 100)) : 0
                }%`,
              }}
            />
          </div>
        )}

        {fullScreen && (
          <div className="min-[1180px]:hidden mt-6">
            <div className="rounded-3xl bg-white/[0.05] border border-white/15 backdrop-blur-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
              <Lyrics activeSong={activeSong} currentSongs={currentSongs} />
            </div>
          </div>
        )}
      </div>

      <EqualizerModal
        isOpen={showEqualizer}
        onClose={() => setShowEqualizer(false)}
      />
    </>
  );
};

export default MusicPlayer;
