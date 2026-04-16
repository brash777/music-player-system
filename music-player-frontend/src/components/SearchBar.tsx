import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { searchVideos } from '../api/youtubeApi';
import type { YouTubeVideo } from '../types/index';

interface SearchBarProps {
  onSelectVideo: (video: YouTubeVideo) => void;
}

export default function SearchBar({ onSelectVideo }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setError(null);
    setShowResults(false);

    try {
      const videos = await searchVideos(trimmed);
      setResults(videos);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  function handleSelect(video: YouTubeVideo) {
    onSelectVideo(video);
    setShowResults(false);
    setResults([]);
    setQuery('');
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Search input wrapper */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Left icon: spinner or search */}
        <span
          style={{
            position: 'absolute',
            left: '14px',
            fontSize: '16px',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isSearching ? (
            <span
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid #555',
                borderTopColor: '#1DB954',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'yt-spin 0.7s linear infinite',
              }}
            />
          ) : (
            '🔍'
          )}
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search songs, artists..."
          style={{
            width: '100%',
            padding: '10px 16px 10px 42px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #3a3a3a',
            borderRadius: '20px',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#1DB954';
            if (results.length > 0) setShowResults(true);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#3a3a3a';
          }}
        />
      </div>

      {/* Spinner keyframe injected once */}
      <style>{`
        @keyframes yt-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Error message */}
      {error && (
        <p style={{ color: '#ff4d4d', fontSize: '12px', margin: '6px 0 0 12px' }}>
          {error}
        </p>
      )}

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            backgroundColor: '#282828',
            border: '1px solid #3a3a3a',
            borderRadius: '12px',
            zIndex: 100,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          {results.map((video) => (
            <ResultRow key={video.videoId} video={video} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Result row extracted to avoid inline hook issues ──────────────────────────

interface ResultRowProps {
  video: YouTubeVideo;
  onSelect: (video: YouTubeVideo) => void;
}

function ResultRow({ video, onSelect }: ResultRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onSelect(video)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        cursor: 'pointer',
        backgroundColor: hovered ? '#3a3a3a' : 'transparent',
        transition: 'background-color 0.12s ease',
      }}
    >
      {/* Thumbnail */}
      <img
        src={video.thumbnail}
        alt={video.title}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '6px',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />

      {/* Title + artist */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <p
          style={{
            margin: 0,
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '13px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {video.title}
        </p>
        <p
          style={{
            margin: 0,
            color: '#888',
            fontSize: '11px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {video.artist}
        </p>
      </div>

      {/* Duration */}
      <span style={{ color: '#888', fontSize: '12px', flexShrink: 0 }}>
        {video.duration}
      </span>
    </div>
  );
}
