import { Song } from '../models/Song';

export interface CreateSongDTO {
  title: string;
  artist: string;
  duration: number;
}

export interface SongResponseDTO {
  id: string;
  title: string;
  artist: string;
  duration: number;
  durationFormatted: string;
  createdAt: Date;
}

export function toSongResponseDTO(song: Song): SongResponseDTO {
  const minutes = Math.floor(song.duration / 60);
  const seconds = song.duration % 60;
  const durationFormatted = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    duration: song.duration,
    durationFormatted,
    createdAt: song.createdAt,
  };
}
