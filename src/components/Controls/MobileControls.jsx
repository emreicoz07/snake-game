import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Controls.css';

const MobileControls = ({ onDirectionChange }) => {
  const { t } = useTranslation();
  const touchStartRef = useRef({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleSwipeStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    setIsActive(true);
  };

  const handleSwipeMove = (e) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipeDistance) {
        const direction = diffX > 0 ? 'RIGHT' : 'LEFT';
        setSwipeDirection(direction);
        onDirectionChange(direction);
        touchStartRef.current = null;
      }
    } else {
      if (Math.abs(diffY) > minSwipeDistance) {
        const direction = diffY > 0 ? 'DOWN' : 'UP';
        setSwipeDirection(direction);
        onDirectionChange(direction);
        touchStartRef.current = null;
      }
    }
  };

  const handleSwipeEnd = () => {
    setIsActive(false);
    setSwipeDirection(null);
    touchStartRef.current = null;
  };

  return (
    <div 
      className={`swipe-area ${isActive ? 'active' : ''} ${swipeDirection ? `swipe-${swipeDirection.toLowerCase()}` : ''}`}
      onTouchStart={handleSwipeStart}
      onTouchMove={handleSwipeMove}
      onTouchEnd={handleSwipeEnd}
    >
      <div className="swipe-hint">
        <span className="material-icons">touch_app</span>
        <p>{t('controls.swipeToMove')}</p>
      </div>
    </div>
  );
};

export default MobileControls;