import React from "react";
import { GiFastBackwardButton, GiFastForwardButton } from "react-icons/gi";

const Seekbar = ({
  value,
  min,
  max,
  onInput,
  setSeekTime,
  appTime,
  fullScreen,
}) => {
  // converts the time to format 0:00
  const getTime = (time) =>
    `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;

  return (
    <div
      className={` ${!fullScreen ? "hidden" : "flex w-full max-w-xl mx-auto px-4 my-3"} flex-row items-center gap-2`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSeekTime(appTime - 5);
        }}
        className="hidden sm:block text-gray-300 hover:text-white transition-colors"
      >
        <GiFastBackwardButton size={22} />
      </button>
      <p className="text-gray-300 text-xs sm:text-sm font-semibold w-10 text-right select-none">
        {value === 0 ? "0:00" : getTime(value)}
      </p>
      <input
        onClick={(event) => {
          event.stopPropagation();
        }}
        type="range"
        step="any"
        value={value}
        min={min}
        max={max}
        onInput={onInput}
        className="flex-1 h-1.5 rounded-full accent-[#00e6e6] cursor-pointer bg-white/20 hover:bg-white/30 transition-all"
      />
      <p className="text-gray-300 text-xs sm:text-sm font-semibold w-10 text-left select-none">
        {max === 0 ? "0:00" : getTime(max)}
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSeekTime(appTime + 5);
        }}
        className="hidden lg:ml-4 lg:block text-white"
      >
        <GiFastForwardButton size={20} className=" text-gray-300 " />
      </button>
    </div>
  );
};

export default Seekbar;
