import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { useAudioContext } from '../contexts/AudioContext';

interface HeaderProps {
  onOpenManual: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenManual }) => {
  const { language, setLanguage, t } = useI18n();
  const { musicEnabled, setMusicEnabled } = useAudioContext();

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottom: '2px solid #0f0', 
      paddingBottom: '8px', 
      marginBottom: '16px' 
    }}>
      <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '2px', textShadow: '0 0 5px #fff', color: '#fff' }}>
        {t('title')}
      </h1>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className="cmd-btn" 
          style={{ width: 'auto', padding: '4px 8px', borderColor: '#fff', marginBottom: 0 }} 
          onClick={() => setMusicEnabled(!musicEnabled)}
        >
          Music: {musicEnabled ? 'ON' : 'OFF'}
        </button>
        <button 
          className="cmd-btn" 
          style={{ width: 'auto', padding: '4px 8px', borderColor: '#fff', marginBottom: 0 }} 
          onClick={onOpenManual}
        >
          {t('btn_manual')}
        </button>
        <button 
          className="cmd-btn" 
          style={{ width: 'auto', padding: '4px 8px', borderColor: '#fff', marginBottom: 0 }} 
          onClick={() => {
            const next = language === 'ja' ? 'en' : 'ja';
            setLanguage(next);
          }}
        >
          {t('btn_lang')}
        </button>
      </div>
    </header>
  );
};
