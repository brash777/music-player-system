import { Song } from '../models/Song';

export type PlayerStatus = 'PLAYING' | 'PAUSED' | 'STOPPED';

export class PlayerService {
  private status: PlayerStatus = 'STOPPED';
  private currentSongId: string | null = null;

  play(song: Song): { status: PlayerStatus; song: Song } {
    this.status = 'PLAYING';
    this.currentSongId = song.id;
    return { status: this.status, song };
  }

  pause(): { status: PlayerStatus } {
    if (this.status !== 'PLAYING') {
      throw new Error('No song is currently playing');
    }
    this.status = 'PAUSED';
    return { status: this.status };
  }

  stop(): { status: PlayerStatus } {
    this.status = 'STOPPED';
    this.currentSongId = null;
    return { status: this.status };
  }

  getStatus(): PlayerStatus {
    return this.status;
  }

  getCurrentSongId(): string | null {
    return this.currentSongId;
  }
}
