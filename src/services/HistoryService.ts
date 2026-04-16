import { Song } from '../models/Song';

const MAX_HISTORY = 50;

export class HistoryService {
  private history: Song[] = [];

  addToHistory(song: Song): void {
    this.history.unshift(song);
    if (this.history.length > MAX_HISTORY) {
      this.history = this.history.slice(0, MAX_HISTORY);
    }
  }

  getHistory(): Song[] {
    return this.history;
  }

  clearHistory(): void {
    this.history = [];
  }
}
