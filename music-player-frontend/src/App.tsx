import { useEffect } from 'react';
import './App.css';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import SearchBar from './components/SearchBar';
import PlayerControls from './components/PlayerControls';
import Playlist from './components/Playlist';
import AddSongForm from './components/AddSongForm';
import CurrentSong from './components/CurrentSong';
import HistoryPanel from './components/HistoryPanel';

export default function App() {
  const {
    playlist,
    currentSong,
    playerStatus,
    history,
    isLoading,
    error,
    clearError,
    currentVideoId,
    handleAddSong,
    handleRemoveSong,
    handleNext,
    handlePrevious,
    handleSelectYouTubeVideo,
    handleYouTubePlay,
    handleYouTubePause,
    handleYouTubeStop,
  } = useMusicPlayer();

  // Auto-dismiss error toast after 3 seconds
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => clearError(), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  return (
    <div className="app-wrapper">
      {/* ERROR TOAST */}
      {error && (
        <div
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            background: '#fc3c44',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 8,
            zIndex: 999,
            fontSize: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* LOADING SPINNER */}
      {isLoading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}

      <div className="app-main">
        {/* ── LEFT SIDEBAR ── */}
        <div className="sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span style={{ fontSize: 22 }}>🎵</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>Music Player</span>
          </div>

          <SearchBar onSelectVideo={handleSelectYouTubeVideo} />
          <AddSongForm onAddSong={handleAddSong} />
        </div>

        {/* ── MAIN PANEL ── */}
        <div className="main-panel">
          <h2 className="section-title">
            Playlist
            <span style={{ fontSize: 14, fontWeight: 400, color: '#a0a0a0', marginLeft: 8 }}>
              {playlist.length} songs
            </span>
          </h2>
          <Playlist
            playlist={playlist}
            currentSong={currentSong}
            onRemoveSong={handleRemoveSong}
          />
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          {currentVideoId ? (
            <div className="card">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ borderRadius: '12px', border: 'none', display: 'block' }}
                title="YouTube video player"
              />
              {currentSong && (
                <div style={{ marginTop: 12 }}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#fff',
                      margin: '0 0 4px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentSong.title}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: '#a0a0a0',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentSong.artist}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <CurrentSong currentSong={currentSong} playerStatus={playerStatus} />
          )}
          <HistoryPanel history={history} />
        </div>
      </div>

      {/* ── BOTTOM PLAYER BAR ── */}
      <div className="player-bar">
        <div className="now-playing">
          <div className="now-playing-thumb">{currentSong ? '🎵' : ''}</div>
          <div className="now-playing-info">
            {currentSong ? (
              <>
                <h4>{currentSong.title}</h4>
                <p>{currentSong.artist}</p>
              </>
            ) : (
              <p style={{ color: '#606060' }}>Select a song to play</p>
            )}
          </div>
        </div>

        <div className="controls-center">
          <PlayerControls
            playerStatus={playerStatus}
            onPlay={handleYouTubePlay}
            onPause={handleYouTubePause}
            onStop={handleYouTubeStop}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>

        <div style={{ flex: 1, textAlign: 'right', color: '#606060', fontSize: 13 }}>
          {currentSong?.durationFormatted ?? ''}
        </div>
      </div>
    </div>
  );
}
