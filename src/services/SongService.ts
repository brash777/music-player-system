import { v4 as uuidv4 } from 'uuid';
import { Song } from '../models/Song';
import { CreateSongDTO } from '../dtos/SongDTO';

export class SongService {
  private songs: Map<string, Song> = new Map();

  addSong(dto: CreateSongDTO, position: 'first' | 'last' | number): Song {
    if (!dto.title || dto.title.trim() === '') {
      throw new Error('Title must not be empty');
    }
    if (!dto.artist || dto.artist.trim() === '') {
      throw new Error('Artist must not be empty');
    }
    if (dto.duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    this.validateNoDuplicate(dto.title, dto.artist);

    const song: Song = {
      id: uuidv4(),
      title: dto.title.trim(),
      artist: dto.artist.trim(),
      duration: dto.duration,
      createdAt: new Date(),
    };

    this.songs.set(song.id, song);
    return song;
  }

  deleteSong(id: string): boolean {
    if (!this.songs.has(id)) return false;
    this.songs.delete(id);
    return true;
  }

  getAllSongs(): Song[] {
    return Array.from(this.songs.values());
  }

  getSongById(id: string): Song | null {
    return this.songs.get(id) ?? null;
  }

  validateNoDuplicate(title: string, artist: string): void {
    const normalizedTitle = title.trim().toLowerCase();
    const normalizedArtist = artist.trim().toLowerCase();

    for (const song of this.songs.values()) {
      if (
        song.title.toLowerCase() === normalizedTitle &&
        song.artist.toLowerCase() === normalizedArtist
      ) {
        throw new Error('Song already exists in playlist');
      }
    }
  }
}
