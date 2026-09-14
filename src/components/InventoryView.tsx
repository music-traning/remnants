import { useI18n } from '../contexts/I18nContext';
import React from 'react';
import type { MemoryItem } from '../types/game';
import { MemoryDetail } from './MemoryDetail';

interface Props {
  items: MemoryItem[];
  selectedItem: MemoryItem | null;
  onSelect: (item: MemoryItem) => void;
  actionButton?: (item: MemoryItem) => React.ReactNode;
  inlineAction?: (item: MemoryItem) => React.ReactNode;
}

export const InventoryView: React.FC<Props> = ({ items, selectedItem, onSelect, actionButton, inlineAction }) => {
  const { t, language } = useI18n();
  const categories = ['Physical', 'Magic', 'Defense', 'Healing', 'Support'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(150px, 1fr)', gap: '16px', height: 'calc(100% - 64px)' }}>
      {/* 左側: カテゴリ別リスト */}
      <div style={{ borderRight: '1px solid #aaa', paddingRight: '16px', overflowY: 'auto' }}>
        {items.length === 0 && <p style={{ color: '#aaa' }}>{t('empty_no_items')}</p>}
        {categories.map(cat => {
          const catItems = items.filter(m => m.category === cat);
          if (catItems.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#0f0' }}>[{cat}]</h4>
              {catItems.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => onSelect(m)}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '6px 8px', 
                    background: selectedItem?.id === m.id ? '#fff' : 'transparent', 
                    color: selectedItem?.id === m.id ? '#000' : '#fff' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'inline-block', width: '20px', textAlign: 'center', marginRight: '8px' }}>
                      {selectedItem?.id === m.id ? '▶' : ''}
                    </span>
                    <span style={{ color: selectedItem?.id === m.id ? '#000' : (m.hasCurse ? '#f00' : (m.attachedSpell && m.isIdentified ? '#0ff' : '#fff')) }}>
                      {m.isIdentified 
                        ? (m.attachedSpell ? '☁ ' : '') + (language === 'en' ? (m.flavorText?.itemNameEn || m.flavorText?.itemName) : m.flavorText?.itemName)
                        : t('inv_unidentified')}
                    </span>
                    </div>
                    {inlineAction && inlineAction(m)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      
      {/* 右側: 詳細 */}
      <div style={{ overflowY: 'auto' }}>
        {selectedItem ? (
          <>
            <MemoryDetail memory={selectedItem} />
            {actionButton && <div style={{ marginTop: '16px' }}>{actionButton(selectedItem)}</div>}
          </>
        ) : (
          <div style={{ color: '#555', textAlign: 'center', marginTop: '32px' }}>
            {t('empty_select')}
          </div>
        )}
      </div>
    </div>
  );
};
