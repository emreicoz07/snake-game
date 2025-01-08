import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameLogic } from '../../hooks/useGameLogic';

// Sabit boyutlar yerine dinamik boyutlar kullanacağız
const calculateDimensions = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth < 768;

  if (isMobile) {
    // Mobil cihazlar için dinamik boyutlandırma
    const maxWidth = Math.min(screenWidth * 0.9, screenHeight * 0.6);
    const width = maxWidth;
    const height = (width * 3) / 2; // 2:3 oranını koruyoruz
    const gridSize = width / 20; // Grid boyutunu genişliğe göre ayarlıyoruz
    return { width, height, gridSize };
  }

  // Masaüstü için dinamik boyutlandırma
  const maxWidth = Math.min(600, screenWidth * 0.8);
  const width = maxWidth;
  const height = (width * 2) / 3;
  const gridSize = width / 30; // Daha küçük grid boyutu
  return { width, height, gridSize };
};

const GameCanvas = ({ direction }) => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState(calculateDimensions());
  const isMobileRef = useRef(window.innerWidth < 768);
  
  const {
    snake,
    food,
    score,
    gameOver,
    changeDirection,
    resetGame
  } = useGameLogic(dimensions.width, dimensions.height);

  // Oyunu yeniden başlatma işleyicisi
  const handleRestart = useCallback((e) => {
    if (gameOver) {
      if (isMobileRef.current) {
        // Mobil cihazda ekrana dokunma
        resetGame();
      } else if (e.key === 'Enter') {
        // Masaüstünde Enter tuşu
        resetGame();
      }
    }
  }, [gameOver, resetGame]);

  useEffect(() => {
    if (isMobileRef.current) {
      // Mobil cihazda dokunma olayını dinle
      const canvas = canvasRef.current;
      canvas.addEventListener('touchstart', handleRestart);
      return () => canvas.removeEventListener('touchstart', handleRestart);
    } else {
      // Masaüstünde klavye olayını dinle
      window.addEventListener('keydown', handleRestart);
      return () => window.removeEventListener('keydown', handleRestart);
    }
  }, [handleRestart]);

  // Ekran boyutu değiştiğinde canvas'ı yeniden boyutlandır
  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (direction) {
      changeDirection(direction);
    }
  }, [direction, changeDirection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Canvas'ı temizle
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Arka planı çiz
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Yılanı çiz
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Baş kısmı farklı renkte
        ctx.fillStyle = '#8BC34A';
      }
      ctx.fillRect(
        segment.x * dimensions.gridSize,
        segment.y * dimensions.gridSize,
        dimensions.gridSize - 1,
        dimensions.gridSize - 1
      );
    });

    // Yemeği çiz
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(
      food.x * dimensions.gridSize,
      food.y * dimensions.gridSize,
      dimensions.gridSize - 1,
      dimensions.gridSize - 1
    );

    // Oyun bitti yazısı
    if (gameOver) {
      ctx.fillStyle = 'white';
      ctx.font = isMobileRef.current ? '24px Arial' : '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(t('game.gameOver'), dimensions.width / 2, dimensions.height / 2);
      
      ctx.font = isMobileRef.current ? '16px Arial' : '20px Arial';
      const restartText = isMobileRef.current
        ? t('game.tapScreen')
        : t('game.pressEnter');
      
      ctx.fillText(
        `${t('game.score')}: ${score} - ${restartText}`,
        dimensions.width / 2,
        dimensions.height / 2 + (isMobileRef.current ? 30 : 40)
      );
    }
  }, [snake, food, gameOver, score, dimensions]);

  return (
    <div className="canvas-container">
      <div className="score">Skor: {score}</div>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          border: '2px solid #333',
          maxWidth: '100%',
          height: 'auto',
          touchAction: 'none' // Mobilde kaydırmayı engelle
        }}
      />
    </div>
  );
};

export default GameCanvas; 