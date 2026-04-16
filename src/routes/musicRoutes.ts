import { Router } from 'express';
import { MusicController } from '../controllers/MusicController';

const router = Router();

// Song management
router.post('/song', MusicController.addSong);
router.delete('/song/:id', MusicController.removeSong);

// Playlist & state
router.get('/playlist', MusicController.getPlaylist);
router.get('/current', MusicController.getCurrentSong);
router.get('/history', MusicController.getHistory);

// Playback controls
router.post('/play', MusicController.play);
router.post('/pause', MusicController.pause);
router.post('/stop', MusicController.stop);
router.post('/next', MusicController.next);
router.post('/previous', MusicController.previous);

export default router;
