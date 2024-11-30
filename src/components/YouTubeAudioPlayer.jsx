// src/components/YouTubeAudioPlayer.jsx
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import YouTube from 'react-youtube';

const YouTubeAudioPlayer = forwardRef(({ videoId }, ref) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const opts = {
    height: '0', // Hide the video
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      showinfo: 0,
      disablekb: 1,
      modestbranding: 1,
      loop: 1,
      playlist: videoId, // Required for looping
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const onError = (event) => {
    console.error('YouTube Player Error:', event.data);
    // Optional: Handle the error gracefully
  };

  useImperativeHandle(ref, () => ({
    playVideo: () => {
      if (playerRef.current) {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    },
    pauseVideo: () => {
      if (playerRef.current) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      }
    },
    togglePlay: () => {
      if (playerRef.current) {
        if (isPlaying) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      }
    },
    isPlaying: () => isPlaying,
  }));

  return (
    <div className="youtube-audio-player">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onError={onError}
      />
    </div>
  );
});

export default YouTubeAudioPlayer;
