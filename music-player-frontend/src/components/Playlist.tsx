import { useState } from 'react';
import type { Song } from '../types/index';

interface PlaylistProps {
  playlist: Song[];
  currentSong: Song | null;
  onRemoveSong: (id: string) => void;
}

interface RowProps {
  song: Song;
  index: number;
  isActive: boolean;
  onRemove: (id: string) => void;
}

function PlaylistRow({ song, index, isActive, onRemove }: RowProps) {
  const [hovered, setHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: hovered ? '#1e1e1e' : '#121212',
    borderLeft: isActive ? '3px solid #1DB954' : '3px solid transparent',
    transition: 'background-color 0.15s ease',
    cursor: 'default',
  };

  return (
    <div
      style={rowStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Row number */}
      <span style={{ color: '#888', fontSize: '13px', minWidth: '20px', textAlign: 'right' }}>
        {index + 1}
      </span>

      {/* Title + Artist */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <p
          style={{
            margin: 0,
            color: isActive ? '#1DB954' : '#fff',
            fontWeight: 'bold',
            fontSize: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {song.title}
        </p>
        <p
          style={{
            margin: 0,
            color: '#888',
            fontSize: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {song.artist}
        </p>
      </div>

      {/* Duration */}
      <span style={{ color: '#888', fontSize: '13px', flexShrink: 0 }}>
        {song.durationFormatted}
      </span>

      {/* Delete button */}
      <button
        onClick={() => onRemove(song.id)}
        onMouseEnter={() => setDeleteHovered(true)}
        onMouseLeave={() => setDeleteHovered(false)}
        title="Remove song"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '4px',
          borderRadius: '4px',
          opacity: deleteHovered ? 1 : 0.5,
          transition: 'opacity 0.15s ease',
          flexShrink: 0,
          color: deleteHovered ? '#ff4d4d' : '#fff',
        }}
      >
        🗑
      </button>
    </div>
  );
}

export default function Playlist({ playlist, currentSong, onRemoveSong }: PlaylistProps) {
  return (
    <div
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
        🎶 Playlist{' '}
        <span style={{ color: '#888', fontWeight: 'normal', fontSize: '13px' }}>
          ({playlist.length} songs)
        </span>
      </h3>

      {playlist.length === 0 ? (
        <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', padding: '24px 0', margin: 0 }}>
          Your playlist is empty. Add some songs!
        </p>
      ) : (
        <div
          style={{
            maxHeight: '320px',
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            paddingRight: '4px',
          }}
        >
          {playlist.map((song, index) => (
            <PlaylistRow
              key={song.id}
              song={song}
              index={index}
              isActive={currentSong?.id === song.id}
              onRemove={onRemoveSong}
            />
          ))}
        </div>
      )}
    </div>
  );
}
