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

  const trendingSongs = Array.isArray(data?.trending?.songs)
    ? data.trending.songs
    : [];
  const trendingAlbums = Array.isArray(data?.trending?.albums)
    ? data.trending.albums
    : [];
  const charts = Array.isArray(data?.charts) ? data.charts : [];
  const albums = Array.isArray(data?.albums) ? data.albums : [];
  const playlists = Array.isArray(data?.playlists) ? data.playlists : [];

  return (
    <div className="pt-2 sm:pt-4">
      <OnlineStatus />
      <div className="flex justify-between items-start px-4 sm:px-6 my-4 sm:my-6 select-none">
        <h1 className="text-[2.75rem] sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08]">
          &quot;Good
          <br />
          {timeOfDay}
        </h1>
        <div className="flex items-center gap-1.5 text-white pt-2 sm:pt-3">
          <GiMusicalNotes className="text-3xl sm:text-4xl md:text-5xl text-white" />
          <span className="text-4xl sm:text-5xl md:text-6xl font-black">&quot;</span>
        </div>
      </div>

      <ListenAgain />

      {/* trending */}
      <SwiperLayout title={"Trending"}>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          <>
            {trendingSongs.map((song) => (
              <SwiperSlide key={song?.id}>
                <SongCard
                  song={song}
                  activeSong={activeSong}
                  isPlaying={isPlaying}
                />
              </SwiperSlide>
            ))}

            {trendingAlbums.map((song) => (
              <SwiperSlide key={song?.id}>
                <SongCard
                  song={song}
                  activeSong={activeSong}
                  isPlaying={isPlaying}
                />
              </SwiperSlide>
            ))}
          </>
        )}
      </SwiperLayout>

      {/* top charts */}
      <div className="my-4 lg:mt-14">
        <h2 className=" text-white mt-4 text-2xl lg:text-3xl font-semibold mb-4 ">
          Top Charts
        </h2>
        <div className="grid lg:grid-cols-2 gap-x-10 max-h-96 lg:max-h-full lg:overflow-y-auto overflow-y-scroll">
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
