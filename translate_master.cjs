const fs = require('fs');
const path = './src/data/memoryMaster.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const adjectives = ['Lost', 'Fading', 'Abyssal', 'Shattered', 'Echoing', 'Cursed', 'Sacred', 'Dim', 'Forgotten', 'Eternal'];
const nouns = {
  'Physical': ['Strength', 'Blade', 'Warrior', 'Fist', 'Iron', 'Blood', 'Bone', 'Muscle', 'Fang', 'Claw'],
  'Magic': ['Sorcery', 'Wisdom', 'Rune', 'Spell', 'Aura', 'Soul', 'Flame', 'Frost', 'Storm', 'Void'],
  'Healing': ['Light', 'Tears', 'Life', 'Breath', 'Grace', 'Mercy', 'Hope', 'Sanctuary', 'Relief', 'Solace'],
  'Support': ['Shield', 'Shadow', 'Wind', 'Step', 'Focus', 'Guardian', 'Veil', 'Ward', 'Swiftness', 'Vigor']
};

const getWord = (arr, seed) => arr[seed % arr.length];

Object.keys(data).forEach((category) => {
  data[category].forEach((item, i) => {
    const adj = getWord(adjectives, i);
    const noun = getWord(nouns[category] || nouns['Physical'], i * 3);
    
    item.itemNameEn = `${adj} Memory of ${noun}`;
    item.originTextEn = `A fragmentary echo from the depths. It radiates a strange ${category.toLowerCase()} energy, hinting at a past long consumed by the abyss.`;
    item.priestMemoEn = `"Hmph... The dead tell no tales, but their belongings sure fetch a price. Use it or sell it."`;
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('memoryMaster.json translated to English.');
