import type { Song } from '../types/index';

interface CurrentSongProps {
  currentSong: Song | null;
  playerStatus: string;
}

const statusColors: Record<string, string> = {
  PLAYING: '#1DB954',
  PAUSED: '#f5a623',
  STOPPED: '#888888',
};

export default function CurrentSong({ currentSong, playerStatus }: CurrentSongProps) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#1a1a2e',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    minHeight: '280px',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  };

  if (!currentSong) {
    return (
      <div style={cardStyle}>
        <div style={{ fontSize: '48px' }}>🎵</div>
        <p style={{ color: '#888', fontSize: '16px', margin: 0 }}>No song selected</p>
      </div>
    );
  }

  const badgeColor = statusColors[playerStatus] ?? '#888888';

  return (
    <div style={cardStyle}>
      {/* Album art placeholder */}
      <div
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1DB954 0%, #0d7a3a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '56px',
          boxShadow: '0 4px 20px rgba(29,185,84,0.3)',
          flexShrink: 0,
        }}
      >
        🎵
      </div>

      {/* Song info */}
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 4px 0',
            maxWidth: '260px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {currentSong.title}
        </h2>
        <p style={{ color: '#b3b3b3', fontSize: '14px', margin: '0 0 8px 0' }}>
          {currentSong.artist}
        </p>
        <p style={{ color: '#888', fontSize: '13px', margin: '0 0 12px 0' }}>
          {currentSong.durationFormatted}
        </p>
      </div>

      {/* Status badge */}
      <span
        style={{
          backgroundColor: badgeColor,
          color: '#fff',
          fontSize: '11px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          padding: '4px 12px',
          borderRadius: '20px',
          textTransform: 'uppercase' as const,
        }}
      >
        {playerStatus}
      </span>
    </div>
  );
}
