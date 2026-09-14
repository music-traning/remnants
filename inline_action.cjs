const fs = require('fs');

// 1. Update InventoryView.tsx
let invContent = fs.readFileSync('src/components/InventoryView.tsx', 'utf8');

if (!invContent.includes('inlineAction?:')) {
  invContent = invContent.replace(
    `actionButton?: (item: MemoryItem) => React.ReactNode;`,
    `actionButton?: (item: MemoryItem) => React.ReactNode;\n  inlineAction?: (item: MemoryItem) => React.ReactNode;`
  );
}

if (!invContent.includes('inlineAction }) => {')) {
  invContent = invContent.replace(
    `actionButton }) => {`,
    `actionButton, inlineAction }) => {`
  );
}

const oldDivFlex = `<div style={{ display: 'flex', alignItems: 'center' }}>`;
const newDivFlex = `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>`;

if (!invContent.includes('justifyContent: \'space-between\'')) {
  invContent = invContent.replace(oldDivFlex, newDivFlex);
  
  const oldSpanEnd = `</span>
                  </div>`;
  const newSpanEnd = `</span>
                    </div>
                    {inlineAction && inlineAction(m)}
                  </div>`;
  invContent = invContent.replace(oldSpanEnd, newSpanEnd);
}

fs.writeFileSync('src/components/InventoryView.tsx', invContent);

// 2. Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldUnidentified = `<InventoryView 
                      items={player.inventory.filter(m => !m.isIdentified)} 
                      selectedItem={selectedItem} 
                      onSelect={setSelectedItem}
                      actionButton={(mem) => {`;

const newUnidentified = `<InventoryView 
                      items={player.inventory.filter(m => !m.isIdentified)} 
                      selectedItem={selectedItem} 
                      onSelect={setSelectedItem}
                      inlineAction={(mem) => {
                        const cost = mem.cost * 25;
                        const canAfford = player.currentEn >= cost;
                        return (
                          <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#aaa', marginRight: '8px', fontSize: '0.9rem' }}>{cost} En</span>
                            <button 
                              className="cmd-btn"
                              style={{ 
                                padding: '2px 8px', 
                                width: 'auto', 
                                fontSize: '0.8rem',
                                borderColor: canAfford ? '#0f0' : '#555',
                                color: canAfford ? '#0f0' : '#555'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!canAfford) return;
                                const res = memoryActions.identifyMemory(mem.id);
                                actions.addLog(res.message);
                                if (res.success) setSelectedItem(null);
                              }}
                            >鑑定</button>
                          </div>
                        )
                      }}
                      actionButton={(mem) => {`;

if (appContent.includes(oldUnidentified)) {
  appContent = appContent.replace(oldUnidentified, newUnidentified);
  fs.writeFileSync('src/App.tsx', appContent);
}

console.log('Finished updating InventoryView and App.tsx');
