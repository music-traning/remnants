const translations = [
  {
    "itemName": "万夫不当の肉だるま",
    "itemNameEn": "Mutilated Juggernaut",
    "originTextEn": "The remnants of a berserker who lost all limbs yet crushed enemy lines with his rolling torso. The thirst for slaughter endured even as he became a mere lump of meat.",
    "priestMemoEn": "\"If you have no arms, just tear their throats out with your teeth. Admirable spirit, I suppose, but utterly pathetic to witness.\""
  },
  {
    "itemName": "天を穿つ血槍",
    "itemNameEn": "Spine-Piercing Bloodlance",
    "originTextEn": "Memory of an overlord who ripped out his beloved's spine to forge a spear, piercing a legion of ten thousand. The stench of marrow never dries.",
    "priestMemoEn": "\"Love takes many forms, they say. To him, tearing out her spine was the ultimate proof of devotion. How deeply moving.\""
  },
  {
    "itemName": "飢餓を喰らう顎",
    "itemNameEn": "Maw of the Starved",
    "originTextEn": "A man who devoured his own stomach at the edge of starvation, digesting the void itself. His bottomless hunger has materialized into raw physical destruction.",
    "priestMemoEn": "\"Eating oneself to cure hunger. The absolute pinnacle of self-sufficiency, and the most ridiculous perpetual motion machine I've ever seen.\""
  },
  {
    "itemName": "不死を呪う斬首台",
    "itemNameEn": "Guillotine's Curse",
    "originTextEn": "A sinner beheaded a thousand times as a sideshow, cursed with an anomalous regenerating body. The agony of chipped iron blades is seared into every muscle fiber.",
    "priestMemoEn": "\"Inability to die is quite an inconvenience. Try to rot away in a ditch before you end up like this unfortunate soul.\""
  },
  {
    "itemName": "星を砕く巨腕",
    "itemNameEn": "Star-Shattering Grasp",
    "originTextEn": "The remains of a titan who blew out the muscles in both arms reaching for the heavens. Bones pulverized, flesh burst, just to touch a star.",
    "priestMemoEn": "\"What did he plan to do once he caught a star? The rampage of ignorant power always brings such a beautiful, self-inflicted ruin.\""
  },
  {
    "itemName": "血肉の防波堤",
    "itemNameEn": "Bulwark of Flesh",
    "originTextEn": "A man who willingly became a human sacrifice, swallowing mud at the river bottom to protect his village from a flood. The weight of the silt in his lungs forms an impenetrable defense.",
    "priestMemoEn": "\"The village he sacrificed himself to save was wiped out by a plague the very next year. That's the world for you.\""
  },
  {
    "itemName": "千本指の簒奪者",
    "itemNameEn": "Usurper of a Thousand Fingers",
    "originTextEn": "A deranged warrior who severed the fingers of defeated swordsmen and sewed them onto his own body. He swings his greatsword with grotesque, misshapen strength.",
    "priestMemoEn": "\"The simple-minded logic that more fingers equals more power... I don't hate it. But tying his boots must be a nightmare.\""
  },
  {
    "itemName": "心臓を捧ぐ踊り子",
    "itemNameEn": "Dancer of the Beating Heart",
    "originTextEn": "To entertain a mad king, a maiden cracked her own ribs, pulled out her pulsating heart, and danced frantically. The extreme agony transforms into combat steps.",
    "priestMemoEn": "\"The king's applause stopped long before her heart did. Frenzy is always so quick to cool.\""
  },
  {
    "itemName": "骨砕きの抱擁",
    "itemNameEn": "Bone-Crushing Embrace",
    "originTextEn": "A lunatic who exchanged a passionate embrace with an enemy general, squeezing until every bone in both their bodies shattered. The affection reached the marrow.",
    "priestMemoEn": "\"A very warm embrace indeed. The sound of their internal organs bursting together must have been a beautiful melody of love.\""
  },
  {
    "itemName": "泥を啜る敗残兵",
    "itemNameEn": "Mud-Slurping Remnant",
    "originTextEn": "A soldier who escaped enemy lines by hiding inside a slit-open corpse, slurping mud and rotting flesh to survive. This grotesque will to live breeds unnatural durability.",
    "priestMemoEn": "\"The stench of rot inside his comrade's bowels must have been quite comforting. The will to survive effortlessly eclipses dignity.\""
  },
  {
    "itemName": "眼球を食らう鴉",
    "itemNameEn": "Eye-Gouging Crow",
    "originTextEn": "A sniper who enhanced his vision to the extreme by eating the eyeballs of the dead on the battlefield. Ultimately, he gouged out his own eyes.",
    "priestMemoEn": "\"Seeing too much is a curse. He saw all the ugliness of this world in crystal clarity, so he crushed his own eyes in despair.\""
  },
  {
    "itemName": "血の池に沈む王冠",
    "itemNameEn": "Crown in the Blood Pool",
    "originTextEn": "A tyrant thrown alive into a smelting furnace by a rebellious mob, melting alongside his golden crown. The searing pain of molten lead dwells within.",
    "priestMemoEn": "\"Even a king's majesty turns to nothing but a shrill scream before molten lead. Equality is a wonderful thing, isn't it?\""
  },
  {
    "itemName": "鋼を噛み砕く顎",
    "itemNameEn": "Steel-Masticator",
    "originTextEn": "A berserker who lost his weapon and continued catching and crushing enemy blades with his teeth. Shards of iron remain embedded in the roots of his teeth.",
    "priestMemoEn": "\"Looks like he couldn't find a dentist. Next time, I suggest chewing on softer meat instead of forged iron.\""
  },
  {
    "itemName": "毒杯を煽る道化",
    "itemNameEn": "Jester of the Poison Cup",
    "originTextEn": "A jester who served as his lord's poison taster, downing lethal doses daily, laughing uncontrollably while sweating purple fluid.",
    "priestMemoEn": "\"His last words were 'A bit too much salt today, my lord.' You have to respect that level of professionalism.\""
  },
  {
    "itemName": "肉を裂く鞭",
    "itemNameEn": "Flesh-Rending Scourge",
    "originTextEn": "A fanatic who proved his devotion to God by whipping his own back a thousand times a day, rubbing salt into his exposed nerves.",
    "priestMemoEn": "\"God was never looking at your back. You were just intoxicated by your own pain, you delusional fool.\""
  }
];

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/memoryMaster.json', 'utf8'));

translations.forEach(t => {
  const item = data.Physical.find(i => i.itemName === t.itemName);
  if (item) {
    item.itemNameEn = t.itemNameEn;
    item.originTextEn = t.originTextEn;
    item.priestMemoEn = t.priestMemoEn;
  }
});

fs.writeFileSync('src/data/memoryMaster.json', JSON.stringify(data, null, 2));
