import Link from "next/link";
import { FaPlayCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import getPixels from "get-pixels";
import { extractColors } from "extract-colors";

const SongBar = ({ playlist, i }) => {
  const [cardColor, setCardColor] = useState();

  useEffect(() => {
    const src =
      playlist?.image?.[2]?.url ||
      playlist?.image?.[1]?.url ||
      playlist?.image?.[0]?.url ||
      playlist?.image?.[1]?.link;
    if (!src) return;
    try {
      getPixels(src, (err, pixels) => {
        if (!err && pixels?.data) {
          const data = [...pixels.data];
          const width = Math.round(Math.sqrt(data.length / 4));
          const height = width;

          extractColors({ data, width, height })
            .then((colors) => {
              if (Array.isArray(colors) && colors.length >= 3) {
                setCardColor(colors);
              }
            })
            .catch(() => {});
        }
      });
    } catch (e) {}
  }, [playlist]);

  const thumbUrl =
    playlist?.image?.[2]?.url ||
    playlist?.image?.[1]?.url ||
    playlist?.image?.[0]?.url ||
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop";

  return (
    <Link href={`/playlist/${playlist?.id}`}>
      <div
        className={`w-full flex flex-row items-center group py-2.5 px-4 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer mb-3`}
        style={{
          background:
            cardColor &&
            `linear-gradient(90deg, rgba(${cardColor[0].red}, ${cardColor[0].green}, ${cardColor[0].blue}, 0.25) 0%, rgba(${cardColor[1].red}, ${cardColor[1].green}, ${cardColor[1].blue}, 0.2) 50%, rgba(255, 255, 255, 0.03) 100%)`,
        }}
      >
        <h3 className="text-base sm:text-lg text-white/70 mr-3.5 font-black">{i + 1}.</h3>
        <div className="flex-1 flex flex-row justify-between items-center">
          <img
            width={80}
            height={80}
            loading="lazy"
            alt={playlist?.title || "playlist_img"}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            src={thumbUrl}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop";
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex-1 flex flex-col justify-center mx-3 sm:mx-4">
            <p className="font-bold text-sm sm:text-base lg:text-lg text-white truncate max-w-[180px] sm:max-w-md group-hover:text-[#00e6e6] transition-colors">
              {playlist?.title}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 capitalize font-medium">
              {playlist?.language} • {playlist?.videoCount || "Top"} Tracks
            </p>
          </div>
        </div>
        <FaPlayCircle
          size={36}
          className="text-[#00e6e6]/80 group-hover:text-[#00e6e6] group-hover:scale-110 transform transition-all duration-300 ease-in-out flex-shrink-0 mr-1"
        />
      </div>
    </Link>
  );
};

export default SongBar;
