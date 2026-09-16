"use client";
import React, { useState, useEffect } from "react";
import {
  FREQUENCIES,
  FREQ_LABELS,
  setBandGain,
  getBandGains,
  EQ_PRESETS,
} from "./audioGraph";
import { IoClose } from "react-icons/io5";
import { RiEqualizerLine } from "react-icons/ri";

export default function EqualizerModal({ isOpen, onClose }) {
  const [gains, setGains] = useState(getBandGains());
  const [activePreset, setActivePreset] = useState("Flat");

  useEffect(() => {
    setGains(getBandGains());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSliderChange = (index, value) => {
    const val = parseFloat(value);
    setBandGain(index, val);
    const updated = [...gains];
    updated[index] = val;
    setGains(updated);
    setActivePreset("Custom");
  };

  const applyPreset = (name, presetValues) => {
    setActivePreset(name);
    presetValues.forEach((val, idx) => {
      setBandGain(idx, val);
    });
    setGains([...presetValues]);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 bg-[#090f1d]/90 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#00e6e6]/20 to-[#ec4899]/20 border border-[#00e6e6]/30 text-[#00e6e6]">
              <RiEqualizerLine size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-[#00e6e6] bg-clip-text text-transparent">
                10-Band Pro Equalizer
              </h3>
              <p className="text-xs text-gray-400">Web Audio Studio Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Presets Chips */}
        <div className="my-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
            Presets
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(EQ_PRESETS).map((pName) => (
              <button
                key={pName}
                onClick={() => applyPreset(pName, EQ_PRESETS[pName])}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activePreset === pName
                    ? "bg-gradient-to-r from-[#00e6e6] to-[#0284c7] text-black font-bold shadow-[0_0_15px_rgba(0,230,230,0.5)]"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                }`}
              >
                {pName}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Vertical Sliders */}
        <div className="py-4">
          <div className="grid grid-cols-10 gap-1.5 sm:gap-3 items-center justify-items-center h-52 bg-white/[0.03] border border-white/10 rounded-2xl p-3 sm:p-4">
            {FREQUENCIES.map((freq, idx) => (
              <div
                key={freq}
                className="flex flex-col items-center justify-between h-full w-full select-none"
              >
                <span className="text-[10px] sm:text-xs font-mono text-gray-400">
                  {gains[idx] > 0 ? `+${gains[idx]}` : gains[idx]}
                </span>

                <div className="relative flex items-center justify-center h-32 w-4">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.5"
                    value={gains[idx]}
                    onChange={(e) => handleSliderChange(idx, e.target.value)}
                    className="accent-[#00e6e6] h-32 w-2 appearance-none bg-white/10 rounded-full cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                  />
                </div>

                <span className="text-[9px] sm:text-[11px] font-semibold text-gray-400 text-center truncate w-full mt-1">
                  {FREQ_LABELS[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => applyPreset("Flat", EQ_PRESETS.Flat)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Reset All (0 dB)
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-[#00e6e6] text-black hover:bg-[#38bdf8] transition-all shadow-[0_0_15px_rgba(0,230,230,0.4)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
