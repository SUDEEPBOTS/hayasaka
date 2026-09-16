// Singleton Web Audio Context, 10-band Equalizer, and Real-time Analyser
export const FREQUENCIES = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
export const FREQ_LABELS = ["31Hz", "63Hz", "125Hz", "250Hz", "500Hz", "1kHz", "2kHz", "4kHz", "8kHz", "16kHz"];

let audioCtx = null;
let analyserNode = null;
let biquadFilters = [];
let sourceConnected = false;
let gains = new Array(10).fill(0);

export function initAudioGraph(audioElement) {
  if (typeof window === "undefined" || !audioElement || sourceConnected) {
    return { audioCtx, analyserNode, biquadFilters };
  }

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (biquadFilters.length === 0) {
      biquadFilters = FREQUENCIES.map((freq, idx) => {
        const filter = audioCtx.createBiquadFilter();
        if (idx === 0) {
          filter.type = "lowshelf";
        } else if (idx === FREQUENCIES.length - 1) {
          filter.type = "highshelf";
        } else {
          filter.type = "peaking";
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = gains[idx] || 0;
        return filter;
      });
    }

    if (!analyserNode) {
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 64;
      analyserNode.smoothingTimeConstant = 0.8;
    }

    try {
      const source = audioCtx.createMediaElementSource(audioElement);
      source.connect(biquadFilters[0]);

      for (let i = 0; i < biquadFilters.length - 1; i++) {
        biquadFilters[i].connect(biquadFilters[i + 1]);
      }

      biquadFilters[biquadFilters.length - 1].connect(analyserNode);
      analyserNode.connect(audioCtx.destination);
      sourceConnected = true;
    } catch (e) {
      // Source might already be connected to element
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  } catch (err) {
    console.warn("Web Audio API graph init:", err);
  }

  return { audioCtx, analyserNode, biquadFilters };
}

export function resumeAudioGraph() {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

export function setBandGain(index, gainDb) {
  if (index >= 0 && index < 10) {
    gains[index] = gainDb;
    if (biquadFilters[index]) {
      biquadFilters[index].gain.setTargetAtTime(gainDb, audioCtx ? audioCtx.currentTime : 0, 0.05);
    }
  }
}

export function getBandGains() {
  return [...gains];
}

export function getAnalyserNode() {
  return analyserNode;
}

export const EQ_PRESETS = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Bass Boost": [7, 6, 4, 2, 0, 0, 0, 1, 2, 3],
  "Vocal Clarity": [-2, -1, 0, 2, 4, 5, 4, 2, 1, 0],
  Electronic: [6, 5, 2, 0, -1, 2, 3, 5, 6, 6],
  Rock: [5, 4, 2, -1, -2, 1, 3, 5, 5, 5],
  "Treble Boost": [-2, -1, 0, 0, 1, 2, 4, 6, 8, 9],
  Pop: [-1, 1, 3, 4, 3, 0, -1, 1, 3, 4],
};
