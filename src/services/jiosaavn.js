// Fast JioSaavn Music Engine for Meow (Replacing YouTube & music.yukiapi.site)
const SAAVN_BASE =
  process.env.NEXT_PUBLIC_SAAVN_API ||
  "https://jiosaavn-api-ruddy-phi.vercel.app/api";

export const TOP_FEATURED_PLAYLISTS = [
  {
    id: "1134543272",
    title: "Hindi: India Superhits Top 50",
    name: "Hindi: India Superhits Top 50",
    language: "Hindi",
    type: "playlist",
    image: [
      { quality: "50x50", url: "https://c.saavncdn.com/editorial/Hindi-IndiaSuperhitsTop50_20260911054516_500x500.jpg" },
      { quality: "150x150", url: "https://c.saavncdn.com/editorial/Hindi-IndiaSuperhitsTop50_20260911054516_500x500.jpg" },
      { quality: "500x500", url: "https://c.saavncdn.com/editorial/Hindi-IndiaSuperhitsTop50_20260911054516_500x500.jpg" },
    ],
  },
  {
    id: "4144832",
    title: "Punjabi Hit Songs",
    name: "Punjabi Hit Songs",
    language: "Punjabi",
    type: "playlist",
    image: [
      { quality: "50x50", url: "https://c.saavncdn.com/editorial/PunjabiHitSongs_20260710115246_500x500.jpg" },
      { quality: "150x150", url: "https://c.saavncdn.com/editorial/PunjabiHitSongs_20260710115246_500x500.jpg" },
      { quality: "500x500", url: "https://c.saavncdn.com/editorial/PunjabiHitSongs_20260710115246_500x500.jpg" },
    ],
  },
  {
    id: "1302033575",
    title: "Romantic Hits 2026 - Hindi",
    name: "Romantic Hits 2026 - Hindi",
    language: "Hindi",
    type: "playlist",
    image: [
      { quality: "50x50", url: "https://c.saavncdn.com/editorial/RomanticHits2026Hindi_20260707083404_500x500.jpg" },
      { quality: "150x150", url: "https://c.saavncdn.com/editorial/RomanticHits2026Hindi_20260707083404_500x500.jpg" },
      { quality: "500x500", url: "https://c.saavncdn.com/editorial/RomanticHits2026Hindi_20260707083404_500x500.jpg" },
    ],
  },
  {
    id: "79653434",
    title: "Non-Stop Bollywood Party",
    name: "Non-Stop Bollywood Party",
    language: "Hindi",
    type: "playlist",
    image: [
      { quality: "50x50", url: "https://c.saavncdn.com/editorial/NonStopParty_20251226043305_500x500.jpg" },
      { quality: "150x150", url: "https://c.saavncdn.com/editorial/NonStopParty_20251226043305_500x500.jpg" },
      { quality: "500x500", url: "https://c.saavncdn.com/editorial/NonStopParty_20251226043305_500x500.jpg" },
    ],
  },
  {
    id: "802336660",
    title: "Arijit Singh - Soulful Melodies",
    name: "Arijit Singh - Soulful Melodies",
    language: "Hindi",
    type: "playlist",
    image: [
      { quality: "50x50", url: "https://c.saavncdn.com/editorial/ArijitSinghSadSongsHindi_20240226083401_500x500.jpg" },
      { quality: "150x150", url: "https://c.saavncdn.com/editorial/ArijitSinghSadSongsHindi_20240226083401_500x500.jpg" },
      { quality: "500x500", url: "https://c.saavncdn.com/editorial/ArijitSinghSadSongsHindi_20240226083401_500x500.jpg" },
    ],
  },
];

export function decodeHtmlEntities(str) {
  if (!str || typeof str !== "string") return str || "";
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function formatSong(song) {
  if (!song || !song.id) return null;
  const bestAudio =
    song.downloadUrl?.[4]?.url ||
    song.downloadUrl?.[3]?.url ||
    song.downloadUrl?.[2]?.url ||
    song.downloadUrl?.[1]?.url ||
    song.downloadUrl?.[0]?.url ||
    song.audioUrl ||
    song.url ||
    "";

  const defaultImg =
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop";

  let images = [];
  if (Array.isArray(song.image) && song.image.length > 0) {
    images = song.image.map((img) => {
      if (typeof img === "string") {
        return { quality: "500x500", url: img };
      }
      return img;
    });
  } else if (typeof song.image === "string" && song.image) {
    const highRes = song.image.replace(/50x50|150x150/, "500x500");
    images = [
      { quality: "50x50", url: song.image },
      { quality: "150x150", url: song.image },
      { quality: "500x500", url: highRes },
    ];
  } else {
    images = [
      { quality: "50x50", url: defaultImg },
      { quality: "150x150", url: defaultImg },
      { quality: "500x500", url: defaultImg },
    ];
  }

  const rawTitle = song.name || song.title || "Song";
  const cleanTitle = decodeHtmlEntities(rawTitle);

  const primaryArtists =
    (Array.isArray(song.artists?.primary) &&
      song.artists.primary.map((a) => decodeHtmlEntities(a?.name)).join(", ")) ||
    (Array.isArray(song.artists) &&
      song.artists.map((a) => decodeHtmlEntities(a?.name)).join(", ")) ||
    decodeHtmlEntities(song.primaryArtists) ||
    decodeHtmlEntities(song.subtitle) ||
    "Artist";

  return {
    ...song,
    type: "song",
    title: cleanTitle,
    name: cleanTitle,
    primaryArtists,
    image: images,
    audioUrl: bestAudio,
    url: bestAudio,
    duration:
      typeof song.duration === "number"
        ? song.duration
        : Number(song.duration) || 200,
  };
}

async function safeFetch(url, timeoutMs = 8000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function searchSongs(query, limit = 25) {
  try {
    const json = await safeFetch(
      `${SAAVN_BASE}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`
    );
    const results = json?.data?.results || [];
    return results.map(formatSong).filter(Boolean);
  } catch (err) {
    console.error("searchSongs error:", err);
    return [];
  }
}

export async function searchAll(query) {
  try {
    const [allRes, songsRes] = await Promise.allSettled([
      safeFetch(`${SAAVN_BASE}/search?query=${encodeURIComponent(query)}`),
      safeFetch(`${SAAVN_BASE}/search/songs?query=${encodeURIComponent(query)}&limit=30`),
    ]);

    const allData = allRes.status === "fulfilled" && allRes.value?.data ? allRes.value.data : {};
    const songsWithAudio =
      songsRes.status === "fulfilled" && songsRes.value?.data?.results
        ? songsRes.value.data.results.map(formatSong)
        : [];

    return {
      topQuery: allData.topQuery || {
        results: songsWithAudio[0] ? [songsWithAudio[0]] : [],
      },
      songs: {
        results: songsWithAudio.length > 0 ? songsWithAudio : allData.songs?.results || [],
      },
      albums: allData.albums || { results: [] },
      playlists: allData.playlists || { results: [] },
    };
  } catch (err) {
    console.error("searchAll error:", err);
    return {
      topQuery: { results: [] },
      songs: { results: [] },
      albums: { results: [] },
      playlists: { results: [] },
    };
  }
}

export async function getSongDetails(id) {
  try {
    const json = await safeFetch(`${SAAVN_BASE}/songs?ids=${encodeURIComponent(id)}`);
    const list = json?.data || [];
    if (!Array.isArray(list) || list.length === 0) return null;
    return list.map(formatSong);
  } catch (err) {
    console.error("getSongDetails error:", err);
    return null;
  }
}

export async function getAlbumDetails(id) {
  try {
    const json = await safeFetch(`${SAAVN_BASE}/albums?id=${encodeURIComponent(id)}`);
    const alb = json?.data;
    if (!alb) return null;

    const songs = (alb.songs || []).map(formatSong);
    return {
      ...alb,
      title: alb.name,
      songs,
    };
  } catch (err) {
    console.error("getAlbumDetails error:", err);
    return null;
  }
}

export async function getPlaylistDetails(id) {
  try {
    const json = await safeFetch(`${SAAVN_BASE}/playlists?id=${encodeURIComponent(id)}`);
    const pl = json?.data;
    if (pl) {
      const songs = (pl.songs || []).map(formatSong);
      return {
        ...pl,
        title: pl.name || pl.title,
        songs,
      };
    }

    // Check pre-defined top featured playlists
    const local = TOP_FEATURED_PLAYLISTS.find((p) => p.id === id);
    if (local) {
      const relatedSongs = await searchSongs(`${local.title} hits`, 25);
      return {
        ...local,
        songs: relatedSongs,
      };
    }

    return null;
  } catch (err) {
    console.error("getPlaylistDetails error:", err);
    return null;
  }
}

export async function getArtistDetails(idOrName) {
  try {
    let artistId = idOrName;
    const isDigits = /^\d+$/.test(idOrName);

    if (!isDigits) {
      const sJson = await safeFetch(
        `${SAAVN_BASE}/search/artists?query=${encodeURIComponent(idOrName)}`
      );
      const first = sJson?.data?.results?.[0];
      if (first?.id) {
        artistId = first.id;
      }
    }

    const json = await safeFetch(
      `${SAAVN_BASE}/artists?id=${encodeURIComponent(artistId)}`
    );
    const artist = json?.data;
    if (!artist) {
      // Fallback: search songs for this artist
      const songs = await searchSongs(`${idOrName} hit songs`, 20);
      return {
        id: idOrName,
        name: idOrName,
        title: idOrName,
        songs,
        image: songs[0]?.image || [],
      };
    }

    const topSongs = (artist.topSongs || []).map(formatSong);
    return {
      ...artist,
      title: artist.name,
      songs: topSongs,
    };
  } catch (err) {
    console.error("getArtistDetails error:", err);
    return null;
  }
}

export async function getArtistSongs(idOrName, page = 1) {
  try {
    const isDigits = /^\d+$/.test(idOrName);
    let artistId = idOrName;

    if (!isDigits) {
      const sJson = await safeFetch(
        `${SAAVN_BASE}/search/artists?query=${encodeURIComponent(idOrName)}`
      );
      if (sJson?.data?.results?.[0]?.id) {
        artistId = sJson.data.results[0].id;
      }
    }

    const json = await safeFetch(
      `${SAAVN_BASE}/artists/${encodeURIComponent(artistId)}/songs?page=${page}`
    );
    const songs = json?.data?.songs || json?.data || [];
    if (Array.isArray(songs) && songs.length > 0) {
      return songs.map(formatSong);
    }

    return await searchSongs(`${idOrName} top songs`, 25);
  } catch (err) {
    console.error("getArtistSongs error:", err);
    return [];
  }
}

export async function getArtistAlbums(idOrName, page = 1) {
  try {
    const isDigits = /^\d+$/.test(idOrName);
    let artistId = idOrName;

    if (!isDigits) {
      const sJson = await safeFetch(
        `${SAAVN_BASE}/search/artists?query=${encodeURIComponent(idOrName)}`
      );
      if (sJson?.data?.results?.[0]?.id) {
        artistId = sJson.data.results[0].id;
      }
    }

    const json = await safeFetch(
      `${SAAVN_BASE}/artists/${encodeURIComponent(artistId)}/albums?page=${page}`
    );
    return json?.data?.albums || json?.data || [];
  } catch (err) {
    console.error("getArtistAlbums error:", err);
    return [];
  }
}

export async function fetchHomePageData(language = "Hindi") {
  try {
    const lang = Array.isArray(language)
      ? language[0] || "Hindi"
      : language || "Hindi";
    const langLower = lang.toLowerCase();

    // Select editorial playlists and targeted search queries based on language
    let playlistIds = ["1134543272", "1302033575"]; // Hindi Superhits Top 50 & Romantic Hits
    let songQueries = [
      "bollywood hit songs 2026",
      "arijit singh hits",
      "latest hindi hits 2026",
    ];
    let albumQuery = "latest hindi 2026";

    if (langLower.includes("punjabi")) {
      playlistIds = ["4144832"];
      songQueries = [
        "punjabi hit songs 2026",
        "diljit dosanjh hits",
        "sidhu moose wala hits",
      ];
      albumQuery = "latest punjabi 2026";
    } else if (langLower.includes("english")) {
      playlistIds = [];
      songQueries = [
        "billboard hot 100 hits 2026",
        "global pop hits 2026",
        "top international hits",
      ];
      albumQuery = "latest english 2026";
    }

    const playlistPromises = playlistIds.map((id) =>
      safeFetch(`${SAAVN_BASE}/playlists?id=${id}`)
    );
    const songPromises = songQueries.map((q) =>
      safeFetch(
        `${SAAVN_BASE}/search/songs?query=${encodeURIComponent(q)}&limit=25`
      )
    );
    const albumPromise = safeFetch(
      `${SAAVN_BASE}/search/albums?query=${encodeURIComponent(albumQuery)}&limit=20`
    );

    const [plResults, songResults, albumResult] = await Promise.all([
      Promise.allSettled(playlistPromises),
      Promise.allSettled(songPromises),
      albumPromise,
    ]);

    const rawCandidates = [];
    for (const p of plResults) {
      if (p.status === "fulfilled" && p.value?.data?.songs) {
        rawCandidates.push(...p.value.data.songs);
      }
    }
    for (const s of songResults) {
      if (s.status === "fulfilled" && s.value?.data?.results) {
        rawCandidates.push(...s.value.data.results);
      }
    }

    // Strict deduplication & anti-repetition filter
    const seenImages = new Set();
    const seenTitles = new Set();
    const filteredSongs = [];

    for (const raw of rawCandidates) {
      if (!raw || !raw.id || !raw.name) continue;

      const title = decodeHtmlEntities(raw.name).trim();
      const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
      const albumTitle = decodeHtmlEntities(raw.album?.name || "").trim();
      const normAlbum = albumTitle.toLowerCase().replace(/[^a-z0-9]/g, "");

      // STRICT: Discard any "#Trending" / "HASHTAG TRENDING" compilation song
      if (
        normTitle.includes("trending") ||
        normAlbum.includes("trending") ||
        normAlbum.includes("hashtagtrending") ||
        title.toLowerCase() === "trending"
      ) {
        continue;
      }

      // Extract image URL
      const imgUrl = (
        raw.image?.[2]?.url ||
        raw.image?.[1]?.url ||
        raw.image?.[0]?.url ||
        (typeof raw.image === "string" ? raw.image : "")
      ).split("?")[0];

      // Discard placeholder or missing images
      if (!imgUrl || imgUrl.includes("placeholder") || imgUrl.includes("unsplash")) {
        continue;
      }

      // Strict uniqueness: No two songs can share the same thumbnail artwork or identical title
      if (seenImages.has(imgUrl) || seenTitles.has(normTitle)) {
        continue;
      }

      seenImages.add(imgUrl);
      seenTitles.add(normTitle);

      const formatted = formatSong(raw);
      if (formatted) {
        filteredSongs.push(formatted);
      }
    }

    // Albums formatting and deduplication
    const rawAlbums = albumResult?.data?.results || [];
    const seenAlbumImgs = new Set();
    const filteredAlbums = [];
    for (const alb of rawAlbums) {
      if (!alb || !alb.id || !alb.name) continue;
      const imgUrl = (
        alb.image?.[2]?.url ||
        alb.image?.[1]?.url ||
        alb.image?.[0]?.url ||
        ""
      ).split("?")[0];
      const normName = alb.name.toLowerCase().replace(/[^a-z0-9]/g, "");

      if (
        imgUrl &&
        !seenAlbumImgs.has(imgUrl) &&
        !normName.includes("trending")
      ) {
        seenAlbumImgs.add(imgUrl);
        filteredAlbums.push({
          ...alb,
          type: "album",
          title: decodeHtmlEntities(alb.name || alb.title),
          name: decodeHtmlEntities(alb.name || alb.title),
        });
      }
    }

    // Split songs: 8 for Quick Picks, remaining for Trending section
    const quickPicks = filteredSongs.slice(0, 8);
    const trendingSongs = filteredSongs.slice(8);

    return {
      quickPicks: quickPicks.length > 0 ? quickPicks : filteredSongs.slice(0, 8),
      trending: {
        songs: trendingSongs.length > 0 ? trendingSongs : filteredSongs,
        quickPicks: quickPicks.length > 0 ? quickPicks : filteredSongs.slice(0, 8),
        albums: filteredAlbums.slice(0, 10),
      },
      charts: TOP_FEATURED_PLAYLISTS,
      albums: filteredAlbums,
      playlists: TOP_FEATURED_PLAYLISTS,
    };
  } catch (err) {
    console.error("fetchHomePageData error:", err);
    return null;
  }
}

export async function fetchRecommendedSongs(artistId, songId) {
  try {
    if (songId) {
      const json = await safeFetch(`${SAAVN_BASE}/songs/${encodeURIComponent(songId)}/suggestions`);
      const list = json?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map(formatSong);
      }
    }

    const query = artistId ? `${artistId} hits` : "trending bollywood";
    return await searchSongs(query, 15);
  } catch (err) {
    console.error("fetchRecommendedSongs error:", err);
    return [];
  }
}
