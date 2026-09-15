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
    <div style={{ display: 'flex', flex: 1, gap: '16px', minHeight: 0, overflow: 'hidden' }}>
      {/* 左側: カテゴリ別リスト */}
      <div style={{ flex: '1 1 60%', minWidth: '60%', borderRight: '1px solid #aaa', paddingRight: '8px', overflowY: 'auto' }}>
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
                  <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between w-full overflow-hidden">
                    <div className="flex items-center overflow-hidden w-full sm:flex-1">
                      <span style={{ flexShrink: 0, display: 'inline-block', width: '16px', textAlign: 'center', marginRight: '4px' }}>
                        {selectedItem?.id === m.id ? '▶' : ''}
                      </span>
                      <span style={{ 
                        color: selectedItem?.id === m.id ? '#000' : (m.hasCurse ? '#f00' : (m.attachedSpell && m.isIdentified ? '#0ff' : '#fff')),
                        fontWeight: m.isIdentified ? 'bold' : 'normal',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {m.isIdentified && m.attachedSpell && (
                          <span className="text-cyan-400">
                            <span className="hidden sm:inline">【{t('mem_enchant')}】</span>
                            <span className="sm:hidden">★</span>
                          </span>
                        )}
                        <span>
                          {m.isIdentified 
                            ? (language === 'en' ? (m.flavorText?.itemNameEn || m.flavorText?.itemName) : m.flavorText?.itemName)
                            : t('inv_unidentified')}
                        </span>
                      </span>
                    </div>
                    {inlineAction && <div className="mt-1 sm:mt-0 sm:ml-2 flex-shrink-0 w-full sm:w-auto flex justify-end">{inlineAction(m)}</div>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      
      {/* 右側: 詳細 */}
      <div style={{ flex: '1 1 40%', overflowY: 'auto', paddingRight: '8px' }}>
        {selectedItem ? (
          <>
            <MemoryDetail memory={selectedItem} />
            {actionButton && <div style={{ marginTop: '16px' }}>{actionButton(selectedItem)}</div>}
          </>
        ) : (
          <div className="text-xs text-gray-500" style={{ textAlign: 'center', marginTop: '32px' }}>
            {t('empty_select')}
          </div>
        )}
      </div>
    </div>
  );
};
