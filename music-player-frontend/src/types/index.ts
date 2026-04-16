export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  durationFormatted: string;
  createdAt: string;
}

export interface PlayerState {
  status: 'PLAYING' | 'PAUSED' | 'STOPPED';
  song: Song | null;
}

export interface PlaylistResponse {
  success: boolean;
  data: Song[];
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export type AddPosition = 'first' | 'last' | number;

export interface AddSongPayload {
  title: string;
  artist: string;
  duration: number;
  position?: AddPosition;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

export interface SearchState {
  query: string;
  results: YouTubeVideo[];
  isSearching: boolean;
  error: string | null;
}
