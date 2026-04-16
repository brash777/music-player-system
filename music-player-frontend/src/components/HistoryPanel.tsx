import type { Song } from '../types/index';

interface HistoryPanelProps {
  history: Song[];
}

export default function HistoryPanel({ history }: HistoryPanelProps) {
  const recent = history.slice(0, 10);

  return (
    <div
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <h3 style={{ color: '#fff', margin: '0 0 14px 0', fontSize: '16px', fontWeight: 'bold' }}>
        Recently Played 🕐
      </h3>

      {recent.length === 0 ? (
        <p style={{ color: '#888', fontSize: '14px', margin: 0, textAlign: 'center', padding: '12px 0' }}>
          No songs played yet
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {recent.map((song, index) => (
            <div
              key={`${song.id}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                backgroundColor: '#121212',
              }}
            >
              <span style={{ color: '#555', fontSize: '11px', minWidth: '16px' }}>
                {index + 1}
              </span>
              <div style={{ overflow: 'hidden' }}>
                <span
                  style={{
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                >
                  {song.title}
                </span>
                <span
                  style={{
                    color: '#888',
                    fontSize: '11px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                >
                  {song.artist}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
