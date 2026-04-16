import axios from 'axios';
import { YOUTUBE_API_KEY, YOUTUBE_API_BASE } from '../config/env';
import type { YouTubeVideo } from '../types/index';

export async function searchVideos(query: string): Promise<YouTubeVideo[]> {
  const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
    params: {
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: 8,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.data.items.map((item: any) => ({
    id: item.id.videoId,
    videoId: item.id.videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium.url,
    duration: '',
  }));
}
