import React from 'react';
import { useI18n } from '../contexts/I18nContext';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          backgroundColor: '#000',
          border: '2px solid #fff',
          padding: '24px',
          overflowY: 'auto',
          color: '#fff',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          {t('close')}
        </button>
        <h2 style={{ borderBottom: '1px solid #555', paddingBottom: '8px', marginTop: 0 }}>
          {t('manual_title')}
        </h2>
        <div style={{ marginTop: '16px', lineHeight: '1.6' }}>
          <h3 style={{ color: '#0f0' }}>{t('manual_explore')}</h3>
          <p>{t('manual_explore_desc')}</p>

          <h3 style={{ color: '#0f0', marginTop: '24px' }}>{t('manual_cost')}</h3>
          <p>{t('manual_cost_desc')}</p>

          <h3 style={{ color: '#0f0', marginTop: '24px' }}>{t('manual_penalty')}</h3>
          <p>{t('manual_penalty_desc')}</p>
        </div>
      </div>
    </div>
  );
};
