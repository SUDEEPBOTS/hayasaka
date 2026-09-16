"use client";
import { homePageData } from "@/services/dataAPI";
import React from "react";
import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import SongCard from "./SongCard";
import { useDispatch, useSelector } from "react-redux";
import SwiperLayout from "./Swiper";
import { setProgress } from "@/redux/features/loadingBarSlice";
import SongCardSkeleton from "./SongCardSkeleton";
import { GiMusicalNotes } from "react-icons/gi";
import SongBar from "./SongBar";
import OnlineStatus from "./OnlineStatus";
import ListenAgain from "./ListenAgain";
import TopArtists from "./TopArtists";
import MoodStations from "./MoodStations";
import QuickPicks from "./QuickPicks";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { languages } = useSelector((state) => state.languages);

  // salutation
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let timeOfDay = "afternoon";
  if (currentHour >= 5 && currentHour < 12) {
    timeOfDay = "morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    timeOfDay = "afternoon";
  } else {
    timeOfDay = "evening";
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setProgress(70));
      const res = await homePageData(languages);
      setData(res || null);
      dispatch(setProgress(100));
      setLoading(false);
    };
    fetchData();
  }, [languages]);

  const quickPicks = Array.isArray(data?.quickPicks)
    ? data.quickPicks
    : Array.isArray(data?.trending?.quickPicks)
    ? data.trending.quickPicks
    : [];
  const trendingSongs = Array.isArray(data?.trending?.songs)
    ? data.trending.songs
    : [];
  const charts = Array.isArray(data?.charts) ? data.charts : [];
  const albums = Array.isArray(data?.albums) ? data.albums : [];
  const playlists = Array.isArray(data?.playlists) ? data.playlists : [];

  const quickPickList =
    quickPicks.length > 0 ? quickPicks : trendingSongs.slice(0, 8);
  const trendingList =
    quickPicks.length > 0
      ? trendingSongs
      : trendingSongs.slice(8).length > 0
      ? trendingSongs.slice(8)
      : trendingSongs;

  return (
    <div className="pt-2 sm:pt-4">
      <OnlineStatus />
      <div className="flex justify-between items-start px-4 sm:px-6 my-4 sm:my-8 select-none">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.95] sm:leading-[0.9]">
          &quot;Good
          <br />
          {timeOfDay}
        </h1>
        <div className="flex items-center gap-2 sm:gap-3 text-white pt-2 sm:pt-4 select-none">
          <GiMusicalNotes className="text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.4)] animate-pulse" />
          <span className="text-5xl sm:text-6xl md:text-7xl font-black">&quot;</span>
        </div>
      </div>

      <ListenAgain />

      {/* Quick Picks • Tap to play */}
      {!loading && quickPickList.length > 0 && (
        <QuickPicks songs={quickPickList} />
      )}

      {/* trending */}
      <SwiperLayout title={"Trending"}>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          trendingList.map((song) => (
            <SwiperSlide key={song?.id}>
              <SongCard
                song={song}
                activeSong={activeSong}
                isPlaying={isPlaying}
              />
            </SwiperSlide>
          ))
        )}
      </SwiperLayout>

      {/* Top Artists • Purvi Music Style */}
      <TopArtists />

      {/* Moods & Vibes Stations */}
      <MoodStations />

      {/* top charts */}
      <div className="my-6 lg:mt-14 select-none">
        <div className="mb-4">
          <h2 className="text-white text-2xl lg:text-3xl font-extrabold tracking-tight">
            Top Charts
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Most popular playlists this week
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-x-6 max-h-96 lg:max-h-full lg:overflow-y-auto overflow-y-scroll">
          {loading ? (
            <div className=" w-[90vw] overflow-x-hidden">
              <SongCardSkeleton />
            </div>
          ) : (
            charts.slice(0, 10).map((playlist, index) => (
              <SongBar key={playlist?.id} playlist={playlist} i={index} />
            ))
          )}
        </div>
      </div>

      {/* New Releases */}
      <SwiperLayout title={"New Releases"}>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          albums.map((song) => (
            <SwiperSlide key={song?.id}>
              <SongCard
                song={song}
                activeSong={activeSong}
                isPlaying={isPlaying}
              />
            </SwiperSlide>
          ))
        )}
      </SwiperLayout>

      {/* featured playlists */}
      <SwiperLayout title={"Featured Playlists"}>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          playlists.map((song) => (
            <SwiperSlide key={song?.id}>
              <SongCard
                key={song?.id}
                song={song}
                activeSong={activeSong}
                isPlaying={isPlaying}
              />
            </SwiperSlide>
          ))
        )}
      </SwiperLayout>
    </div>
  );
};

export default Home;
