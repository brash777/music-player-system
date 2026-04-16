import { useState } from 'react';

interface PlayerControlsProps {
  playerStatus: string;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  isMain?: boolean;
  title?: string;
}

function ControlButton({ onClick, children, isMain = false, title }: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = isMain
    ? {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: hovered ? '#1ed760' : '#1DB954',
        border: 'none',
        cursor: 'pointer',
        fontSize: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        transition: 'background-color 0.15s ease, transform 0.1s ease',
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
        boxShadow: '0 4px 14px rgba(29,185,84,0.4)',
        flexShrink: 0,
      }
    : {
        width: '44px',
        height: '44px',
        borderRadius: '22px',
        backgroundColor: hovered ? '#3a3a3a' : '#282828',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        transition: 'background-color 0.15s ease, opacity 0.15s ease',
        opacity: hovered ? 1 : 0.85,
        flexShrink: 0,
      };

  return (
    <button
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={title}
    >
      {children}
    </button>
  );
}

export default function PlayerControls({
  playerStatus,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
}: PlayerControlsProps) {
  const isPlaying = playerStatus === 'PLAYING';

  return (
    <div
      style={{
        backgroundColor: '#282828',
        borderRadius: '16px',
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      <ControlButton onClick={onPrevious} title="Previous">
        ⏮
      </ControlButton>

      <ControlButton onClick={isPlaying ? onPause : onPlay} isMain title={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '⏸' : '▶'}
      </ControlButton>

      <ControlButton onClick={onStop} title="Stop">
        ⏹
      </ControlButton>

      <ControlButton onClick={onNext} title="Next">
        ⏭
      </ControlButton>
    </div>
  );
}
