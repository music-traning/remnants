const fs = require('fs');

// 語彙集
const highAdjs = {
  Physical: ["血塗られた", "天を指す", "無敗の", "万夫不当の", "鋼の", "全てを平伏させる", "猛る", "地を裂く"],
  Magic: ["深淵を覗く", "雷霆を操る", "星を読む", "歪められた", "禁忌の", "神を暴く", "真理に触れた", "虚空を掴む"],
  Healing: ["無私の", "奇跡を呼ぶ", "全てを包む", "聖なる", "慈愛の", "血を分かつ", "穢れなき", "永遠を約束する"],
  Support: ["運命を弄ぶ", "千里を見通す", "不可視の", "時を騙す", "全てを視る", "影を纏う", "神速の", "幻惑の"]
};

const highNouns = {
  Physical: ["覇王", "狂戦士", "闘神", "暴君", "英雄", "巨漢", "孤絶", "首魁"],
  Magic: ["奇才", "幽閉者", "賢者", "魔女", "探求者", "預言者", "異端児", "狂人"],
  Healing: ["殉教者", "聖女", "救世主", "母", "医術師", "祈祷師", "天使", "菩薩"],
  Support: ["暗殺者", "観測者", "盗賊王", "詐欺師", "影武者", "予知者", "風の申し子", "幻影"]
};

const highOrigins = [
  "世界に名を轟かせた偉業の果て。強すぎる力は宿主の肉体を確実に蝕む。",
  "歴史の裏側で絶対的な権力を握った者の傲慢な意志。他者をひれ伏させるが、自我を失う。",
  "神の領域に踏み込み、その代償として存在を抹消された者の狂気。強大な恩恵と強烈な呪いを併せ持つ。",
  "頂点に立ち、そして裏切られた者の壮絶な怨念。凄まじい執念が力を与えるが、安息は永遠に失われる。",
  "世界を救うため、自らを生贄に捧げた者の記憶。その力は確かなものだが、強すぎる義務感が宿主を縛る。"
];

const highPriestMemos = [
  "王だと？笑わせるな。死ねば皆同じ土くれに還るというのに、まだ執着しているのか。",
  "過去の栄光など、今の世界では何の価値もない。ただの呪いの塊だ。",
  "狂気と天才は紙一重と言うが、こいつは単なる狂人だ。お前もそうなりたいなら止めはせんよ。",
  "自己犠牲？吐き気がするな。自分が気持ちよくなりたかっただけの偽善者だ。",
  "歴史に名を残したところで、最終的には私の庵に持ち込まれるガラクタにすぎん。"
];

const lowPhrases = {
  Physical: ["『愛されたかっただけなのに』", "『痛い、痛い、痛い』", "『俺の肉を食うな』", "『もっと力が欲しい』", "『あと一歩だったのに』", "『誰か助けて』"],
  Magic: ["『何も分からない』", "『頭が割れそうだ』", "『声が聞こえる』", "『星が落ちてくる』", "『数式が合わない』", "『私が間違っていた』"],
  Healing: ["『明日も早いから寝なくちゃ』", "『お腹が空いた』", "『少し休ませて』", "『母さんに会いたい』", "『温かいスープが飲みたい』", "『息が苦しい』"],
  Support: ["『これが人生というものか』", "『逃げるが勝ちだ』", "『見つかりませんように』", "『あと五分だけ』", "『靴擦れが痛い』", "『誰も信じない』"]
};

const lowOrigins = [
  "誰にも知られず息絶えた平民の最後の願い。わずかな生命力として宿っている。",
  "理不尽な労働にすり潰された男の嘆き。痛みを受け入れる奴隷の習性が刻み込まれている。",
  "過酷な環境で生き抜こうとした者の執念。生存本能だけが抽出されている。",
  "裏切られ、逆上して凶行に及んだ者の怨恨。捨て鉢な感情が残っている。",
  "ただ平穏な日常を望みながら、無惨に殺された少女の記憶。微弱な加護をもたらす。"
];

const lowPriestMemos = [
  "ゴミのような執着だ。だが、今の貴様にはお似合いの代物だな。",
  "被害者ぶるな。人生など最初から無価値だと気づけない阿呆の末路だ。",
  "同情を誘うつもりか？甘えるな。誰も助けはしない。",
  "その願いは二度と叶わなかったわけだがな。哀れなことだ。",
  "下民の安っぽい悲哀など、犬にでも食わせておけ。"
];

const categories = ['Physical', 'Magic', 'Healing', 'Support'];

const master = {
  Physical: [],
  Magic: [],
  Healing: [],
  Support: []
};

// 重複チェック用Set
const usedNames = new Set();

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

for (const cat of categories) {
  // 各カテゴリ50個生成
  for (let i = 0; i < 50; i++) {
    // 確率でレアリティとコストを決定
    const rand = Math.random();
    let rarity, cost;
    if (rand < 0.1) { rarity = 'Legendary'; cost = 5; }
    else if (rand < 0.3) { rarity = 'Epic'; cost = 4; }
    else if (rand < 0.6) { rarity = 'Rare'; cost = 3; }
    else if (rand < 0.8) { rarity = 'Uncommon'; cost = 2; }
    else { rarity = 'Common'; cost = 1; }

    const isHigh = rarity === 'Epic' || rarity === 'Legendary';

    let itemName = "";
    let originText = "";
    let priestMemo = "";

    // ユニークな名前を生成するまでループ
    let attempts = 0;
    while(true) {
      if (isHigh) {
        itemName = getRandom(highAdjs[cat]) + getRandom(highNouns[cat]);
      } else {
        // 低レアリティのフレーズをベースにしつつ、バリエーションを出すために接尾辞をつける
        itemName = getRandom(lowPhrases[cat]);
        if (attempts > 5) itemName += `（${Math.floor(Math.random() * 1000)}）`;
      }
      
      if (!usedNames.has(itemName)) {
        usedNames.add(itemName);
        break;
      }
      attempts++;
    }

    if (isHigh) {
      originText = getRandom(highOrigins);
      priestMemo = getRandom(highPriestMemos);
    } else {
      originText = getRandom(lowOrigins);
      priestMemo = getRandom(lowPriestMemos);
    }

    master[cat].push({
      rarity,
      cost,
      itemName,
      originText,
      priestMemo
    });
  }
}

fs.writeFileSync('src/data/memoryMaster.json', JSON.stringify(master, null, 2));
console.log('memoryMaster.json generated successfully. Total 200 items.');
