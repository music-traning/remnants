const fs = require('fs');

// 1. Update index.css
let cssContent = fs.readFileSync('src/index.css', 'utf8');

const cmdGridCSS = `
.cmd-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

@media (max-width: 768px), (max-height: 450px) {
  .cmd-grid {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4px;
  }
}
`;
if (!cssContent.includes('.cmd-grid')) {
  cssContent += cmdGridCSS;
  
  // Remove margin-bottom from .cmd-btn so gap handles it
  cssContent = cssContent.replace('margin-bottom: 8px;', 'margin-bottom: 0;');
  cssContent = cssContent.replace('margin-bottom: 4px;', 'margin-bottom: 0;');
  fs.writeFileSync('src/index.css', cssContent);
}

// 2. Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// We need to wrap the buttons inside the COMMAND pane with <div className="cmd-grid">
// The COMMAND pane starts with: <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '4px', marginBottom: '8px' }}>COMMAND</h3>
const oldCommandHeader = `<h3 style={{ borderBottom: '1px solid #555', paddingBottom: '4px', marginBottom: '8px' }}>COMMAND</h3>`;
const newCommandHeader = `<h3 style={{ borderBottom: '1px solid #555', paddingBottom: '4px', marginBottom: '8px' }}>COMMAND</h3>
            <div className="cmd-grid">`;

if (appContent.includes(oldCommandHeader)) {
  appContent = appContent.replace(oldCommandHeader, newCommandHeader);
  
  // Now we need to close the div at the end of the COMMAND pane.
  // The COMMAND pane ends right before <div className="pane"> LOG ...
  const oldPaneEnd = `          </div>
          <div className="pane">
            <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '4px', marginBottom: '8px' }}>LOG</h3>`;
            
  const newPaneEnd = `            </div>
          </div>
          <div className="pane">
            <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '4px', marginBottom: '8px' }}>LOG</h3>`;
            
  appContent = appContent.replace(oldPaneEnd, newPaneEnd);
  
  fs.writeFileSync('src/App.tsx', appContent);
  console.log('App.tsx wrapped commands in cmd-grid.');
} else {
  console.log('Could not find command header.');
}
