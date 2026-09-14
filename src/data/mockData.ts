import type { MemoryItem } from '../types/game';

export const initialInventory: MemoryItem[] = [
  {
    id: "mem_legendary_01",
    isIdentified: true,
    category: "Physical",
    rarity: "Legendary",
    cost: 5,
    statModifiers: { attack: 30, maxHP: 20, maxMP: -20, defense: -5 },
    hasCurse: true,
    requiredUncurseItem: null,
    baseValue: 5000,
    flavorText: {
      itemName: "天を指す覇王",
      itemNameEn: "Overlord Pointing to the Heavens",
      originText: "すべてを平伏させた絶対者の傲慢な意志。その力は確かなものだが、強すぎる自我が宿主の精神を削り取る。",
      originTextEn: "The arrogant will of an absolute ruler who brought all to their knees. A certain power, but its overwhelming ego chips away at the host's mind.",
      priestMemo: "王だと？笑わせるな。死ねば皆同じ土くれに還るというのに、まだ玉座に執着しているのか。",
      priestMemoEn: "\"A king? Don't make me laugh. We all return to the same dirt when we die, yet he still clings to his throne.\""
    }
  },
  {
    id: "mem_legendary_02",
    isIdentified: true,
    category: "Magic",
    rarity: "Legendary",
    cost: 5,
    statModifiers: { maxMP: 50, speed: 20, maxHP: -25, defense: -10 },
    hasCurse: true,
    requiredUncurseItem: null,
    baseValue: 5500,
    flavorText: {
      itemName: "雷霆を操る奇才",
      itemNameEn: "Prodigy of the Thunderbolts",
      originText: "神の領域である雷に魅入られ、己の身を焦がした発明家の記憶。放たれる閃光は敵を穿つが、同時に自らの細胞をも焼く。",
      originTextEn: "Memory of an inventor obsessed with the divine domain of lightning, scorching their own body. The flashes pierce enemies, but also burn the host's cells.",
      priestMemo: "狂気と天才は紙一重と言うが、こいつは単なる狂人だ。お前もそうなりたいなら止めはせんよ。",
      priestMemoEn: "\"They say there's a fine line between madness and genius, but this one is just a madman. I won't stop you if you want to become like him.\""
    }
  },
  {
    id: "mem_epic_01",
    isIdentified: true,
    category: "Magic",
    rarity: "Epic",
    cost: 4,
    statModifiers: { maxMP: 30, speed: 15, defense: -5 },
    hasCurse: false,
    requiredUncurseItem: null,
    baseValue: 3000,
    flavorText: {
      itemName: "星を読む幽閉者",
      itemNameEn: "Imprisoned Astrologer",
      originText: "塔の最上階で生涯を終えた天文学者の知識。星の巡りから未来を予測し行動を最適化するが、肉体への意識が希薄になる。",
      originTextEn: "The knowledge of an astronomer who ended their life at the top of a tower. Predicts the future from the stars to optimize actions, but dulls awareness of the physical body.",
      priestMemo: "星など見て何になる？足元の泥濘すら見えていない愚か者の末路がこれだ。",
      priestMemoEn: "\"What good is looking at the stars? This is the fate of a fool who couldn't even see the mud at their feet.\""
    }
  },
  {
    id: "mem_epic_02",
    isIdentified: true,
    category: "Healing",
    rarity: "Epic",
    cost: 4,
    statModifiers: { maxHP: 40, defense: 15, attack: -10 },
    hasCurse: false,
    requiredUncurseItem: null,
    baseValue: 2800,
    flavorText: {
      itemName: "無私の殉教",
      itemNameEn: "Selfless Martyrdom",
      originText: "他者を癒し続けて絶命した聖職者の慈愛。強固な守りと生命力をもたらすが、他者を傷つける行為への強い抵抗感が生まれる。",
      originTextEn: "The affection of a cleric who died healing others. Grants robust defense and vitality, but creates a strong aversion to harming others.",
      priestMemo: "自己犠牲？吐き気がするな。結局は自分が気持ちよくなりたかっただけの偽善者だ。",
      priestMemoEn: "\"Self-sacrifice? Makes me sick. Just a hypocrite who wanted to feel good about themselves.\""
    }
  },
  {
    id: "mem_common_01",
    isIdentified: true,
    category: "Healing",
    rarity: "Common",
    cost: 1,
    statModifiers: { maxHP: 5, defense: 2, attack: -2 },
    hasCurse: false,
    requiredUncurseItem: null,
    baseValue: 10,
    flavorText: {
      itemName: "『明日も早いから寝なくちゃ』",
      itemNameEn: "\"Got to sleep, early start tomorrow\"",
      originText: "過酷な労働の中、布団に入る瞬間だけを楽しみ生きた平民の記憶。わずかな休息が生命力を補う。",
      originTextEn: "Memory of a commoner who lived only for the moment they got into bed after grueling labor. A brief rest supplements vitality.",
      priestMemo: "その『明日』は二度と来なかったわけだがな。哀れなことだ。",
      priestMemoEn: "\"That 'tomorrow' never came, though. How pathetic.\""
    }
  },
  {
    id: "mem_common_02",
    isIdentified: true,
    category: "Support",
    rarity: "Common",
    cost: 1,
    statModifiers: { speed: 3, defense: 2 },
    hasCurse: false,
    requiredUncurseItem: null,
    baseValue: 5,
    flavorText: {
      itemName: "『これが人生というものなのか？』",
      itemNameEn: "\"Is this what life is?\"",
      originText: "理不尽な労働にすり潰された男の嘆き。痛みを受け入れ、ただ黙って耐え忍ぶ奴隷の習性が刻み込まれている。",
      originTextEn: "Lament of a man ground down by unreasonable labor. Etched with the habit of a slave who accepts pain and endures in silence.",
      priestMemo: "被害者ぶるな。人生など最初から無価値だと気づけない阿呆の末路だ。",
      priestMemoEn: "\"Stop playing the victim. The fate of an idiot who couldn't realize life is worthless from the start.\""
    }
  },
  {
    id: "mem_common_03",
    isIdentified: true,
    category: "Physical",
    rarity: "Common",
    cost: 1,
    statModifiers: { attack: 5, maxHP: 3, maxMP: -3 },
    hasCurse: false,
    requiredUncurseItem: null,
    baseValue: 12,
    flavorText: {
      itemName: "『愛されたかっただけなのに』",
      itemNameEn: "\"I just wanted to be loved\"",
      originText: "裏切られ、絶望して凶行に及んだ者の怨恨。捨て鉢な一撃は重いが、思考力(MP)をわずかに奪う。",
      originTextEn: "Resentment of one who committed a crime in despair after being betrayed. The desperate strike is heavy, but slightly drains mental power (MP).",
      priestMemo: "己の感情すら制御できん獣が愛を語るな。反吐が出る。",
      priestMemoEn: "\"A beast that can't even control its own emotions shouldn't speak of love. Makes me want to puke.\""
    }
  }
];
