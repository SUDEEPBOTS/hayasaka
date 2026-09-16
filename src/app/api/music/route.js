import { NextResponse } from "next/server";
import {
  searchYouTubeSongs,
  getYouTubeSongDetails,
  getYouTubePlaylistDetails,
  fetchHomePageData,
  fetchArtistData,
  fetchRecommendedSongs,
  formatPlaylistItem,
  FEATURED_PLAYLISTS,
} from "@/services/youtube";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "home";

    if (action === "search") {
      const q = searchParams.get("q") || "";
      if (!q.trim()) {
        return NextResponse.json({
          topQuery: { results: [] },
          songs: { results: [] },
          albums: { results: [] },
          playlists: { results: [] },
        });
      }
      const songs = await searchYouTubeSongs(q, 30);
      const topSong = songs[0] || null;
      return NextResponse.json({
        topQuery: {
          results: topSong ? [topSong] : [],
        },
        songs: {
          results: songs,
        },
        albums: {
          results: songs.slice(0, 10),
        },
        playlists: {
          results: FEATURED_PLAYLISTS.map(formatPlaylistItem),
        },
      });
    }

    if (action === "home") {
      const lang = searchParams.get("lang") || "Hindi";
      const data = await fetchHomePageData(lang);
      return NextResponse.json(data);
    }

    if (action === "song") {
      const id = searchParams.get("id");
      if (!id) return NextResponse.json(null, { status: 400 });
      const song = await getYouTubeSongDetails(id);
      return NextResponse.json(song ? [song] : null);
    }

    if (action === "playlist") {
      const id = searchParams.get("id");
      if (!id) return NextResponse.json(null, { status: 400 });
      const pl = await getYouTubePlaylistDetails(id);
      return NextResponse.json(pl);
    }

    if (action === "album") {
      const id = searchParams.get("id");
      if (!id) return NextResponse.json(null, { status: 400 });
      const pl = await getYouTubePlaylistDetails(id);
      return NextResponse.json({
        id: pl.id,
        name: pl.name,
        title: pl.title,
        description: pl.description,
        image: pl.image,
        artists: { primary: [{ id: "Various", name: "Various Artists" }] },
        songs: pl.songs,
      });
    }

    if (action === "artist") {
      const id = searchParams.get("id");
      if (!id) return NextResponse.json(null, { status: 400 });
      const data = await fetchArtistData(id);
      return NextResponse.json(data);
    }

    if (action === "recommendations") {
      const artistId = searchParams.get("artistId") || "";
      const songId = searchParams.get("songId") || "";
      const songs = await fetchRecommendedSongs(artistId, songId);
      return NextResponse.json(songs);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("API /api/music error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
