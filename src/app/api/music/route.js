import { NextResponse } from "next/server";
import {
  searchAll,
  getSongDetails,
  getAlbumDetails,
  getPlaylistDetails,
  getArtistDetails,
  getArtistSongs,
  getArtistAlbums,
  fetchHomePageData,
  fetchRecommendedSongs,
} from "@/services/jiosaavn";

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
      const results = await searchAll(q);
      return NextResponse.json(results);
    }

    if (action === "home") {
      const lang = searchParams.get("lang") || "Hindi";
      const data = await fetchHomePageData(lang);
      return NextResponse.json(data);
    }

    if (action === "song") {
      const id = searchParams.get("id");
      if (!id) return NextResponse.json(null, { status: 400 });
      const song = await getSongDetails(id);
      return NextResponse.json(song);
    }

    if (action === "playlist") {
      const id = searchParams.get("id");
      if (!id) return NextResponse.json(null, { status: 400 });
      const pl = await getPlaylistDetails(id);
      return NextResponse.json(pl);
    }

    if (action === "album") {
      const id = searchParams.get("id");
      if (!id) return NextResponse.json(null, { status: 400 });
      const alb = await getAlbumDetails(id);
      return NextResponse.json(alb);
    }

    if (action === "artist") {
      const id = searchParams.get("id");
      if (!id) return NextResponse.json(null, { status: 400 });
      const data = await getArtistDetails(id);
      return NextResponse.json(data);
    }

    if (action === "artist-songs") {
      const id = searchParams.get("id");
      const page = searchParams.get("page") || 1;
      const songs = await getArtistSongs(id, page);
      return NextResponse.json(songs);
    }

    if (action === "artist-albums") {
      const id = searchParams.get("id");
      const page = searchParams.get("page") || 1;
      const albums = await getArtistAlbums(id, page);
      return NextResponse.json(albums);
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
