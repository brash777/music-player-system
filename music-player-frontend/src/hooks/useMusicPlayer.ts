import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  getSongs,
  getCurrentSong,
  getHistory,
  addSong,
  removeSong,
  play,
  pause,
  stop,
  nextSong,
  previousSong,
} from '../api/musicApi';
import type { Song, AddSongPayload, YouTubeVideo } from '../types/index';

/** Extracts a readable message from an axios or generic error. */
function extractError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    // Use the backend's message field if present, otherwise the HTTP status text
    const serverMsg = err.response?.data?.message ?? err.response?.data?.error;
    if (serverMsg) return String(serverMsg);
    if (err.response) return `Server error ${err.response.status}: ${err.response.statusText}`;
    if (err.request) return 'Cannot reach the server. Is the backend running?';
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useMusicPlayer() {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playerStatus, setPlayerStatus] = useState<'PLAYING' | 'PAUSED' | 'STOPPED'>('STOPPED');
  const [history, setHistory] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // YouTube-specific state
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string | null>(null);
  const [currentVideoArtist, setCurrentVideoArtist] = useState<string | null>(null);
  const [isYouTubePlaying, setIsYouTubePlaying] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);

  async function fetchPlaylist(): Promise<void> {
    try {
      const songs = await getSongs();
      setPlaylist(songs);
    } catch {
      // Silent — backend may not be running yet
    }
  }

  async function fetchCurrentSong(): Promise<void> {
    try {
      const song = await getCurrentSong();
      setCurrentSong(song);
    } catch {
      // Silent — backend may not be running yet
    }
  }

  async function fetchHistory(): Promise<void> {
    try {
      const songs = await getHistory();
      setHistory(songs);
    } catch {
      // Silent — backend may not be running yet
    }
  }

  async function handleAddSong(payload: AddSongPayload): Promise<void> {
    setIsLoading(true);
    try {
      await addSong(payload);
      await fetchPlaylist();
    } catch (err) {
      setError(extractError(err, 'Failed to add song'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveSong(id: string): Promise<void> {
    setIsLoading(true);
    try {
      await removeSong(id);
      await fetchPlaylist();
      if (currentSong?.id === id) {
        setCurrentSong(null);
      }
    } catch (err) {
      setError(extractError(err, 'Failed to remove song'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlay(): Promise<void> {
    setIsLoading(true);
    try {
      const state = await play();
      setCurrentSong(state.song);
      setPlayerStatus(state.status);
      await fetchHistory();
    } catch (err) {
      setError(extractError(err, 'Failed to play'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePause(): Promise<void> {
    setIsLoading(true);
    try {
      await pause();
      setPlayerStatus('PAUSED');
    } catch (err) {
      setError(extractError(err, 'Failed to pause'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStop(): Promise<void> {
    setIsLoading(true);
    try {
      await stop();
      setPlayerStatus('STOPPED');
    } catch (err) {
      setError(extractError(err, 'Failed to stop'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNext(): Promise<void> {
    setIsLoading(true);
    try {
      const state = await nextSong();
      setCurrentSong(state.song);
      setPlayerStatus(state.status);
      await fetchHistory();
    } catch (err) {
      setError(extractError(err, 'Failed to skip to next song'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePrevious(): Promise<void> {
    setIsLoading(true);
    try {
      const state = await previousSong();
      setCurrentSong(state.song);
      setPlayerStatus(state.status);
    } catch (err) {
      setError(extractError(err, 'Failed to go to previous song'));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaylist();
    fetchCurrentSong();
    fetchHistory();
  }, []);

  function clearError(): void {
    setError(null);
  }

  // ── YouTube handlers ────────────────────────────────────────────────────────

  async function handleSelectYouTubeVideo(video: YouTubeVideo): Promise<void> {
    setIsLoading(true);
    try {
      await addSong({
        title: video.title,
        artist: video.artist,
        duration: 1,
        position: 'last',
      });
      setCurrentVideoId(video.videoId);
      setCurrentVideoTitle(video.title);
      setCurrentVideoArtist(video.artist);
      setPlayerStatus('PLAYING');
      setIsYouTubePlaying(true);
      await fetchPlaylist();
    } catch (err) {
      setError(extractError(err, 'Failed to load YouTube video'));
    } finally {
      setIsLoading(false);
    }
  }

  function handleYouTubePlay(): void {
    setIsYouTubePlaying(true);
    setPlayerStatus('PLAYING');
  }

  function handleYouTubePause(): void {
    setIsYouTubePlaying(false);
    setPlayerStatus('PAUSED');
  }

  function handleYouTubeStop(): void {
    setIsYouTubePlaying(false);
    setCurrentVideoId(null);
    setCurrentVideoTitle(null);
    setCurrentVideoArtist(null);
    setPlayerStatus('STOPPED');
  }

  async function handleYouTubeNext(): Promise<void> {
    await handleNext();
    setIsYouTubePlaying(false);
    setCurrentVideoId(null);
  }

  function handleYouTubeEnded(): void {
    setIsYouTubePlaying(false);
    handleNext();
  }

  return {
    // State
    playlist,
    currentSong,
    playerStatus,
    history,
    isLoading,
    error,
    clearError,
    // YouTube state
    currentVideoId,
    currentVideoTitle,
    currentVideoArtist,
    isYouTubePlaying,
    searchResults,
    setSearchResults,
    // Handlers
    handleAddSong,
    handleRemoveSong,
    handlePlay,
    handlePause,
    handleStop,
    handleNext,
    handlePrevious,
    // YouTube handlers
    handleSelectYouTubeVideo,
    handleYouTubePlay,
    handleYouTubePause,
    handleYouTubeStop,
    handleYouTubeNext,
    handleYouTubeEnded,
    // Fetchers (exposed in case components need to refresh manually)
    fetchPlaylist,
    fetchCurrentSong,
    fetchHistory,
  };
}
