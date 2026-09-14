const fs = require('fs');

let c = fs.readFileSync('src/data/mockData.ts', 'utf8');

c = c.replace(/itemName: "天を指す要E",/, `itemName: "天を指す覇王",\n      itemNameEn: "Overlord Pointing to the Heavens",`);
c = c.replace(/originText: "すべてを平伏させた絶対老EE傲慢な意志.*",/, `originText: "すべてを平伏させた絶対者の傲慢な意志。その力は確かなものだが、強すぎる自我が宿主の精神を削り取る。",\n      originTextEn: "The arrogant will of an absolute ruler who brought all to their knees. A certain power, but its overwhelming ego chips away at the host's mind.",`);
c = c.replace(/priestMemo: "王だとE笑わせるな.*",/, `priestMemo: "王だと？笑わせるな。死ねば皆同じ土くれに還るというのに、まだ玉座に執着しているのか。",\n      priestMemoEn: "\"A king? Don't make me laugh. We all return to the same dirt when we die, yet he still clings to his throne.\"",`);

c = c.replace(/itemName: "雷霁E操る奁E",/, `itemName: "雷霆を操る奇才",\n      itemNameEn: "Prodigy of the Thunderbolts",`);
c = c.replace(/originText: "神E領域である雷に魁EEられ.*",/, `originText: "神の領域である雷に魅入られ、己の身を焦がした発明家の記憶。放たれる閃光は敵を穿つが、同時に自らの細胞をも焼く。",\n      originTextEn: "Memory of an inventor obsessed with the divine domain of lightning, scorching their own body. The flashes pierce enemies, but also burn the host's cells.",`);
c = c.replace(/priestMemo: "狂気と天才E紙一重と言ぁE.*",/, `priestMemo: "狂気と天才は紙一重と言うが、こいつは単なる狂人だ。お前もそうなりたいなら止めはせんよ。",\n      priestMemoEn: "\"They say there's a fine line between madness and genius, but this one is just a madman. I won't stop you if you want to become like him.\"",`);

c = c.replace(/itemName: "星を読む幽閉老E,/, `itemName: "星を読む幽閉者",\n      itemNameEn: "Imprisoned Astrologer",`);
c = c.replace(/originText: "塔E最上階で生涯を終えた天斁E老EE知識.*",/, `originText: "塔の最上階で生涯を終えた天文学者の知識。星の巡りから未来を予測し行動を最適化するが、肉体への意識が希薄になる。",\n      originTextEn: "The knowledge of an astronomer who ended their life at the top of a tower. Predicts the future from the stars to optimize actions, but dulls awareness of the physical body.",`);
c = c.replace(/priestMemo: "星など見て何になる？足允EE泥濘すら見えてぁE.*",/, `priestMemo: "星など見て何になる？足元の泥濘すら見えていない愚か者の末路がこれだ。",\n      priestMemoEn: "\"What good is looking at the stars? This is the fate of a fool who couldn't even see the mud at their feet.\"",`);

c = c.replace(/itemName: "無私E殉教",/, `itemName: "無私の殉教",\n      itemNameEn: "Selfless Martyrdom",`);
c = c.replace(/originText: "他老E庁E続けて絶命した聖E老EE慈E.*",/, `originText: "他者を癒し続けて絶命した聖職者の慈愛。強固な守りと生命力をもたらすが、他者を傷つける行為への強い抵抗感が生まれる。",\n      originTextEn: "The affection of a cleric who died healing others. Grants robust defense and vitality, but creates a strong aversion to harming others.",`);
c = c.replace(/priestMemo: "自己犠牲E吐き気がするな。.*",/, `priestMemo: "自己犠牲？吐き気がするな。結局は自分が気持ちよくなりたかっただけの偽善者だ。",\n      priestMemoEn: "\"Self-sacrifice? Makes me sick. Just a hypocrite who wanted to feel good about themselves.\"",`);

c = c.replace(/itemName: "『E日も早ぁEら寝なくちめEE,/, `itemName: "『明日も早いから寝なくちゃ』",\n      itemNameEn: "\"Got to sleep, early start tomorrow\"",`);
c = c.replace(/originText: "過Eな労働E中.*",/, `originText: "過酷な労働の中、布団に入る瞬間だけを楽しみ生きた平民の記憶。わずかな休息が生命力を補う。",\n      originTextEn: "Memory of a commoner who lived only for the moment they got into bed after grueling labor. A brief rest supplements vitality.",`);
c = c.replace(/priestMemo: "そE『E日』E二度と来なかった.*",/, `priestMemo: "その『明日』は二度と来なかったわけだがな。哀れなことだ。",\n      priestMemoEn: "\"That 'tomorrow' never came, though. How pathetic.\"",`);

c = c.replace(/itemName: "『これが人生とぁEもEなのか？、E,/, `itemName: "『これが人生というものなのか？』",\n      itemNameEn: "\"Is this what life is?\"",`);
c = c.replace(/originText: "琁E尽な労働にすり潰された男の嘁E.*",/, `originText: "理不尽な労働にすり潰された男の嘆き。痛みを受け入れ、ただ黙って耐え忍ぶ奴隷の習性が刻み込まれている。",\n      originTextEn: "Lament of a man ground down by unreasonable labor. Etched with the habit of a slave who accepts pain and endures in silence.",`);
c = c.replace(/priestMemo: "被害老EEるな。人生など最初から.*",/, `priestMemo: "被害者ぶるな。人生など最初から無価値だと気づけない阿呆の末路だ。",\n      priestMemoEn: "\"Stop playing the victim. The fate of an idiot who couldn't realize life is worthless from the start.\"",`);

c = c.replace(/itemName: "『Eされたかっただけなのに、E,/, `itemName: "『愛されたかっただけなのに』",\n      itemNameEn: "\"I just wanted to be loved\"",`);
c = c.replace(/originText: "裏Eられ、EEして凶行に及んだ.*",/, `originText: "裏切られ、絶望して凶行に及んだ者の怨恨。捨て鉢な一撃は重いが、思考力(MP)をわずかに奪う。",\n      originTextEn: "Resentment of one who committed a crime in despair after being betrayed. The desperate strike is heavy, but slightly drains mental power (MP).",`);
c = c.replace(/priestMemo: "己の感情すら制御できん獣がEを語るな。.*",/, `priestMemo: "己の感情すら制御できん獣が愛を語るな。反吐が出る。",\n      priestMemoEn: "\"A beast that can't even control its own emotions shouldn't speak of love. Makes me want to puke.\"",`);

fs.writeFileSync('src/data/mockData.ts', c);
