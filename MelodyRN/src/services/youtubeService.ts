import { Song } from '../types/music';

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
  error?: {
    message: string;
  };
}

/**
 * Search YouTube Data API v3 for music tracks
 */
export async function searchYouTubeVideos(
  query: string,
  apiKey: string
): Promise<Song[]> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Please configure your YouTube Data API Key in Settings.');
  }

  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=25&q=${encodeURIComponent(
    query
  )}&key=${apiKey.trim()}`;

  const response = await fetch(endpoint);
  const data: YouTubeSearchResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'YouTube API search error.');
  }

  if (!data.items) {
    return [];
  }

  return data.items.map((item, index) => {
    const videoId = item.id.videoId;
    const rawTitle = item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    const artwork =
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default?.url ||
      null;

    return {
      id: `yt_${videoId}`,
      title: rawTitle,
      artist: item.snippet.channelTitle || 'YouTube Music',
      album: 'YouTube Stream',
      duration: 210, // Default estimate until stream metadata resolves
      artwork,
      uri: `https://www.youtube.com/watch?v=${videoId}`,
      isOnline: true,
      youtubeId: videoId,
      colorPalette: index % 2 === 0 ? ['#8B5CF6', '#D946EF'] : ['#6366F1', '#8B5CF6'],
    };
  });
}

/**
 * Resolve audio stream url for YouTube video using Piped / Invidious API
 */
export async function resolveYouTubeAudioStream(
  videoId: string
): Promise<string | null> {
  const instances = [
    `https://pipedapi.kavin.rocks/streams/${videoId}`,
    `https://api.piped.privacydev.net/streams/${videoId}`,
    `https://invidious.nerdvpn.de/api/v1/videos/${videoId}`,
  ];

  for (const url of instances) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();

      // Piped format
      if (data.audioStreams && data.audioStreams.length > 0) {
        // Pick best quality audio stream
        const sorted = data.audioStreams.sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));
        return sorted[0].url;
      }

      // Invidious format
      if (data.adaptiveFormats && data.adaptiveFormats.length > 0) {
        const audioFormat = data.adaptiveFormats.find((f: any) => f.type && f.type.startsWith('audio'));
        if (audioFormat && audioFormat.url) {
          return audioFormat.url;
        }
      }
    } catch {
      // try next instance
    }
  }

  // Fallback direct stream link
  return `https://www.youtube.com/watch?v=${videoId}`;
}
