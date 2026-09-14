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
    <div style={{ display: 'flex', gap: '16px', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      {/* 左側: カテゴリ別リスト */}
      <div style={{ flex: '1 1 40%', minWidth: '40%', borderRight: '1px solid #aaa', paddingRight: '8px', overflowY: 'auto' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', flex: 1 }}>
                      <span style={{ flexShrink: 0, display: 'inline-block', width: '16px', textAlign: 'center', marginRight: '4px' }}>
                        {selectedItem?.id === m.id ? '▶' : ''}
                      </span>
                      <span style={{ 
                        color: selectedItem?.id === m.id ? '#000' : (m.hasCurse ? '#f00' : (m.attachedSpell && m.isIdentified ? '#0ff' : '#fff')),
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {m.isIdentified 
                          ? (m.attachedSpell ? '『' + t('mem_enchant') + '』' : '') + (language === 'en' ? (m.flavorText?.itemNameEn || m.flavorText?.itemName) : m.flavorText?.itemName)
                          : t('inv_unidentified')}
                      </span>
                    </div>
                    {inlineAction && <div style={{ flexShrink: 0, marginLeft: '8px' }}>{inlineAction(m)}</div>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      
      {/* 右側: 詳細 */}
      <div style={{ flex: '1 1 60%', overflowY: 'auto', paddingRight: '8px' }}>
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
