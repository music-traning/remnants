const fs = require('fs');

const physicalItems = [
  // Legendary (5)
  { rarity: "Legendary", cost: 5, itemName: "万夫不当の肉だるま", originText: "四肢を削ぎ落とされながらも、胴体だけで敵兵を押し潰し続けた闘鬼の末路。\n肉の塊となっても殺戮の意志は止まらなかった。", priestMemo: "腕がないなら噛みちぎればいい。その精神性は評価するが、あまりにも無様だ。" },
  { rarity: "Legendary", cost: 5, itemName: "天を穿つ血槍", originText: "愛する者の背骨を引き抜いて槍とし、一万の軍勢を貫いた覇王の記憶。\n脊髄液の香りが今も乾かない。", priestMemo: "愛の形は人それぞれだ。彼にとっては、背骨こそが最も美しい愛の証明だったのだろう。" },
  { rarity: "Legendary", cost: 5, itemName: "飢餓を喰らう顎", originText: "飢餓の果てに自らの胃袋すら噛み砕き、虚無を消化し続けた男。\n際限のない食欲が物理的な破壊力に転化している。", priestMemo: "空腹を満たすために己を食う。自己完結の極致にして、最高に滑稽な永久機関だ。" },
  { rarity: "Legendary", cost: 5, itemName: "不死を呪う斬首台", originText: "首を斬られても再生する特異体質ゆえに、見世物として千回斬首された罪人。\n刃こぼれした鉄の痛みが筋繊維に焼き付いている。", priestMemo: "死ねないというのも不便だな。お前もそうならぬよう、適当なところで野垂れ死ね。" },
  { rarity: "Legendary", cost: 5, itemName: "星を砕く巨腕", originText: "空に浮かぶ星を掴もうと、両腕の筋繊維を爆発させて天に手を伸ばした巨人の残骸。\n骨は粉々に砕け、肉は弾け飛んでいる。", priestMemo: "星など掴んでどうするつもりだったのか。無知なる力の暴走は、いつ見ても美しい破滅を呼ぶ。" },
  
  // Epic (10)
  { rarity: "Epic", cost: 4, itemName: "血肉の防波堤", originText: "氾濫する濁流から村を守るため、自ら人柱となって水底で泥を飲み込み続けた男。\n肺に詰まった泥の重みが防御となる。", priestMemo: "自己犠牲の果てに守った村は、翌年の疫病で全滅した。これが世界というものだ。" },
  { rarity: "Epic", cost: 4, itemName: "千本指の簒奪者", originText: "敗れた剣士たちの指を切り落として自らの肉体に縫い付けた狂武者。\n異形の腕力で大剣を振り回す。", priestMemo: "指が増えれば強くなるという短絡的な思考、嫌いではない。だが靴紐は結びにくそうだな。" },
  { rarity: "Epic", cost: 4, itemName: "心臓を捧ぐ踊り子", originText: "狂王を喜ばせるため、自らの肋骨を割り、脈打つ心臓を素手で取り出して踊り狂った乙女。\n極限の激痛が闘争のステップへ変わる。", priestMemo: "王の拍手は、彼女の心臓が止まるよりも先に鳴り止んだよ。熱狂とは常に冷めやすい。" },
  { rarity: "Epic", cost: 4, itemName: "骨砕きの抱擁", originText: "敵対する将軍に熱烈な抱擁を交わし、そのまま互いの全身の骨が折れるまで締め付け合った狂人。\nその愛は骨髄まで達した。", priestMemo: "熱い抱擁だ。互いの内臓が潰れ合う音は、さぞ美しい愛の調べだったことだろう。" },
  { rarity: "Epic", cost: 4, itemName: "泥を啜る敗残兵", originText: "敵陣から逃げ延びるため、屍の腹を裂いてその中に身を隠し、腐肉と泥をすすって生還した兵士。\n生き汚さが異常な耐久力を生む。", priestMemo: "仲間の腸の中で嗅いだ死臭は、さぞ心地よかっただろう。生への執着は時に尊厳を軽く凌駕する。" },
  { rarity: "Epic", cost: 4, itemName: "眼球を食らう鴉", originText: "戦場で死体の眼球だけを穿り出し、それを食べて視力を極限まで高めた狙撃手。\n最終的に自らの眼球も抉り出した。", priestMemo: "見えすぎるというのも考えものだ。この世の醜悪さを全て見てしまったから、己の目を潰したのだ。" },
  { rarity: "Epic", cost: 4, itemName: "血の池に沈む王冠", originText: "逆反した民衆に生きたまま溶鉱炉に投げ込まれ、黄金の王冠とともに溶けた暴君。\n煮えたぎる鉛の痛みが宿っている。", priestMemo: "王の威厳も、溶けた鉛の前ではただの悲鳴に変わった。平等とは素晴らしいものだな。" },
  { rarity: "Epic", cost: 4, itemName: "鋼を噛み砕く顎", originText: "武器を失い、敵の刃を歯で受け止めて噛み砕き続けた狂戦士。\nその歯根には今も鉄の破片が突き刺さっている。", priestMemo: "歯医者には行けなかったようだな。次からは鉄ではなく、もっと柔らかい肉を噛むことをお勧めする。" },
  { rarity: "Epic", cost: 4, itemName: "毒杯を煽る道化", originText: "主君の毒見役として、致死量の毒を毎日飲み続け、全身から紫色の汗を流しながら笑い続けた道化師。", priestMemo: "最期の言葉は「今日は少し塩気が強いですね」だったそうだ。プロ意識には頭が下がる。" },
  { rarity: "Epic", cost: 4, itemName: "肉を裂く鞭", originText: "自らの背中を一日千回鞭打ち、剥き出しの神経に塩を塗り込んで神への忠誠を示した狂信者。", priestMemo: "神はお前の背中など見ていない。ただ、お前自身が痛みに酔いしれていただけであろう？" },

  // Rare (15)
  { rarity: "Rare", cost: 3, itemName: "『俺の肉を食え』", originText: "雪山で遭難し、飢える我が子に自らの太ももを削ぎ落として与え続けた父親。\n肉を失う痛みよりも、狂気が勝る。", priestMemo: "美しい親の愛だが、子供は結局、その肉を喉に詰まらせて死んだよ。皮肉なものだ。" },
  { rarity: "Rare", cost: 3, itemName: "『目を開けたまま眠れ』", originText: "暗殺を恐れるあまり、自分のまぶたを縫い付けて一生眠らずに死んだ独裁者。\n極度の疲労が反射神経に変わる。", priestMemo: "眠らぬ努力は認めるが、疲労で幻覚を見て、自らの影に刃を向けて死ぬとは滑稽極まりない。" },
  { rarity: "Rare", cost: 3, itemName: "『まだ歩ける』", originText: "両脚を地雷で吹き飛ばされながらも、腕の力だけで故郷まで這って帰ろうとした兵士。\n這いずった跡には血の道ができた。", priestMemo: "故郷の村はとっくに焼き払われていたというのに、何が彼をそこまで突き動かしたのかね。" },
  { rarity: "Rare", cost: 3, itemName: "『腕が一本多い』", originText: "結合双生児として生まれ、兄弟の腕を切り落として己の背中に移植した男。\n不自然な角度から放たれる一撃。", priestMemo: "兄弟の痛みを感じながら戦う気分はどうだ？少しは寂しさが紛れるか？" },
  { rarity: "Rare", cost: 3, itemName: "『笑いながら殴れ』", originText: "殴られるたびに多幸感を感じるよう脳を改造された奴隷剣闘士。\n肉体が破壊されることに快楽を覚えている。", priestMemo: "痛みを快楽に変換できるなら、この地獄のような世界も天国に変わるのだろうな。羨ましい限りだ。" },
  { rarity: "Rare", cost: 3, itemName: "『爪が剥がれても』", originText: "地下牢の石壁を素手で掘り続け、十指の爪を完全に失い、白骨化した指先で穴を開けた囚人。", priestMemo: "その執念で外に出たところで、外の光に目が潰れて死んだわけだが。" },
  { rarity: "Rare", cost: 3, itemName: "『血が足りない』", originText: "若さを保つため、毎日数リットルの他人の血を飲み続けた貴族。\n常に血の渇きに苛まれている。", priestMemo: "結局、鉄分過多で内臓が破裂した。血は飲むものではない、流すものだ。" },
  { rarity: "Rare", cost: 3, itemName: "『耳を削ぎ落とせ』", originText: "敵の断末魔を聞くたびに自らの耳を削ぎ落とし、完全に聴覚を失った処刑人。\n無音の世界が闘争への集中力を高める。", priestMemo: "他人の悲鳴に耐えられなかったのか？処刑人に向いていない優男の末路だな。" },
  { rarity: "Rare", cost: 3, itemName: "『息を止めて走れ』", originText: "毒ガスが充満する塹壕の中を、呼吸を止めたまま走り抜けて伝令を届けた少年兵。\n肺の激痛が刻まれている。", priestMemo: "届けた伝令の内容が「全軍撤退」だった時の、見捨てられた少年の絶望は計り知れない。" },
  { rarity: "Rare", cost: 3, itemName: "『骨までしゃぶれ』", originText: "孤島に流され、餓死した仲間の骨の髄まですすって生きながらえた男。\n獣のような執着心が宿る。", priestMemo: "そこまでして生きたところで、救助に来た船員を襲って射殺されるのだから世話はない。" },
  { rarity: "Rare", cost: 3, itemName: "『舌を噛み切れ』", originText: "拷問で機密を漏らさぬよう、自ら舌を噛み切り、失血死したスパイ。\n痛みに耐える意志の力。", priestMemo: "その機密とやらは、翌日には時代遅れの情報になっていたがな。無駄な死だ。" },
  { rarity: "Rare", cost: 3, itemName: "『髪が抜けるまで』", originText: "呪いにより、一日一本ずつ髪を抜かれ、最後の一本が抜けた時に狂死した女。\nじわじわと迫る死の恐怖。", priestMemo: "ただの脱毛症に怯えて狂死するとは、人間の精神は脆いものだな。" },
  { rarity: "Rare", cost: 3, itemName: "『内臓が腐る匂い』", originText: "毒を盛られ、自らの内臓が徐々に溶けていく悪臭を嗅ぎながら余命を過ごした王族。", priestMemo: "権力の座につくなら、胃腸薬より解毒剤を常備しておくべきだったな。" },
  { rarity: "Rare", cost: 3, itemName: "『皮膚を剥ぐ快感』", originText: "敵の皮膚を綺麗に剥ぎ取ることに生涯を捧げた猟奇的な革職人。\nその執着が刃物の切れ味を増す。", priestMemo: "剥いだ皮膚で作ったランプシェードは、今もどこかの貴族の館を照らしているらしいぞ。" },
  { rarity: "Rare", cost: 3, itemName: "『燃える肉の匂い』", originText: "火あぶりにされながらも、肉が焼ける匂いを楽しみながら高笑いした魔女。\n狂気が痛覚を麻痺させている。", priestMemo: "焼肉の匂いは食欲をそそるからな。彼女も最後に腹が減っていたのだろう。" },

  // Uncommon (10)
  { rarity: "Uncommon", cost: 2, itemName: "『殴られた跡が消えない』", originText: "夫からの暴力に耐え続け、全身の痣が皮膚と同化してしまった女。\n殴られることへの慣れが防御となる。", priestMemo: "愛されていると錯覚するからそうなる。次は逃げる足を手に入れることだ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『石を噛む味』", originText: "パンを買えず、路傍の石を噛んで飢えを凌いだ浮浪者。\n絶望的な貧困が肉体を強靭にした。", priestMemo: "歯が丈夫なのは良いことだ。だが、石は栄養にはならんぞ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『足首がちぎれそうだ』", originText: "鉄球を繋がれたまま一生を炭鉱で過ごし、足首が壊死して骨が見えていた奴隷。", priestMemo: "鎖から解放された時、彼は一歩も歩けなかった。自由とは残酷なものだな。" },
  { rarity: "Uncommon", cost: 2, itemName: "『胃液が逆流する』", originText: "極度の緊張から毎日嘔吐を繰り返し、胃酸で食道と歯を溶かした暗殺者。", priestMemo: "プレッシャーに弱い暗殺者とは傑作だ。仕事前に吐くのは素人の証だぞ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『息ができない』", originText: "狭い棺桶に生きたまま埋められ、酸欠の暗闇で爪を剥がしながら蓋を掻きむしった男。", priestMemo: "お前の悲鳴は地上には届かなかったが、土の中のミミズには良い子守唄になっただろう。" },
  { rarity: "Uncommon", cost: 2, itemName: "『首の皮一枚』", originText: "処刑人の斧が鈍らだったせいで、首の皮一枚で繋がったまま数時間生き延びた罪人。", priestMemo: "すぐに死ねないのは不幸なことだ。処刑人にはもっと刃を研いでおけと伝えておこう。" },
  { rarity: "Uncommon", cost: 2, itemName: "『血尿が止まらない』", originText: "連日の重労働で内臓を壊し、赤い尿を流しながら笑い続けた炭鉱夫。", priestMemo: "赤いワインが出たなどと喜んでいたらしいな。無知とは幸福なことだ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『凍傷の指先』", originText: "愛娘の幻影を抱きしめたまま凍死した狂人。\nその腕は硬直し、決して解けることはない。", priestMemo: "温かいのはお前の幻覚の中だけだ。現実は、ただの氷の塊にすぎん。" },
  { rarity: "Uncommon", cost: 2, itemName: "『喉が渇いて死ぬ』", originText: "砂漠で道に迷い、自らの尿をすすり、最後は自らの手首を切って血を飲んだ商人。", priestMemo: "金貨は水には変わらない。砂漠で一番価値があるのは、お前の持っていた金ではなく水袋だった。" },
  { rarity: "Uncommon", cost: 2, itemName: "『蛆虫が這う感覚』", originText: "傷口に蛆虫が湧くのを放置し、それが肉を食い破る感覚を楽しみながら腐っていった男。", priestMemo: "彼にとっては、蛆虫も立派なペットだったのだろう。孤独よりはマシか。" },

  // Common (10)
  { rarity: "Common", cost: 1, itemName: "『親指をしゃぶる』", originText: "不安から自分の指をしゃぶり続け、骨が見えるまで肉を削り取った子供。", priestMemo: "甘えん坊も度が過ぎると自傷行為になる。誰か構ってやれ。" },
  { rarity: "Common", cost: 1, itemName: "『まばたきを忘れた』", originText: "敵の影に怯えるあまり、まばたきをせずに目が乾き切って失明した歩哨。", priestMemo: "見開いた目で暗闇を見つめても、恐怖が倍増するだけだ。" },
  { rarity: "Common", cost: 1, itemName: "『膝が笑っている』", originText: "恐怖で足の震えが止まらず、最後は自らの膝の皿をハンマーで砕いて動きを止めた新兵。", priestMemo: "震えを止めるために足を壊すとは。斬新な解決策だが、歩けなくなるぞ。" },
  { rarity: "Common", cost: 1, itemName: "『耳鳴りがうるさい』", originText: "大砲の音で鼓膜が破れ、絶え間ない耳鳴りに発狂して自らの耳にナイフを突き立てた砲兵。", priestMemo: "ナイフを刺しても耳鳴りは脳から消えない。残念だったな。" },
  { rarity: "Common", cost: 1, itemName: "『泥の味がする』", originText: "顔面から泥水に突っ込んだまま絶命し、泥を飲み込み続けた死体。", priestMemo: "泥水は不味いだろう。次はもっと綺麗な川で死ぬことだ。" },
  { rarity: "Common", cost: 1, itemName: "『爪先が痺れる』", originText: "サイズの合わない鉄の靴を履かされ、足の指が壊死しながらも行軍を続けた兵士。", priestMemo: "靴擦れも放置すれば命取りだ。サイズの合う靴を選ぶのは基本中の基本だろう。" },
  { rarity: "Common", cost: 1, itemName: "『歯を食いしばれ』", originText: "激痛に耐えるため歯を食いしばりすぎ、顎の骨を粉砕した男。", priestMemo: "我慢強いのは結構だが、力加減というものを知らないのか。" },
  { rarity: "Common", cost: 1, itemName: "『鼻が曲がる悪臭』", originText: "死体の山の中で息を潜め、腐敗臭を肺いっぱいに吸い込んで狂死した少女。", priestMemo: "死臭は香水より強烈だからな。鼻栓でもしておけばよかったものを。" },
  { rarity: "Common", cost: 1, itemName: "『唾を吐きかけろ』", originText: "迫害され、石を投げられながらも、最後まで群衆に血混じりの唾を吐きかけ続けた異端者。", priestMemo: "その反骨精神は嫌いではない。だが、唾は石には勝てんよ。" },
  { rarity: "Common", cost: 1, itemName: "『ただ、痛い』", originText: "何の意味もなく、ただ通り魔に刺されて路地裏で出血死した名もなき平民。", priestMemo: "人生に意味などない。お前の死にもな。それがこの世界の真理だ。" }
];

const masterPath = 'src/data/memoryMaster.json';
const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

masterData.Physical = physicalItems;

fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2));
console.log('Physical memory items rewritten successfully.');
