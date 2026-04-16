import { SongService } from '../services/SongService';
import { PlaylistService } from '../services/PlaylistService';
import { PlayerService } from '../services/PlayerService';
import { HistoryService } from '../services/HistoryService';
import { CreateSongDTO, SongResponseDTO, toSongResponseDTO } from '../dtos/SongDTO';

export class MusicPlayerFacade {
  private songService: SongService = new SongService();
  private playlistService: PlaylistService = new PlaylistService();
  private playerService: PlayerService = new PlayerService();
  private historyService: HistoryService = new HistoryService();

  // 1. Add a song to the map and the playlist
  addSong(dto: CreateSongDTO, position: 'first' | 'last' | number = 'last'): SongResponseDTO {
    const song = this.songService.addSong(dto, position);
    this.playlistService.addSong(song, position);
    return toSongResponseDTO(song);
  }

  // 2. Remove a song from both the map and the playlist
  removeSong(id: string): { success: boolean; message: string } {
    const deletedFromMap = this.songService.deleteSong(id);
    if (!deletedFromMap) {
      return { success: false, message: 'Song not found' };
    }
    this.playlistService.removeSong(id);
    return { success: true, message: 'Song removed successfully' };
  }

  // 3. Play the current song (or advance to next if none is set)
  play(): { status: string; song: SongResponseDTO | null } {
    let song = this.playlistService.getCurrentSong();

    if (song === null) {
      song = this.playlistService.nextSong();
    }

    if (song === null) {
      throw new Error('Playlist is empty');
    }

    const result = this.playerService.play(song);
    this.historyService.addToHistory(song);

    return {
      status: result.status,
      song: toSongResponseDTO(result.song),
    };
  }

  // 4. Pause playback — PlayerService validates the state
  pause(): { status: string } {
    const result = this.playerService.pause();
    return { status: result.status };
  }

  // 5. Stop playback — logs current song before stopping
  stop(): { status: string } {
    const currentSong = this.playlistService.getCurrentSong();
    const result = this.playerService.stop();

    if (currentSong !== null) {
      console.log(`Stopped playback of: "${currentSong.title}" by ${currentSong.artist}`);
    }

    return { status: result.status };
  }

  // 6. Advance to the next song in the playlist
  next(): { status: string; song: SongResponseDTO | null } {
    if (this.playlistService.getSize() === 0) {
      return { status: 'STOPPED', song: null };
    }

    const song = this.playlistService.nextSong();

    if (song === null) {
      return { status: 'STOPPED', song: null };
    }

    const result = this.playerService.play(song);
    this.historyService.addToHistory(song);

    return {
      status: result.status,
      song: toSongResponseDTO(result.song),
    };
  }

  // 7. Go back to the previous song in the playlist
  previous(): { status: string; song: SongResponseDTO | null } {
    const song = this.playlistService.previousSong();

    if (song === null) {
      return { status: 'STOPPED', song: null };
    }

    const result = this.playerService.play(song);

    return {
      status: result.status,
      song: toSongResponseDTO(result.song),
    };
  }

  // 8. Get the currently active song
  getCurrentSong(): SongResponseDTO | null {
    const currentSongId = this.playerService.getCurrentSongId();
    const playlistCurrent = this.playlistService.getCurrentSong();

    // Prefer the player's tracked song id for accuracy
    if (currentSongId !== null) {
      const song = this.songService.getSongById(currentSongId);
      return song ? toSongResponseDTO(song) : null;
    }

    return playlistCurrent ? toSongResponseDTO(playlistCurrent) : null;
  }

  // 9. Get all songs in playlist order
  getPlaylist(): SongResponseDTO[] {
    const songs = this.playlistService.getPlaylist();

    // Cross-validate with SongService to ensure only persisted songs are returned
    return songs
      .filter(song => this.songService.getSongById(song.id) !== null)
      .map(toSongResponseDTO);
  }

  // 10. Get playback history as response DTOs
  getHistory(): SongResponseDTO[] {
    return this.historyService.getHistory().map(toSongResponseDTO);
  }
}

export const musicPlayerFacade = new MusicPlayerFacade();
