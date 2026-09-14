const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix Root container height to include padding
const oldContainer = `<div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>`;
const newContainer = `<div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>`;
appContent = appContent.replace(oldContainer, newContainer);

// 2. Fix Footer link
const oldFooter = `<footer style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: '#888' }}>
        &copy; 2026 buro | <a href="https://note.com/jazzy_begin" target="_blank" rel="noopener noreferrer" style={{ color: '#0ff', textDecoration: 'none' }}>https://note.com/jazzy_begin</a>
      </footer>`;
const newFooter = `<footer style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: '#888' }}>
        &copy; 2026 <a href="https://note.com/jazzy_begin" target="_blank" rel="noopener noreferrer" style={{ color: '#0ff', textDecoration: 'none' }}>buro</a>
      </footer>`;
appContent = appContent.replace(oldFooter, newFooter);

fs.writeFileSync('src/App.tsx', appContent);
console.log('App.tsx layout and footer fixed.');
