interface YouTubePlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  onReady: () => void;
  onEnd: () => void;
  onError: () => void;
}

export default function YouTubePlayerComponent({
  videoId,
}: YouTubePlayerProps) {
  if (videoId === null) return null;

  return (
    <iframe
      width="0"
      height="0"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
      allow="autoplay"
      style={{ display: 'none' }}
      title="YouTube audio player"
    />
  );
}
