import { useState, useEffect, useCallback } from 'react';

const INITIAL_SNAKE_SPEED = 200;
const SPEED_INCREMENT = 10;
const GRID_SIZE = 20;

export const useGameLogic = (canvasWidth, canvasHeight) => {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SNAKE_SPEED);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * (canvasWidth / GRID_SIZE)),
      y: Math.floor(Math.random() * (canvasHeight / GRID_SIZE))
    };
    setFood(newFood);
  }, [canvasWidth, canvasHeight]);

  const checkCollision = useCallback((head) => {
    // Duvarlarla çarpışma kontrolü
    if (
      head.x < 0 ||
      head.x >= canvasWidth / GRID_SIZE ||
      head.y < 0 ||
      head.y >= canvasHeight / GRID_SIZE
    ) {
      return true;
    }

    // Yılanın kendisiyle çarpışma kontrolü
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }, [snake, canvasWidth, canvasHeight]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 10);
      generateFood();
      setSpeed(prev => Math.max(prev - SPEED_INCREMENT, 50));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, checkCollision, generateFood]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  const changeDirection = useCallback((newDirection) => {
    if (gameOver) return;
    
    const oppositeDirections = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };

    if (oppositeDirections[newDirection] !== direction) {
      setDirection(newDirection);
    }
  }, [direction, gameOver]);

  return {
    snake,
    food,
    score,
    gameOver,
    changeDirection,
    resetGame: () => {
      setSnake([
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ]);
      setDirection('RIGHT');
      setGameOver(false);
      setScore(0);
      setSpeed(INITIAL_SNAKE_SPEED);
      generateFood();
    }
  };
}; 