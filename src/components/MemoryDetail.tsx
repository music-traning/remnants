import { useI18n } from '../contexts/I18nContext';
import React from 'react';
import type { MemoryItem } from '../types/game';

interface Props {
  memory: MemoryItem;
}

export const MemoryDetail: React.FC<Props> = ({ memory }) => {
  const { t, language } = useI18n();
  const { isIdentified, flavorText, statModifiers, cost, hasCurse, attachedSpell } = memory;

  const renderStats = () => {
    const statLabels: Record<string, string> = {
      maxHP: 'HP', maxMP: 'MP', attack: 'ATK', defense: 'DEF', speed: 'SPD'
    };
    return Object.entries(statModifiers).map(([key, value]) => {
      if (value === undefined) return null;
      const label = statLabels[key] || key;
      const isPositive = value > 0;
      const color = isPositive ? 'text-green' : 'text-red';
      const arrow = isPositive ? '↑' : '↓';
      return (
        <span key={key} style={{ marginRight: '16px' }} className={color}>
          {label}{arrow}{Math.abs(value)}
        </span>
      );
    });
  };

  const displayName = language === 'en' ? (flavorText?.itemNameEn || flavorText?.itemName) : flavorText?.itemName;
  const displayOrigin = language === 'en' ? (flavorText?.originTextEn || flavorText?.originText) : flavorText?.originText;
  const displayMemo = language === 'en' ? (flavorText?.priestMemoEn || flavorText?.priestMemo) : flavorText?.priestMemo;

  if (!isIdentified) {
    return (
      <div className="retro-box memory-detail" style={{ maxWidth: '400px', width: '100%', userSelect: 'none' }}>
        <div style={{ borderBottom: '2px solid #fff', paddingBottom: '12px', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 12px 0' }}>{t('inv_unidentified')}</h2>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
            <span>COST: [?]</span>
          </div>
        </div>
        <div style={{ minHeight: '60px', marginBottom: '8px' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#ccc' }}>{t('mem_unidentified_desc')}</p>
        </div>
        <div className="priest-memo" style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', top: '-10px', left: '16px', backgroundColor: '#000', padding: '0 4px', fontSize: '0.75rem', color: '#888' }}>
            {t('mem_priest_label')}
          </span>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#ccc', fontStyle: 'italic' }}>
            {t('mem_priest_unidentified')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-box memory-detail" style={{ maxWidth: '400px', width: '100%', userSelect: 'none' }}>
      <div style={{ borderBottom: '2px solid #fff', paddingBottom: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 12px 0', color: hasCurse ? '#f00' : '#fff' }}>
          {displayName}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.9rem' }}>
          <div style={{ fontWeight: 'bold' }}>{renderStats()}</div>
          <div>
            <span style={{ color: '#aaa', marginRight: '8px' }}>COST:[{cost}]</span>
            {hasCurse && <span className="text-red" style={{ fontSize: '1.2rem', animation: 'pulse 2s infinite' }} title="Cursed">💀</span>}
          </div>
        </div>
      </div>

      {attachedSpell && (
        <div style={{ padding: '8px', border: '1px dashed #0ff', marginBottom: '12px', color: '#0ff' }}>
          <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>【 {t('mem_enchant')} 】</div>
          <div style={{ fontSize: '0.9rem' }}>
            ▶ {attachedSpell.name} (MP: {attachedSpell.mpCost})
          </div>
        </div>
      )}

      <div style={{ minHeight: '60px', marginBottom: '8px' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#ccc', whiteSpace: 'pre-wrap' }}>
          {displayOrigin}
        </p>
      </div>

      <div className="priest-memo" style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', top: '-10px', left: '16px', backgroundColor: '#000', padding: '0 4px', fontSize: '0.75rem', color: '#888' }}>
          {t('mem_priest_label')}
        </span>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#ccc', fontStyle: 'italic' }}>
          {language === 'en' ? displayMemo : `「${displayMemo}」`}
        </p>
      </div>
    </div>
  );
};
