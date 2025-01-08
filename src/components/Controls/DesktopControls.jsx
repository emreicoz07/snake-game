import React, { useEffect, useRef } from 'react';

const DesktopControls = ({ onDirectionChange }) => {
  const audioContextRef = useRef(null);

  const playSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
      
      gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.error('Ses çalma hatası:', error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          playSound();
          onDirectionChange('UP');
          break;
        case 'ArrowDown':
          playSound();
          onDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
          playSound();
          onDirectionChange('LEFT');
          break;
        case 'ArrowRight':
          playSound();
          onDirectionChange('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onDirectionChange]);

  return null;
};

export default DesktopControls; 