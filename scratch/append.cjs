const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'src', 'data', 'memoryMaster.json');
let db = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const newItems = [
  {
    "category": "Magic",
    "rarity": "Rare",
    "cost": 3,
    "itemName": "歓喜の肉鍋",
    "originText": "彼は自らの四肢を煮込みながら、かつてない至福の笑みを浮かべていた。最後に残った舌で極上のスープを啜り、これこそが人生の完成だと歓喜の歌を口ずさみながら事切れたという。",
    "priestMemo": "「……狂気もここまで煮詰めれば芸術だ。流石の俺も、こいつを笑う気にはなれねぇよ。」",
    "itemNameEn": "Euphoric Stew",
    "originTextEn": "As he boiled his own severed limbs, a smile of absolute bliss graced his face. With his remaining tongue, he sipped the exquisite broth, singing hymns of perfection until his final breath.",
    "priestMemoEn": "\"...When madness boils down this purely, it becomes art. Even I can't find it in myself to mock him.\""
  },
  {
    "category": "Physical",
    "rarity": "Epic",
    "cost": 5,
    "itemName": "美しき千の穴",
    "originText": "彼女は自身の皮膚に千の穴を開け、そこに色鮮やかな猛毒の硝子玉を埋め込んだ。血まみれの鏡の前で己の完璧な美貌に恍惚とし、最高の笑顔のまま絶命していた。",
    "priestMemo": "「救いようのねぇ馬鹿だが……不思議なもんだ、あの死顔には妙な説得力があった。」",
    "itemNameEn": "Thousand Punctured Beauties",
    "originTextEn": "She drilled a thousand holes into her skin, embedding vibrant, venomous glass beads in each. Intoxicated by her own perfection before a bloodstained mirror, she died with the brightest smile.",
    "priestMemoEn": "\"An unsalvageable fool... yet, strangely enough, there was a profound conviction in her dead eyes.\""
  },
  {
    "category": "Defense",
    "rarity": "Uncommon",
    "cost": 2,
    "itemName": "はみ出した乱数",
    "originText": "「違う！俺の運命じゃない！『ドロップ率』だ！俺の存在は0.05%の確率でしか証明されない！」虚空に向かって存在しない数字を叫び続け、彼の肉体はモザイク状に崩壊した。",
    "priestMemo": "「どろっぷりつ……？何かの儀式か？まあ、深淵を見過ぎて言葉がバグっちまったんだろうな。」",
    "itemNameEn": "RNG Overflow",
    "originTextEn": "\"No! It's not my fate! It's the 'drop rate'! My existence is only proven by a 0.05% chance!\" Screaming non-existent numbers at the void, his body crumbled into jagged mosaic pieces.",
    "priestMemoEn": "\"Drop rates...? Some kind of ritual? Well, stare too long into the abyss and your words tend to... glitch.\""
  },
  {
    "category": "Support",
    "rarity": "Legendary",
    "cost": 7,
    "itemName": "書き換えられた座標",
    "originText": "「おい、今すぐ『セーブ』しろ！再起動すれば俺たちのHPも傷も全部なかったことに…」そう言いかけた彼の首は、不自然なラグの直後、初めから無かったかのように消失した。",
    "priestMemo": "「せーぶ……さいきどう？妙だな、あいつの言葉を聞いてから、俺の頭痛も『やり直された』気がする。」",
    "itemNameEn": "Overwritten Coordinates",
    "originTextEn": "\"Hey, 'save' it right now! If we reboot, our HP and wounds will all just...\" Before he could finish, following an unnatural lag, his head vanished as if it had never existed.",
    "priestMemoEn": "\"Save... reboot? Strange. Ever since I heard his ravings, my own headaches feel as if they've been... reset.\""
  },
  {
    "category": "Healing",
    "rarity": "Rare",
    "cost": 4,
    "itemName": "氷結する雪月花",
    "originText": "黒い雪が降る静寂の底で、彼は祈るように目を閉じた。流れる血は瞬時に美しい氷華へと変わり、彼の体は悲鳴を上げることもなく、ただ静かに透明な結晶となって砕け散った。",
    "priestMemo": "「……まるで、最初から世界に存在していなかったような、酷く静かな終わりだった。」",
    "itemNameEn": "Freezing Snowflower",
    "originTextEn": "At the bottom of the silence where black snow falls, he closed his eyes in prayer. His flowing blood bloomed into beautiful ice flowers, and without a single scream, his body shattered into transparent crystals.",
    "priestMemoEn": "\"...It was a terribly quiet end. As if he had never existed in this world to begin with.\""
  },
  {
    "category": "Magic",
    "rarity": "Epic",
    "cost": 6,
    "itemName": "忘却の白波",
    "originText": "波の音だけが響く地下の海辺。彼は自らの記憶を一つずつ水面に浮かべた。愛も憎しみも泡となって消え、完全に空っぽになった肉体は、穏やかな満潮と共に海へ溶けていった。",
    "priestMemo": "「俺もいつか、あんな風に全てを手放せたら……なんてな。柄にもない。」",
    "itemNameEn": "White Waves of Oblivion",
    "originTextEn": "A subterranean shore echoing only with waves. He released his memories one by one onto the water. Love and hate vanished as bubbles, and his emptied vessel dissolved into the gentle high tide.",
    "priestMemoEn": "\"If only I could let go of everything like that someday... Tch, that's not like me at all.\""
  }
];

newItems.forEach(item => {
  const cat = item.category;
  if (!db[cat]) db[cat] = [];
  
  // Remove category from the item before appending to keep schema consistent
  const { category, ...itemData } = item;
  db[cat].push(itemData);
});

fs.writeFileSync(dataFile, JSON.stringify(db, null, 2), 'utf8');
console.log('Appended items to memoryMaster.json');
