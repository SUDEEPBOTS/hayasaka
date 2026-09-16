import {
  searchAll,
  searchSongs,
  getSongDetails,
  getAlbumDetails,
  getPlaylistDetails,
  getArtistDetails,
  getArtistSongs as fetchArtistSongs,
  getArtistAlbums as fetchArtistAlbums,
  fetchHomePageData,
  fetchRecommendedSongs,
} from "./jiosaavn";

const isBrowser = typeof window !== "undefined";

// home page data
export async function homePageData(language) {
  try {
    const lang = Array.isArray(language) ? language[0] || "Hindi" : (language || "Hindi");
    if (isBrowser) {
      const res = await fetch(`/api/music?action=home&lang=${encodeURIComponent(lang)}`);
      if (!res.ok) throw new Error("Failed to fetch home data");
      return await res.json();
    }
    return await fetchHomePageData(lang);
  } catch (error) {
    console.error("homePageData error:", error);
    return null;
  }
}

// get song data
export async function getSongData(id) {
  try {
    if (isBrowser) {
      const res = await fetch(`/api/music?action=song&id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error("Failed to fetch song data");
      return await res.json();
    }
    return await getSongDetails(id);
  } catch (error) {
    console.error("getSongData error:", error);
    return null;
  }
}

// get album data
export async function getAlbumData(id) {
  try {
    if (isBrowser) {
      const res = await fetch(`/api/music?action=album&id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error("Failed to fetch album data");
      return await res.json();
    }
    return await getAlbumDetails(id);
  } catch (error) {
    console.error("getAlbumData error:", error);
    return null;
  }
}

// get playlist data
export async function getplaylistData(id) {
  try {
    if (isBrowser) {
      const res = await fetch(`/api/music?action=playlist&id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error("Failed to fetch playlist data");
      return await res.json();
    }
    return await getPlaylistDetails(id);
  } catch (error) {
    console.error("getplaylistData error:", error);
    return null;
  }
}

// get Lyrics data
export async function getlyricsData(lyricsId) {
  return null;
}

// get artist data
export async function getArtistData(id) {
  try {
    if (isBrowser) {
      const res = await fetch(`/api/music?action=artist&id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error("Failed to fetch artist data");
      return await res.json();
    }
    return await getArtistDetails(id);
  } catch (error) {
    console.error("getArtistData error:", error);
    return null;
  }
}

// get artist songs
export async function getArtistSongs(id, page = 1) {
  try {
    if (isBrowser) {
      const res = await fetch(`/api/music?action=artist-songs&id=${encodeURIComponent(id)}&page=${page}`);
      if (!res.ok) return [];
      return await res.json();
    }
    return await fetchArtistSongs(id, page);
  } catch (error) {
    console.error("getArtistSongs error:", error);
    return [];
  }
}

// get artist albums
export async function getArtistAlbums(id, page = 1) {
  try {
    if (isBrowser) {
      const res = await fetch(`/api/music?action=artist-albums&id=${encodeURIComponent(id)}&page=${page}`);
      if (!res.ok) return [];
      return await res.json();
    }
    return await fetchArtistAlbums(id, page);
  } catch (error) {
    console.error("getArtistAlbums error:", error);
    return [];
  }
}

// get search data
export async function getSearchedData(query) {
  try {
    if (isBrowser) {
      const res = await fetch(`/api/music?action=search&q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch search data");
      return await res.json();
    }
    return await searchAll(query);
  } catch (error) {
    console.error("getSearchedData error:", error);
    return null;
  }
}

// add and remove from favourite
export async function addFavourite(id) {
  try {
    const response = await fetch("/api/favourite", {
      method: "POST",
      body: JSON.stringify(id),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Add favourite API error", error);
    return null;
  }
}

// get favourite
export async function getFavourite() {
  try {
    const response = await fetch("/api/favourite");
    if (!response.ok) return null;
    const data = await response.json();
    return data?.data?.favourites;
  } catch (error) {
    console.error("Get favourite API error", error);
    return null;
  }
}

// user info
export async function getUserInfo() {
  try {
    const response = await fetch("/api/userInfo");
    if (!response.ok) return null;
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Get user info API error", error);
    return null;
  }
}

// reset password
export async function resetPassword(password, confirmPassword, token) {
  try {
    const response = await fetch("/api/forgotPassword", {
      method: "PUT",
      body: JSON.stringify({ password, confirmPassword, token }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Reset password API error", error);
    return null;
  }
}

// send reset password link
export async function sendResetPasswordLink(email) {
  try {
    const response = await fetch("/api/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Send reset password link API error", error);
    return null;
  }
}

// get recommended songs
export async function getRecommendedSongs(artistId, songId) {
  try {
    if (isBrowser) {
      const res = await fetch(`/api/music?action=recommendations&artistId=${encodeURIComponent(artistId || "")}&songId=${encodeURIComponent(songId || "")}`);
      if (!res.ok) return [];
      return await res.json();
    }
    return await fetchRecommendedSongs(artistId, songId);
  } catch (error) {
    console.error("getRecommendedSongs error:", error);
    return [];
  }
}
