import { Request, Response, NextFunction } from 'express';
import { musicPlayerFacade } from '../facade/MusicPlayerFacade';

export class MusicController {
  static async addSong(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, artist, duration, position = 'last' } = req.body;
      const result = musicPlayerFacade.addSong({ title, artist, duration }, position);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async removeSong(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = musicPlayerFacade.removeSong(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getPlaylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlist = musicPlayerFacade.getPlaylist();
      res.status(200).json({ success: true, data: playlist, count: playlist.length });
    } catch (err) {
      next(err);
    }
  }

  static async getCurrentSong(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const song = musicPlayerFacade.getCurrentSong();
      res.status(200).json({ success: true, data: song });
    } catch (err) {
      next(err);
    }
  }

  static async play(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = musicPlayerFacade.play();
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async pause(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = musicPlayerFacade.pause();
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async stop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = musicPlayerFacade.stop();
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async next(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = musicPlayerFacade.next();
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async previous(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = musicPlayerFacade.previous();
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = musicPlayerFacade.getHistory();
      res.status(200).json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }
}
