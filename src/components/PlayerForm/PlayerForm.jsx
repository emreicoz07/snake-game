import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './PlayerForm.css';

const PlayerForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError(t('playerForm.nameRequired'));
      return;
    }

    if (name.length < 3) {
      setError(t('playerForm.nameMinLength'));
      return;
    }

    onSubmit(name);
  };

  return (
    <div className="player-form-container">
      <div className="player-form-card">
        <h1>{t('playerForm.title')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="playerName">{t('playerForm.nameLabel')}</label>
            <input
              type="text"
              id="playerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('playerForm.namePlaceholder')}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          <button type="submit" className="start-button">
            {t('playerForm.startButton')}
          </button>
        </form>
        <div className="instructions">
          <h3>{t('playerForm.howToPlay')}</h3>
          <ul>
            <li>{t('playerForm.instructions.desktop')}</li>
            <li>{t('playerForm.instructions.mobile')}</li>
            <li>{t('playerForm.instructions.food')}</li>
            <li>{t('playerForm.instructions.walls')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlayerForm; 