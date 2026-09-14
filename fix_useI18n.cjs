const fs = require('fs');

let invContent = fs.readFileSync('src/components/InventoryView.tsx', 'utf8');
invContent = invContent.replace(/export const InventoryView: React\.FC<InventoryViewProps> = \((.*?)\) => \{/, "export const InventoryView: React.FC<InventoryViewProps> = ($1) => {\n  const { t, language } = useI18n();");
fs.writeFileSync('src/components/InventoryView.tsx', invContent);

let memContent = fs.readFileSync('src/components/MemoryDetail.tsx', 'utf8');
memContent = memContent.replace(/export const MemoryDetail: React\.FC<MemoryDetailProps> = \((.*?)\) => \{/, "export const MemoryDetail: React.FC<MemoryDetailProps> = ($1) => {\n  const { t, language } = useI18n();");
fs.writeFileSync('src/components/MemoryDetail.tsx', memContent);

// Also fix useEconomy and hooks that said "never read"
let ecoContent = fs.readFileSync('src/hooks/useEconomy.ts', 'utf8');
ecoContent = ecoContent.replace(/export function useEconomy\((.*?)\) \{/, "export function useEconomy($1) {\n  const { t } = useI18n();");
fs.writeFileSync('src/hooks/useEconomy.ts', ecoContent);

let memHooksContent = fs.readFileSync('src/hooks/useMemoryManagement.ts', 'utf8');
memHooksContent = memHooksContent.replace(/export function useMemoryManagement\((.*?)\) \{/, "export function useMemoryManagement($1) {\n  const { t } = useI18n();");
fs.writeFileSync('src/hooks/useMemoryManagement.ts', memHooksContent);

let glContent = fs.readFileSync('src/hooks/useGameLoop.ts', 'utf8');
glContent = glContent.replace(/export function useGameLoop\((.*?)\) \{/, "export function useGameLoop($1) {\n  const { t } = useI18n();");
fs.writeFileSync('src/hooks/useGameLoop.ts', glContent);
