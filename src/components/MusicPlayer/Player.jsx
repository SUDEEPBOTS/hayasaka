"use client";
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect } from "react";
import { initAudioGraph, resumeAudioGraph } from "./audioGraph";

const Player = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  onLoadedMetadata,
  onDurationChange,
  repeat,
  handlePlayPause,
  handlePrevSong,
  handleNextSong,
  setSeekTime,
  appTime,
  duration,
  audioRef,
}) => {
  const internalRef = useRef(null);
  const ref = audioRef || internalRef;

  useEffect(() => {
    if (ref.current) {
      initAudioGraph(ref.current);
    }
  }, []);

  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        resumeAudioGraph();
        ref.current.play()?.catch?.(() => {});
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying, activeSong]);

  const artistName = Array.isArray(activeSong?.artists?.primary)
    ? activeSong.artists.primary.map((a) => a?.name).join(", ")
    : typeof activeSong?.artists === "string"
    ? activeSong.artists
    : activeSong?.primaryArtists || "Artist";

  // media session metadata:
  const mediaMetaData = activeSong?.name
    ? {
        title: activeSong?.name,
        artist: artistName,
        album: activeSong?.album?.name || "",
        artwork: [
          {
            src:
              activeSong?.image?.[2]?.url ||
              activeSong?.image?.[1]?.url ||
              activeSong?.image?.[0]?.url ||
              "",
            sizes: "500x500",
            type: "image/jpeg",
          },
        ],
      }
    : {};

  useEffect(() => {
    if ("mediaSession" in navigator && activeSong?.name) {
      navigator.mediaSession.metadata = new window.MediaMetadata(mediaMetaData);

      navigator.mediaSession.setActionHandler("play", () => handlePlayPause());
      navigator.mediaSession.setActionHandler("pause", () => handlePlayPause());
      navigator.mediaSession.setActionHandler("previoustrack", () => handlePrevSong());
      navigator.mediaSession.setActionHandler("nexttrack", () => handleNextSong());

      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const offset = details?.seekOffset || 5;
        if (ref.current) {
          const t = Math.max(0, ref.current.currentTime - offset);
          ref.current.currentTime = t;
          if (setSeekTime) setSeekTime(t);
        }
      });

      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const offset = details?.seekOffset || 5;
        if (ref.current) {
          const maxDur = ref.current.duration || duration || 300;
          const t = Math.min(maxDur, ref.current.currentTime + offset);
          ref.current.currentTime = t;
          if (setSeekTime) setSeekTime(t);
        }
      });

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (
          details?.seekTime !== null &&
          details?.seekTime !== undefined &&
          ref.current
        ) {
          ref.current.currentTime = details.seekTime;
          if (setSeekTime) setSeekTime(details.seekTime);
        }
      });
    }
  }, [mediaMetaData]);

  // Synchronize MediaSession position state for Android/iOS lock screens
  useEffect(() => {
    if ("mediaSession" in navigator && "setPositionState" in navigator.mediaSession) {
      try {
        const cur = ref.current?.currentTime || appTime || 0;
        const dur = ref.current?.duration || duration || 0;
        if (dur > 0 && !isNaN(dur) && isFinite(dur)) {
          navigator.mediaSession.setPositionState({
            duration: Math.max(0, dur),
            playbackRate: 1.0,
            position: Math.min(Math.max(0, cur), dur),
          });
        }
      } catch (e) {}
    }
  }, [appTime, duration]);

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  // Updates audio element when seekTime changes (guards against micro-jitter loops)
  useEffect(() => {
    if (ref.current && typeof seekTime === "number" && !isNaN(seekTime)) {
      if (Math.abs(ref.current.currentTime - seekTime) > 0.4) {
        ref.current.currentTime = seekTime;
      }
    }
  }, [seekTime]);

  return (
    <>
      <audio
        src={
          activeSong?.downloadUrl?.[4]?.url ||
          activeSong?.downloadUrl?.[3]?.url ||
          activeSong?.downloadUrl?.[2]?.url ||
          activeSong?.downloadUrl?.[1]?.url ||
          activeSong?.downloadUrl?.[0]?.url ||
          activeSong?.audioUrl ||
          activeSong?.url ||
          ""
        }
        ref={ref}
        crossOrigin="anonymous"
        loop={repeat}
        preload="metadata"
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
        onLoadedMetadata={onLoadedMetadata || onLoadedData}
        onDurationChange={onDurationChange || onLoadedData}
      />
    </>
  );
};

export default Player;
