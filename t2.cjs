const translations = [
  {
    "itemName": "『俺の肉を食え』",
    "itemNameEn": "\"Eat My Flesh\"",
    "originTextEn": "A father lost in the snowy mountains who carved off his own thighs to feed his starving child. Madness eclipsed the agony of losing his own flesh.",
    "priestMemoEn": "\"A beautiful display of parental love, but the child choked on the meat and died anyway. The irony is delicious.\""
  },
  {
    "itemName": "『目を開けたまま眠れ』",
    "itemNameEn": "\"Sleep With Your Eyes Open\"",
    "originTextEn": "A dictator so paranoid of assassination that he stitched his eyelids open and died of sleep deprivation. Extreme exhaustion morphed into hyper-reflexes.",
    "priestMemoEn": "\"I respect the effort, but hallucinating from fatigue and stabbing your own shadow to death is peak comedy.\""
  },
  {
    "itemName": "『まだ歩ける』",
    "itemNameEn": "\"I Can Still Walk\"",
    "originTextEn": "A soldier whose legs were blown off by a landmine, attempting to crawl all the way back to his hometown using only his arms. A trail of blood marked his path.",
    "priestMemoEn": "\"His village had been burned to ashes long before he even started crawling. What drove him to drag his stumps that far?\""
  },
  {
    "itemName": "『腕が一本多い』",
    "itemNameEn": "\"One Arm Too Many\"",
    "originTextEn": "A man born as a conjoined twin who severed his brother's arm and grafted it onto his own back. He strikes from grotesque, unnatural angles.",
    "priestMemoEn": "\"How does it feel to fight while sensing your dead brother's pain? Does it make you feel a little less lonely?\""
  },
  {
    "itemName": "『笑いながら殴れ』",
    "itemNameEn": "\"Punch Me While Laughing\"",
    "originTextEn": "A slave gladiator whose brain was modified to experience euphoria upon being struck. He finds ecstasy in the destruction of his own body.",
    "priestMemoEn": "\"If you can convert pain into pleasure, this hellish world becomes a paradise. Frankly, I'm jealous.\""
  },
  {
    "itemName": "『爪が剥がれても』",
    "itemNameEn": "\"Even If My Nails Tear Off\"",
    "originTextEn": "A prisoner who clawed at a dungeon's stone walls until all ten fingernails were gone, eventually digging a hole with his exposed, skeletal fingertips.",
    "priestMemoEn": "\"All that sheer willpower to get out, only to be blinded by the sunlight and stumble off a cliff. Brilliant.\""
  },
  {
    "itemName": "『血が足りない』",
    "itemNameEn": "\"Not Enough Blood\"",
    "originTextEn": "A noble who drank liters of others' blood daily to maintain their youth. Tormented by an eternal, insatiable thirst.",
    "priestMemoEn": "\"He ultimately died of organ rupture from iron toxicity. Blood is meant to be spilled, not sipped like wine.\""
  },
  {
    "itemName": "『耳を削ぎ落とせ』",
    "itemNameEn": "\"Slice Off The Ears\"",
    "originTextEn": "An executioner who sliced off his own ears to avoid hearing the death rattles of his victims. The absolute silence hones his combat focus.",
    "priestMemoEn": "\"Couldn't handle a few screams? Just the pathetic end of a soft-hearted man in the wrong line of work.\""
  },
  {
    "itemName": "『息を止めて走れ』",
    "itemNameEn": "\"Run Holding Your Breath\"",
    "originTextEn": "A boy messenger who ran through a trench filled with poison gas without taking a single breath. The excruciating pain in his lungs remains etched here.",
    "priestMemoEn": "\"The message he delivered was 'Full Retreat.' The despair of that abandoned boy must have been immeasurable.\""
  },
  {
    "itemName": "『骨までしゃぶれ』",
    "itemNameEn": "\"Suck the Marrow Dry\"",
    "originTextEn": "A man stranded on an island who survived by sucking the marrow from the bones of his starved companions. A beast-like obsession dwells within.",
    "priestMemoEn": "\"Surviving all that just to attack his rescuers and get shot like a rabid dog. What a waste of effort.\""
  },
  {
    "itemName": "『舌を噛み切れ』",
    "itemNameEn": "\"Bite Off Your Tongue\"",
    "originTextEn": "A spy who bit off his own tongue and bled to death to prevent leaking secrets under torture. A testament to willpower enduring agony.",
    "priestMemoEn": "\"That 'secret' became outdated intelligence the very next day. A remarkably pointless death.\""
  },
  {
    "itemName": "『髪が抜けるまで』",
    "itemNameEn": "\"Until The Hair Falls Out\"",
    "originTextEn": "A woman cursed to lose one strand of hair a day, dying of sheer terror the moment the final strand fell. The creeping horror of death lingers.",
    "priestMemoEn": "\"Going mad from terror over simple hair loss... The human mind is truly a fragile, pitiful thing.\""
  },
  {
    "itemName": "『内臓が腐る匂い』",
    "itemNameEn": "\"Stench of Rotting Guts\"",
    "originTextEn": "Royalty poisoned to have their internal organs slowly dissolve, spending their final days suffocating in the stench of their own rotting insides.",
    "priestMemoEn": "\"If you want to sit on a throne, you should keep antidotes on hand rather than antacids. Basic common sense.\""
  },
  {
    "itemName": "『皮膚を剥ぐ快感』",
    "itemNameEn": "\"The Pleasure of Flaying\"",
    "originTextEn": "A deranged leatherworker who dedicated his life to flawlessly flaying the skin of his enemies. That obsession sharpens the edge of any blade.",
    "priestMemoEn": "\"The lampshade he made from human skin is apparently still lighting up some noble's mansion. Fine craftsmanship.\""
  },
  {
    "itemName": "『燃える肉の匂い』",
    "itemNameEn": "\"Scent of Burning Flesh\"",
    "originTextEn": "A witch burned at the stake who laughed hysterically, enjoying the smell of her own roasting meat. Madness completely paralyzed her pain receptors.",
    "priestMemoEn": "\"The smell of barbecue does stimulate the appetite. I suppose she was just hungry at the very end.\""
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
