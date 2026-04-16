import express from 'express';
import cors from 'cors';
import musicRoutes from './routes/musicRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/music', musicRoutes);

// ── Error handler (must be last) ───────────────────────────────────────────
app.use(errorHandler);

// ── Start server (local only) ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🎵 Music Player API running on port ${PORT}`);
  });
}

export default app;
