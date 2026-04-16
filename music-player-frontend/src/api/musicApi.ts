import axios from 'axios';
import type { Song, PlayerState, AddSongPayload } from '../types/index';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/music',
});

export async function getSongs(): Promise<Song[]> {
  try {
    const response = await api.get('/playlist');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getCurrentSong(): Promise<Song | null> {
  try {
    const response = await api.get('/current');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function addSong(payload: AddSongPayload): Promise<Song> {
  try {
    const response = await api.post('/song', payload);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function removeSong(id: string): Promise<void> {
  try {
    await api.delete(`/song/${id}`);
  } catch (error) {
    throw error;
  }
}

export async function play(): Promise<PlayerState> {
  try {
    const response = await api.post('/play');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function pause(): Promise<{ status: string }> {
  try {
    const response = await api.post('/pause');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function stop(): Promise<{ status: string }> {
  try {
    const response = await api.post('/stop');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function nextSong(): Promise<PlayerState> {
  try {
    const response = await api.post('/next');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function previousSong(): Promise<PlayerState> {
  try {
    const response = await api.post('/previous');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getHistory(): Promise<Song[]> {
  try {
    const response = await api.get('/history');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
