"use client";
import React, { useState, useEffect } from "react";
import { GiFastBackwardButton, GiFastForwardButton } from "react-icons/gi";

const Seekbar = ({
  value = 0,
  min = 0,
  max = 0,
  onSeek,
  onInput,
  setSeekTime,
  appTime,
  fullScreen,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);

  // Synchronize dragValue when not dragging
  useEffect(() => {
    if (!isDragging) {
      setDragValue(value || 0);
    }
  }, [value, isDragging]);

  const getTime = (time) => {
    if (!time || isNaN(time) || time < 0) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const safeMax = Math.max(1, max || 0);
  const displayTime = isDragging ? dragValue : (value || 0);

  const handleStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragValue(Number(e.target.value));
  };

  const handleDrag = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragValue(Number(e.target.value));
    if (onInput) onInput(e);
  };

  const handleCommit = (e) => {
    e.stopPropagation();
    const finalVal = Number(e.target.value);
    setIsDragging(false);
    setDragValue(finalVal);
    if (onSeek) {
      onSeek(finalVal);
    } else if (setSeekTime) {
      setSeekTime(finalVal);
    }
  };

  const handleStep = (delta) => {
    const current = isDragging ? dragValue : (value || appTime || 0);
    const nextVal = Math.max(0, Math.min(safeMax, current + delta));
    setDragValue(nextVal);
    if (onSeek) {
      onSeek(nextVal);
    } else if (setSeekTime) {
      setSeekTime(nextVal);
    }
  };

  return (
    <div
      className={`${
        !fullScreen ? "hidden" : "flex w-full max-w-xl mx-auto px-4 my-3"
      } flex-row items-center gap-2 select-none`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleStep(-5);
        }}
        className="hidden sm:block text-gray-300 hover:text-white transition-colors active:scale-90"
        title="Rewind 5s"
      >
        <GiFastBackwardButton size={22} />
      </button>

      <p className="text-gray-300 text-xs sm:text-sm font-semibold w-10 text-right select-none font-mono">
        {getTime(displayTime)}
      </p>

      <input
        type="range"
        step="0.5"
        value={Math.min(safeMax, Math.max(0, displayTime))}
        min={min}
        max={safeMax}
        onPointerDown={handleStart}
        onTouchStart={handleStart}
        onMouseDown={handleStart}
        onInput={handleDrag}
        onPointerUp={handleCommit}
        onTouchEnd={handleCommit}
        onMouseUp={handleCommit}
        onChange={handleCommit}
        className="flex-1 h-1.5 rounded-full accent-[#00e6e6] cursor-pointer bg-white/20 hover:bg-white/30 transition-all"
      />

      <p className="text-gray-300 text-xs sm:text-sm font-semibold w-10 text-left select-none font-mono">
        {getTime(safeMax)}
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleStep(5);
        }}
        className="hidden lg:block text-gray-300 hover:text-white transition-colors active:scale-90"
        title="Forward 5s"
      >
        <GiFastForwardButton size={22} />
      </button>
    </div>
  );
};

export default Seekbar;
