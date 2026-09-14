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
      originText: "すべてを平伏させた絶対者の傲慢な意志。\nその力は確かなものだが、強すぎる自我が宿主の精神を削り取る。",
      priestMemo: "王だと？笑わせるな。死ねば皆同じ土くれに還るというのに、まだ玉座に執着しているのか。"
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
      originText: "神の領域である雷に魅入られ、己の身を焦がした発明家の記憶。\n放たれる閃光は敵を穿つが、同時に自らの細胞をも焼く。",
      priestMemo: "狂気と天才は紙一重と言うが、こいつは単なる狂人だ。お前もそうなりたいなら止めはせんよ。"
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
      originText: "塔の最上階で生涯を終えた天文学者の知識。\n星の巡りから未来を予測し行動を最適化するが、肉体への意識は希薄になる。",
      priestMemo: "星など見て何になる？足元の泥濘すら見えていない愚か者の末路がこれだ。"
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
      originText: "他者を庇い続けて絶命した聖職者の慈愛。\n強固な守りと生命力をもたらすが、他者を傷つける行為への強い抵抗感が生まれる。",
      priestMemo: "自己犠牲？吐き気がするな。自分が気持ちよくなりたかっただけの偽善者だ。"
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
      originText: "過酷な労働の中、布団に入る瞬間だけを楽しみ生きた平民の記憶。\nわずかな休息が生命力を補う。",
      priestMemo: "その『明日』は二度と来なかったわけだがな。哀れなことだ。"
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
      originText: "理不尽な労働にすり潰された男の嘆き。\n痛みを受け入れ、ただ黙々と耐え忍ぶ奴隷の習性が刻み込まれている。",
      priestMemo: "被害者ぶるな。人生など最初から無価値だと気づけない阿呆の末路だ。"
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
      originText: "裏切られ、逆上して凶行に及んだ者の怨恨。\n捨て鉢な一撃は重いが、思考力（MP）をわずかに奪う。",
      priestMemo: "己の感情すら制御できん獣が愛を語るな。反吐が出る。"
    }
  }
];
