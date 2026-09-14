const fs = require('fs');

const magicItems = [
  // Legendary (5)
  { rarity: "Legendary", cost: 5, itemName: "真理を暴いた舌", originText: "世界の理を記述する神の言語を解読し、その一節を口にした途端に全身の穴から光を噴いて消滅した賢者。", priestMemo: "神の秘密を覗き見た対価としては安いものだ。まあ、語るべき口はもう残っていないがね。" },
  { rarity: "Legendary", cost: 5, itemName: "虚空を掴む隻眼", originText: "並行世界の自分を殺して魔力を奪う術式を完成させ、最後は自分自身を認識できなくなり発狂した魔女。", priestMemo: "他者の命を奪うより効率的だ。自分が消えるという些細な副作用に目を瞑れば、だがな。" },
  { rarity: "Legendary", cost: 5, itemName: "星を降らす頭蓋", originText: "頭蓋骨に直接星座の軌道を彫り込み、隕石を降らせる大魔術を行使して自らの国ごと滅ぼした王。", priestMemo: "頭の中の星空はさぞ美しかっただろう。国一つを燃やした花火の代償としては悪くない。" },
  { rarity: "Legendary", cost: 5, itemName: "因果を喰らう胎児", originText: "時間を逆行する呪文を詠唱し続け、ついに自らが生まれる前の胎児の姿にまで退行した大魔導士。", priestMemo: "人生のやり直しを求めた結果がこれだ。無に還る方がよほど幸せだったのではないかね。" },
  { rarity: "Legendary", cost: 5, itemName: "神を灼く灰", originText: "天使を捕獲して解剖し、その内臓を燃やして不老不死の秘薬を錬成しようとした異端審問官の末路。", priestMemo: "神の使いの味はどうだった？永遠の命を得る前に、自分が永遠の灰になってしまったが。" },

  // Epic (10)
  { rarity: "Epic", cost: 4, itemName: "禁忌を綴る血文字", originText: "紙もインクも尽きたため、自らの血液と骨の髄液で魔導書を書き上げ、完成と同時に干からびた狂人。", priestMemo: "そこまでして残した本も、今ではただの焚き付けだ。情熱の行き着く先などそんなものさ。" },
  { rarity: "Epic", cost: 4, itemName: "次元を裂く咆哮", originText: "喉仏に転送魔法陣を埋め込み、声を発するたびに空間を歪ませて敵を切り刻んだ暗殺者。", priestMemo: "歌一つ歌えなくなる人生に何の意味がある？殺しの道具に成り下がった肉体は哀れだな。" },
  { rarity: "Epic", cost: 4, itemName: "思考を溶かす杯", originText: "他者の脳味噌を溶かしてすする事で、一瞬にして数十年分の知識を己の脳裏に焼き付けた学者。", priestMemo: "他人の知恵を借りても、結局お前の脳の容量は変わらん。溢れ出た狂気は拭いておけよ。" },
  { rarity: "Epic", cost: 4, itemName: "夢魔の抜け殻", originText: "夢の中でしか生きられない魔術を自身にかけ、現実の肉体が腐敗していくのを放置した引きこもり。", priestMemo: "現実逃避もそこまで行けば立派な芸術だ。腐った肉の匂いさえ我慢すればだが。" },
  { rarity: "Epic", cost: 4, itemName: "記憶を喰む蟲", originText: "愛する者を失った悲しみを消すため、自らの記憶を貪り食う使い魔を脳内に飼い、全てを忘却した女。", priestMemo: "悲しみを忘れるためなら、自分自身を忘れてもいいのか。人間の感情は本当に非効率的だ。" },
  { rarity: "Epic", cost: 4, itemName: "狂乱のタクト", originText: "空気中のマナを旋律に変える指揮棒を振り続け、観客全員の鼓膜と内臓を破裂させた狂気の音楽家。", priestMemo: "音楽は爆発だと言うが、物理的に爆発させてどうする。最高のフィナーレだったことは認めるがね。" },
  { rarity: "Epic", cost: 4, itemName: "死霊を束ねる指輪", originText: "死者の魂を無理やり繋ぎ合わせて巨大な魔力源としたが、怨念の重みで指ごと引きちぎられた死霊術師。", priestMemo: "死者を道具扱いすれば、しっぺ返しが来るのは当然だ。重力という物理法則を忘れたのかね。" },
  { rarity: "Epic", cost: 4, itemName: "概念を燃やす炎", originText: "物質ではなく「悲しみ」や「痛み」といった概念そのものを燃料にする黒炎を生み出し、自らの精神を焼いた魔術師。", priestMemo: "感情を燃やせば何も感じなくなる。平和なことだ。ただの肉人形になっただけの話だがな。" },
  { rarity: "Epic", cost: 4, itemName: "未来を映す瞳", originText: "一秒先の未来を視るために、眼球の網膜に直接魔方陣を焼き付け、激痛に耐えながら戦った剣士。", priestMemo: "未来が見えたところで、避けられなければ意味がない。激痛のせいで動きが鈍っては本末転倒だ。" },
  { rarity: "Epic", cost: 4, itemName: "空虚を満たす泥", originText: "魔力を使い果たし、それでも呪文を唱え続けた結果、魔力の代わりに自らの内臓を吐き出し続けた老婆。", priestMemo: "そこまでして誰を呪いたかったのか。執念深さは老婆の特権だが、少しは身の程を知れ。" },

  // Rare (15)
  { rarity: "Rare", cost: 3, itemName: "『頭が割れる』", originText: "許容量を超える知識を一度に脳へ注入され、頭蓋骨の縫合線から脳髄が漏れ出しながら死んだ書記官。", priestMemo: "知識は力だが、頭の器が小さすぎたな。知恵熱というには少しばかり物理的すぎるが。" },
  { rarity: "Rare", cost: 3, itemName: "『数字が這い回る』", originText: "宇宙の真理を数式で解き明かそうとし、壁一面に血で数式を書きなぐったまま餓死した数学者。", priestMemo: "計算が合わなかったのか、食費を計算に入れ忘れたのか。天才の考えることは分からんな。" },
  { rarity: "Rare", cost: 3, itemName: "『声が止まない』", originText: "他人の思考を読み取る魔眼を手に入れたが、周囲の悪意を全て受信してしまい、自ら耳を削ぎ落とした男。", priestMemo: "耳を削いでも頭の中に直接響くだろうに。人間の悪意を舐めてはいけないよ。" },
  { rarity: "Rare", cost: 3, itemName: "『色が見えない』", originText: "魔力で視力を強化しすぎた結果、物質の構成粒子しか見えなくなり、色彩と人の顔を失った芸術家。", priestMemo: "究極のリアリズムを追求した結果がこれだ。美しい絵を描くには、適度な盲目が必要なのだよ。" },
  { rarity: "Rare", cost: 3, itemName: "『魔法陣が歪む』", originText: "幾何学的な完璧さを求めるあまり、コンパスの針を自らの掌に突き立てて円を描き続けた修行僧。", priestMemo: "痛みに耐えながら引いた線は、微妙に震えているぞ。完璧主義者の末路としては三流だな。" },
  { rarity: "Rare", cost: 3, itemName: "『詠唱が噛み合わない』", originText: "複雑すぎる呪文を舌を噛まずに唱えるため、自らの舌を三つに切り裂いた魔術見習い。", priestMemo: "努力の方向性が間違っている典型だな。黙って杖を振る練習でもしていればよかったものを。" },
  { rarity: "Rare", cost: 3, itemName: "『影が笑う』", originText: "自分の影に魔力を与えて使い魔にしたが、影に乗っ取られ、暗闇の中で己の影に絞殺された男。", priestMemo: "自分の暗部を実体化させればこうなる。お前の影は、お前よりよほど優秀だったようだな。" },
  { rarity: "Rare", cost: 3, itemName: "『炎が冷たい』", originText: "極低温の炎を生み出す実験の最中、誤って自らを燃やし、凍えながら炭化していった錬金術師。", priestMemo: "矛盾した事象を追求するのは学者の性だが、自らの命で証明しなくてもよかろうに。" },
  { rarity: "Rare", cost: 3, itemName: "『鏡の中の他人』", originText: "分身の術を使いすぎた結果、本体がどれか分からなくなり、互いに殺し合いを始めた分身たち。", priestMemo: "自分自身が一番信用ならないという真理を、身を以て証明してくれたな。" },
  { rarity: "Rare", cost: 3, itemName: "『時間が遅い』", originText: "思考を加速させる魔薬を飲み、体感時間が数千倍になった結果、一瞬の苦痛を永遠に感じ続けた戦士。", priestMemo: "死ぬ瞬間の痛みが数百年続く気分はどうだ？時間操作は素人が手を出すべきではないな。" },
  { rarity: "Rare", cost: 3, itemName: "『空間が裏返る』", originText: "テレポートの座標計算を誤り、内臓と皮膚が完全に裏返しになって出現した空間魔術師。", priestMemo: "内臓の配置は美しいが、それでは少し風邪を引きやすいだろう。次からは慎重に計算したまえ。" },
  { rarity: "Rare", cost: 3, itemName: "『雷が落ちない』", originText: "天候を操る儀式に失敗し、周囲の雷をすべて自らの避雷針の如き杖に集めてしまい黒焦げになった祈祷師。", priestMemo: "神の怒りを一身に引き受けたのだから、祈祷師としては本望だろう。丸焦げの死体だがな。" },
  { rarity: "Rare", cost: 3, itemName: "『呪文を忘れた』", originText: "魔法を放つ直前に記憶障害を起こす呪いを受け、杖を構えたまま敵に殴り殺された哀れな老魔導士。", priestMemo: "ボケる前に引退すべきだったな。杖は殴るための棒ではないのだよ。" },
  { rarity: "Rare", cost: 3, itemName: "『血が沸騰する』", originText: "魔力を血液に直接変換する術式を暴走させ、全身の血が沸騰して蒸気となって破裂した吸血鬼。", priestMemo: "エコな動力源だが、排熱処理を怠ればこうなる。吸血鬼が火傷で死ぬとは笑い話にもならん。" },
  { rarity: "Rare", cost: 3, itemName: "『重力が上に向かう』", originText: "重力反転の呪文を自分自身にかけてしまい、空の彼方へ落ちていった浮遊魔術師の最後の絶望。", priestMemo: "星になった男、か。ロマンチックだが、酸素がなくなってからの苦しみは想像を絶するだろうな。" },

  // Uncommon (10)
  { rarity: "Uncommon", cost: 2, itemName: "『字が読めない』", originText: "魔導書のインクの毒性にやられ、視力と知能を徐々に失いながらもページをめくり続けた学徒。", priestMemo: "読書も命懸けとなると立派なものだが、毒入りインクを使う著者の悪趣味を恨むんだな。" },
  { rarity: "Uncommon", cost: 2, itemName: "『杖が重い』", originText: "魔力を吸い取る呪いの杖を握ってしまい、手を離すこともできずミイラ化した見習い。", priestMemo: "他人のものを勝手に触るからそうなる。良い教訓になっただろう。" },
  { rarity: "Uncommon", cost: 2, itemName: "『火の粉が熱い』", originText: "初めて成功した火の玉魔法の美しさに見とれ、回避を忘れて自らの顔面を焼いた新米魔術師。", priestMemo: "自らの才能に見惚れて死ぬ。ある意味で、最も幸福な最期と言えるかもしれないな。" },
  { rarity: "Uncommon", cost: 2, itemName: "『水に溺れる幻覚』", originText: "水責めの幻術をかけられ、陸にいながらにして肺を水で満たされたと錯覚し、窒息死した兵士。", priestMemo: "人間の脳は簡単に騙される。実際には一滴の水もないのに溺れ死ぬとは、滑稽な生き物だ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『砂が目に入る』", originText: "砂嵐を起こす魔法の制御に失敗し、自らの目と肺を砂で満たしてしまった三流の風使い。", priestMemo: "風を読む前に自分の立ち位置を読むべきだったな。自業自得という言葉がよく似合う。" },
  { rarity: "Uncommon", cost: 2, itemName: "『石に変わる足』", originText: "石化の呪いの進行を遅らせるため、自分の足を自分で切り落とそうとして失血死した男。", priestMemo: "石になるか、血を流し尽くすか。究極の選択だったな。どちらにせよ死ぬ運命だったが。" },
  { rarity: "Uncommon", cost: 2, itemName: "『呪符が剥がれない』", originText: "悪霊除けの呪符を全身に糊付けし、皮膚呼吸ができなくなって死んだ妄想狂。", priestMemo: "悪霊からは守られたかもしれないが、窒息からは守ってくれなかったようだな。" },
  { rarity: "Uncommon", cost: 2, itemName: "『幻の金貨』", originText: "鉛を金に変える錬金術が成功したと錯覚し、鉛の塊を飲み込んで重金属中毒で死んだ詐欺師。", priestMemo: "自らの嘘に騙される詐欺師。才能がないのか、ある意味で天才なのか。判断に迷うところだ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『星が囁く』", originText: "宇宙のノイズをテレパシーと勘違いし、アルミ箔で頭を包んだまま衰弱死した隠遁者。", priestMemo: "星は何も語らない。お前の頭の中の虫が鳴いていただけであろうよ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『闇が怖い』", originText: "光を生み出す魔法しか使えず、暗闇の恐怖から永遠に魔法を放ち続けて餓死した臆病者。", priestMemo: "暗闇より怖いのは、飢えと孤独だということに気づけなかったようだな。" },

  // Common (10)
  { rarity: "Common", cost: 1, itemName: "『火が点かない』", originText: "凍える冬の夜、指先の火起こし魔法すら失敗し続け、絶望の中で凍死した浮浪者。", priestMemo: "マッチ一本あれば助かった命だ。魔法などという不確かなものに頼るからそうなる。" },
  { rarity: "Common", cost: 1, itemName: "『杖の破片が刺さる』", originText: "安物の魔導杖に過剰な魔力を込めて暴発させ、木片が眼球に突き刺さって死んだ馬鹿。", priestMemo: "道具は正しく使えと教わらなかったか？安物買いの銭失い、いや命失いだな。" },
  { rarity: "Common", cost: 1, itemName: "『計算が合わない』", originText: "簡単なポーションの調合分量を間違え、鍋ごと爆発に巻き込まれた見習い錬金術師。", priestMemo: "算数からやり直してこい。まあ、やり直す命はもう残っていないがね。" },
  { rarity: "Common", cost: 1, itemName: "『文字が滲む』", originText: "徹夜で魔導書を読み漁り、過労で心臓が停止して本の上に突っ伏した学生。", priestMemo: "勉強熱心なのは良いことだが、死んでしまっては学位は取れんぞ。" },
  { rarity: "Common", cost: 1, itemName: "『水晶球が割れる』", originText: "自分の悲惨な未来を水晶球に視てしまい、絶望のあまり水晶球に頭を叩きつけて死んだ占い師。", priestMemo: "未来を変える努力をする前に諦めるとは。占い師としては三流、人間としても底辺だな。" },
  { rarity: "Common", cost: 1, itemName: "『呪文を噛む』", originText: "敵を前にして詠唱を噛み、恥ずかしさで硬直している隙に首を刎ねられた魔術師。", priestMemo: "滑舌の悪さが命取りになるとは。早口言葉の練習を怠った報いだな。" },
  { rarity: "Common", cost: 1, itemName: "『帽子が風で飛ぶ』", originText: "強風を操ろうとして失敗し、大切な三角帽子が飛ばされたショックで心不全を起こした老人。", priestMemo: "帽子一つで死ぬとは。どれだけ薄っぺらいプライドを持っていたのだ？" },
  { rarity: "Common", cost: 1, itemName: "『指がつる』", originText: "複雑な印を結ぼうとして指がつり、激痛でのたうち回っている間に野犬に食われた男。", priestMemo: "準備運動を怠るからそうなる。野犬の餌になるために印を結んだようなものだ。" },
  { rarity: "Common", cost: 1, itemName: "『マントが引っかかる』", originText: "逃走中に長すぎるマントが木の枝に引っかかり、そのまま追手に串刺しにされた魔法使い。", priestMemo: "見栄を張って長いマントを着るからだ。実用性を重んじない愚か者の末路だな。" },
  { rarity: "Common", cost: 1, itemName: "『何も起こらない』", originText: "自分には隠された魔力があると信じ込み、一生涯呪文を叫び続けたが、ただの一般人だった男。", priestMemo: "狂気の中では幸せだったのだろう。現実を見ずに死ねたのだからな。" }
];

const masterPath = 'src/data/memoryMaster.json';
const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

masterData.Magic = magicItems;

fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2));
console.log('Magic memory items rewritten successfully.');
