import { useState, type FormEvent } from 'react';
import type { CSSProperties } from 'react';
import type { AddSongPayload, AddPosition } from '../types/index';

interface AddSongFormProps {
  onAddSong: (payload: AddSongPayload) => void;
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #333',
  backgroundColor: '#2a2a2a',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: CSSProperties = {
  display: 'block',
  color: '#b3b3b3',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  marginBottom: '6px',
  textTransform: 'uppercase',
};

export default function AddSongForm({ onAddSong }: AddSongFormProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [duration, setDuration] = useState('');
  const [position, setPosition] = useState<'first' | 'last'>('last');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitHovered, setSubmitHovered] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim() || !artist.trim() || !duration) {
      setValidationError('All fields are required.');
      return;
    }

    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum < 1) {
      setValidationError('Duration must be at least 1 second.');
      return;
    }

    setValidationError(null);

    const payload: AddSongPayload = {
      title: title.trim(),
      artist: artist.trim(),
      duration: durationNum,
      position: position as AddPosition,
    };

    onAddSong(payload);

    // Clear form
    setTitle('');
    setArtist('');
    setDuration('');
    setPosition('last');
  }

  return (
    <div
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <h3 style={{ color: '#fff', margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold' }}>
        ➕ Add Song
      </h3>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Song title"
              style={inputStyle}
              required
            />
          </div>

          {/* Artist */}
          <div>
            <label style={labelStyle}>Artist</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name"
              style={inputStyle}
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label style={labelStyle}>Duration (seconds)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 210"
              min={1}
              style={inputStyle}
              required
            />
          </div>

          {/* Position */}
          <div>
            <label style={labelStyle}>Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as 'first' | 'last')}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="last">Add to end</option>
              <option value="first">Add to beginning</option>
            </select>
          </div>

          {/* Validation error */}
          {validationError && (
            <p style={{ color: '#ff4d4d', fontSize: '13px', margin: 0 }}>{validationError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            onMouseEnter={() => setSubmitHovered(true)}
            onMouseLeave={() => setSubmitHovered(false)}
            style={{
              backgroundColor: submitHovered ? '#1ed760' : '#1DB954',
              color: '#000',
              border: 'none',
              borderRadius: '24px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              width: '100%',
            }}
          >
            Add Song
          </button>
        </div>
      </form>
    </div>
  );
}
