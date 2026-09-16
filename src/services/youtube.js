const INNER_TUBE_KEY = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw";
const YUKI_STREAM_BASE = "https://music.yukiapi.site";
const YUKI_API_KEY = "yuki_16b7e9168529decf6721f48a8c97c4b2";

export function getStreamUrl(videoId, quality = "128") {
  return `${YUKI_STREAM_BASE}/stream/${videoId}?key=${YUKI_API_KEY}&type=audio&quality=${quality}`;
}

export function parseDuration(durationStr) {
  if (!durationStr) return 0;
  if (typeof durationStr === "number") return durationStr;
  const parts = durationStr.toString().split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(durationStr) || 0;
}

export function formatSongItem(item) {
  if (!item || !item.id) return null;
  const id = item.id;
  const streamUrl = getStreamUrl(id);
  const title = (item.title || "Song").trim();
  const channel = (item.channel || item.subtitle || "Artist").trim();
  const durationSec = parseDuration(item.duration);

  const images = [
    { quality: "low", url: `https://i.ytimg.com/vi/${id}/default.jpg` },
    { quality: "medium", url: `https://i.ytimg.com/vi/${id}/mqdefault.jpg` },
    { quality: "high", url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` },
  ];

  return {
    id,
    type: "song",
    name: title,
    title,
    subtitle: channel,
    artists: {
      primary: [{ id: channel, name: channel }],
      all: [{ id: channel, name: channel }],
    },
    primaryArtists: channel,
    album: {
      id: id,
      name: title,
    },
    image: images,
    duration: durationSec,
    downloadUrl: [
      { quality: "12kbps", url: streamUrl },
      { quality: "48kbps", url: streamUrl },
      { quality: "96kbps", url: streamUrl },
      { quality: "160kbps", url: streamUrl },
      { quality: "320kbps", url: streamUrl },
    ],
    url: streamUrl,
    audioUrl: streamUrl,
  };
}

export function formatPlaylistItem(item) {
  if (!item || !item.id) return null;
  const id = item.id;
  const title = (item.title || "Playlist").trim();
  const subtitle = (item.subtitle || `${item.videoCount || ""} Songs`).trim();
  const thumb = item.thumbnail || (item.firstVideoId ? `https://i.ytimg.com/vi/${item.firstVideoId}/hqdefault.jpg` : `https://i.ytimg.com/vi/sDne5fEsxec/hqdefault.jpg`);

  return {
    id,
    type: "playlist",
    title,
    name: title,
    subtitle,
    language: item.language || "Hindi",
    description: item.description || title,
    image: [
      { quality: "low", url: thumb },
      { quality: "medium", url: thumb },
      { quality: "high", url: thumb },
    ],
    videoCount: item.videoCount || 0,
    songs: item.songs || [],
  };
}

async function fetchInnerTube(endpoint, payload) {
  try {
    const res = await fetch(`https://www.youtube.com/youtubei/v1/${endpoint}?key=${INNER_TUBE_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20250101.01.00",
            hl: "en-IN",
            gl: "IN",
          },
        },
        ...payload,
      }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`InnerTube ${endpoint} error:`, err);
    return null;
  }
}

export async function searchYouTubeSongs(query, limit = 25) {
  const data = await fetchInnerTube("search", {
    query,
    params: "CAASAhAB",
  });
  if (!data) return [];

  const songs = [];
  function scan(node) {
    if (!node || typeof node !== "object") return;
    if (node.videoRenderer) {
      const v = node.videoRenderer;
      const vid = v.videoId;
      if (vid && vid.length === 11) {
        const title = v.title?.runs?.map((r) => r.text).join("") || v.title?.simpleText || "";
        const channel = v.ownerText?.runs?.[0]?.text || "";
        const duration = v.lengthText?.simpleText || "";
        const song = formatSongItem({ id: vid, title, channel, duration });
        if (song) songs.push(song);
      }
      return;
    }
    for (const key of Object.keys(node)) {
      scan(node[key]);
    }
  }

  scan(data);
  return songs.slice(0, limit);
}

export async function getYouTubeSongDetails(videoId) {
  const data = await fetchInnerTube("player", { videoId });
  if (!data || !data.videoDetails) {
    return formatSongItem({ id: videoId, title: "Song " + videoId, channel: "Artist" });
  }

  const v = data.videoDetails;
  return formatSongItem({
    id: videoId,
    title: v.title || "Song",
    channel: v.author || "Artist",
    duration: Number(v.lengthSeconds) || 0,
  });
}

export async function getYouTubePlaylistDetails(playlistId) {
  const cleanId = playlistId.replace(/^VL/, "");
  const browseId = "VL" + cleanId;
  const data = await fetchInnerTube("browse", { browseId });

  const title = data?.metadata?.playlistMetadataRenderer?.title ||
                data?.header?.playlistHeaderRenderer?.title?.simpleText ||
                "Trending Playlist";
  const desc = data?.metadata?.playlistMetadataRenderer?.description || "";

  const songs = [];
  function scan(obj) {
    if (!obj || typeof obj !== "object") return;
    if (obj.playlistVideoRenderer) {
      const v = obj.playlistVideoRenderer;
      if (v.videoId) {
        songs.push(
          formatSongItem({
            id: v.videoId,
            title: v.title?.runs?.map((r) => r.text).join("") || v.title?.simpleText || "",
            channel: v.shortBylineText?.runs?.[0]?.text || "",
            duration: v.lengthText?.simpleText || "",
          })
        );
      }
      return;
    }
    if (obj.lockupViewModel) {
      const l = obj.lockupViewModel;
      const vid = l.contentId || "";
      const img = l.contentImage?.thumbnailViewModel?.image?.sources?.slice(-1)[0]?.url || "";
      const m = img.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
      const finalVid = vid.length === 11 ? vid : (m ? m[1] : "");
      if (finalVid && finalVid.length === 11) {
        const itemTitle = l.metadata?.lockupMetadataViewModel?.title?.content || "";
        songs.push(
          formatSongItem({
            id: finalVid,
            title: itemTitle,
            channel: "YouTube Music",
            duration: 0,
          })
        );
      }
    }
    for (const k of Object.keys(obj)) scan(obj[k]);
  }

  scan(data);

  const finalSongs = songs.length > 0 ? songs : await searchYouTubeSongs(title, 25);
  const featured = FEATURED_PLAYLISTS.find((p) => p.id === cleanId || p.id === playlistId);
  const fallbackThumb = featured?.firstVideoId
    ? `https://i.ytimg.com/vi/${featured.firstVideoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${finalSongs[0]?.id || "sDne5fEsxec"}/hqdefault.jpg`;

  return {
    id: cleanId,
    type: "playlist",
    name: title,
    title: title,
    description: desc,
    image: [
      { quality: "low", url: fallbackThumb },
      { quality: "medium", url: fallbackThumb },
      { quality: "high", url: fallbackThumb },
    ],
    songs: finalSongs,
  };
}

export async function fetchHomePageData(language) {
  try {
    const lang = Array.isArray(language) ? language[0] || "Hindi" : (language || "Hindi");
    
    const [trendingSongs, newReleases] = await Promise.all([
      searchYouTubeSongs(`trending songs ${lang} 2026`, 25),
      searchYouTubeSongs(`latest hit songs ${lang} 2026`, 20),
    ]);

    const charts = FEATURED_PLAYLISTS.map(formatPlaylistItem);

    return {
      trending: {
        songs: trendingSongs,
        albums: newReleases.slice(0, 10),
      },
      charts: charts,
      albums: newReleases,
      playlists: charts,
    };
  } catch (error) {
    console.error("fetchHomePageData error:", error);
    return null;
  }
}

export async function fetchArtistData(id) {
  try {
    const songs = await searchYouTubeSongs(`${id} top hit songs`, 25);
    return {
      id,
      name: id,
      image: songs[0]?.image || [],
      songs: songs,
    };
  } catch (error) {
    console.error("fetchArtistData error:", error);
    return null;
  }
}

export async function fetchRecommendedSongs(artistId, songId) {
  try {
    const query = artistId ? `${artistId} hits songs` : "trending bollywood songs";
    return await searchYouTubeSongs(query, 15);
  } catch (error) {
    console.error("fetchRecommendedSongs error:", error);
    return [];
  }
}

export async function getYouTubeSearchSuggestions(query) {
  try {
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data[1]) ? data[1] : [];
  } catch (e) {
    return [];
  }
}

export const FEATURED_PLAYLISTS = [
  {
    id: "PLDL1LmzYahkcwTMCkYg9wizbtcB_30yax",
    title: "9xM Top Bollywood Hits",
    language: "Hindi",
    firstVideoId: "sDne5fEsxec",
    videoCount: 34,
  },
  {
    id: "PLO7-VO1D0_6MnOoKQGmYNY2OoCOP3GRfm",
    title: "Trending Hindi Songs 2026",
    language: "Hindi",
    firstVideoId: "DOjwf4bJdeM",
    videoCount: 50,
  },
  {
    id: "PLw-VjHDlEOgvz7i_vA_kY3k7k1j1gH7kM",
    title: "Top 50 Global Hits",
    language: "English",
    firstVideoId: "6qc16CeoO6o",
    videoCount: 50,
  },
  {
    id: "PLNRz147tZ90gJpGz1e8nS9VlVw8K8G6Fz",
    title: "Punjabi Superhits 2026",
    language: "Punjabi",
    firstVideoId: "aRNfSqsgrgE",
    videoCount: 40,
  },
  {
    id: "PL9bw4s64C6vd1bH4yFfT9L5H3s5L8S3s1",
    title: "Romantic Bollywood Melodies",
    language: "Hindi",
    firstVideoId: "qbvAmlKhWQQ",
    videoCount: 35,
  },
  {
    id: "PLv3L_q6P0V0mK1m8A3J5b7B8G3H7F2A6D",
    title: "Arijit Singh Essentials",
    language: "Hindi",
    firstVideoId: "sDne5fEsxec",
    videoCount: 45,
  },
];
