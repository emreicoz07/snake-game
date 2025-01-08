import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GameCanvas from './GameCanvas';
import MobileControls from '../Controls/MobileControls';
import DesktopControls from '../Controls/DesktopControls';
import PlayerForm from '../PlayerForm/PlayerForm';
import './Game.css';

const Game = () => {
  const { t } = useTranslation();
  const [playerName, setPlayerName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!gameStarted) {
    return (
      <PlayerForm 
        onSubmit={(name) => {
          setPlayerName(name);
          setGameStarted(true);
        }}
      />
    );
  }

  const handleDirectionChange = (newDirection) => {
    setDirection(newDirection);
  };

  return (
    <div className="game-container">
      <h2>{t('game.player')}: {playerName}</h2>
      <GameCanvas direction={direction} />
      {isMobile ? (
        <MobileControls onDirectionChange={handleDirectionChange} />
      ) : (
        <DesktopControls onDirectionChange={handleDirectionChange} />
      )}
    </div>
  );
};

export default Game; 