import { Song } from '../models/Song';
import { DoublyLinkedList } from '../structures/DoublyLinkedList';

export class PlaylistService {
  private playlist: DoublyLinkedList<Song> = new DoublyLinkedList<Song>();

  addSong(song: Song, position: 'first' | 'last' | number): void {
    if (position === 'first') {
      this.playlist.addFirst(song);
    } else if (position === 'last') {
      this.playlist.addLast(song);
    } else {
      this.playlist.insertAt(song, position);
    }
  }

  removeSong(id: string): boolean {
    return this.playlist.deleteById(id);
  }

  nextSong(): Song | null {
    return this.playlist.next();
  }

  previousSong(): Song | null {
    return this.playlist.prev();
  }

  getCurrentSong(): Song | null {
    return this.playlist.getCurrent();
  }

  setCurrentSong(id: string): boolean {
    return this.playlist.setCurrent(id);
  }

  getPlaylist(): Song[] {
    return this.playlist.toArray();
  }

  getSize(): number {
    return this.playlist.getSize();
  }
}
