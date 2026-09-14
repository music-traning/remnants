const fs = require('fs');

const supportItems = [
  // Legendary (5)
  { rarity: "Legendary", cost: 5, itemName: "運命を騙す賽", originText: "自らの死の運命を回避するため、死神とサイコロ勝負をしてイカサマを働き、永遠の逃亡者となった詐欺師。", priestMemo: "死神を騙す手腕は見事だが、一生背後を気にして生きる羽目になったな。最高の喜劇だ。" },
  { rarity: "Legendary", cost: 5, itemName: "時を喰らう靴", originText: "誰よりも速く走るため、周囲の時間を削り取って推進力に変える靴を履き、自分以外の全てを停止させた暗殺者。", priestMemo: "自分以外が止まった世界で、彼はいったい誰を殺したかったのだろうな。" },
  { rarity: "Legendary", cost: 5, itemName: "影を縫う短剣", originText: "他者の影を地面に縫い付けて動きを封じる術を極めたが、自らの影に裏切られて暗闇に引きずり込まれた盗賊王。", priestMemo: "他人の足を引っ張る者は、いつか自分の足元をすくわれる。影とは正直なものだ。" },
  { rarity: "Legendary", cost: 5, itemName: "因果律の抜け穴", originText: "過去の失敗をやり直すため、因果の糸を切り刻み続け、自分が存在したという歴史そのものを消滅させた賢者。", priestMemo: "失敗のない人生を求めて、人生そのものを消すとは。究極の潔癖症だな。" },
  { rarity: "Legendary", cost: 5, itemName: "全能の観測者", originText: "世界のあらゆる事象を同時に把握する第三の目を開眼し、情報量に耐えきれず脳がゼリー状に溶けた予言者。", priestMemo: "全てを知るということは、全てを抱え込むということだ。ゼリーになっても世界は見えているかね？" },

  // Epic (10)
  { rarity: "Epic", cost: 4, itemName: "肉を捨てる跳躍", originText: "迫り来る巨大な魔獣から逃れるため、自らの両腕と内臓を切り捨てて身軽になり、空へ跳躍した斥候。", priestMemo: "見事な跳躍だったが、着地するための足も切り捨てていたのは計算違いだったな。" },
  { rarity: "Epic", cost: 4, itemName: "神経を編む糸", originText: "敵の動きを先読みするため、自らの神経系を引きずり出して周囲に張り巡らせ、風のそよぎで激痛を感じて死んだ密偵。", priestMemo: "センサーとしては超一流だが、受信機が先に壊れては意味がない。" },
  { rarity: "Epic", cost: 4, itemName: "忘却の香炉", originText: "自らの存在を他人の記憶から消し去る香を焚き続け、最終的に自分自身の名前さえ思い出せなくなったスパイ。", priestMemo: "完璧な隠密行動だ。誰にも覚えられていないのだから、死んだことすら誰にも気づかれない。" },
  { rarity: "Epic", cost: 4, itemName: "未来を縛る鎖", originText: "敵の攻撃を避けるため、数秒先の自分の肉体を鎖で引っ張る術を編み出し、現在と未来の自分が引き合って胴体がちぎれた剣士。", priestMemo: "時間軸を物理的に引っ張るなど、狂気の沙汰だ。見事に自分自身に殺されたな。" },
  { rarity: "Epic", cost: 4, itemName: "嘘を吐く舌", originText: "どんな虚言も真実と思い込ませる話術を持っていたが、自らの「俺は死なない」という嘘に体が騙され、腐敗しながら生き続けた詐欺師。", priestMemo: "嘘も方便と言うが、自分の細胞まで騙すとは恐れ入る。臭いから早く土に還れ。" },
  { rarity: "Epic", cost: 4, itemName: "視線を逸らす鏡", originText: "絶対に他者と目が合わなくなる呪いの鏡を覗き込み、誰からも認識されず餓死した臆病者。", priestMemo: "誰も自分を見てくれないというのは、平和だが孤独だ。彼が望んだ平穏の形さ。" },
  { rarity: "Epic", cost: 4, itemName: "痛覚のパントマイム", originText: "自分への攻撃を他人に錯覚させる術を使いすぎ、幻の痛みに脳が耐えきれずショック死した奇術師。", priestMemo: "観客を騙すのは良いが、自分の脳まで騙してどうする。最高のエンターテイナーだな。" },
  { rarity: "Epic", cost: 4, itemName: "運を前借りするコイン", originText: "一生分の幸運を一度の賭けに注ぎ込み大勝したが、その直後に階段から落ちて首を折ったギャンブラー。", priestMemo: "幸運の総量は決まっている。使い切ればあとは不幸しか残っていないのだよ。" },
  { rarity: "Epic", cost: 4, itemName: "気配を消す泥", originText: "完全に自然と同化するため、全身の毛穴から特殊な泥を分泌し続け、最後は本物の泥人形になって砕けた暗殺者。", priestMemo: "見事な迷彩だ。ただ、雨の日に決行したのは大きなミスだったな。" },
  { rarity: "Epic", cost: 4, itemName: "反転する重力", originText: "落下する味方を救うため重力を反転させたが、自分だけが空の彼方へ落ちていった風使い。", priestMemo: "ヒーロー気取りの末路だ。空の上の空気の薄さを存分に味わっただろうよ。" },

  // Rare (15)
  { rarity: "Rare", cost: 3, itemName: "『足音を消してくれ』", originText: "追手から逃れるため、自らの足の裏の皮をすべて削ぎ落とし、血まみれの肉球で走り続けた逃亡者。", priestMemo: "足音は消えたが、血の跡がくっきりと残っていたぞ。間抜けな逃亡劇だ。" },
  { rarity: "Rare", cost: 3, itemName: "『後ろを見るな』", originText: "振り向くと塩の柱になる呪いを受け、決して背後を見ないよう首の骨をボンドで固めた罪人。", priestMemo: "前しか見えない人生というのも息苦しかろう。結局、前から来た馬車に轢かれたがな。" },
  { rarity: "Rare", cost: 3, itemName: "『息を殺せ』", originText: "敵に見つからないよう三日間息を止め、そのまま肺細胞が壊死して絶命した狙撃手。", priestMemo: "見つからなかったのは素晴らしい。死体は誰にも邪魔されず自然に還っていったよ。" },
  { rarity: "Rare", cost: 3, itemName: "『目立つのは嫌だ』", originText: "周囲に溶け込む魔法を自身にかけすぎた結果、体が透明を通り越して物質界から消滅した男。", priestMemo: "見事に誰の記憶からも消え去った。究極の隠キャというやつだな。" },
  { rarity: "Rare", cost: 3, itemName: "『誰か身代わりに』", originText: "危機に陥るたびに他人に不幸をなすりつけ続けたが、周囲に誰もいなくなり、自分の罠にかかって死んだ悪党。", priestMemo: "身代わりがいなければ自分が死ぬ。単純な引き算すらできなくなったか。" },
  { rarity: "Rare", cost: 3, itemName: "『逃げ道はどこだ』", originText: "迷宮の出口を探すあまり、壁に頭を打ち付けて道を作ろうとし、頭蓋骨を砕いた探索者。", priestMemo: "頭を使えとは言うが、物理的に使ってどうする。血まみれの壁は良い道しるべになったぞ。" },
  { rarity: "Rare", cost: 3, itemName: "『罠にかかったのは誰？』", originText: "完璧なトラップを仕掛けたことに満足し、数日後に自分でその罠を踏んで真っ二つになった猟師。", priestMemo: "自慢の罠の威力を身をもって証明したな。職人魂には感服するよ。" },
  { rarity: "Rare", cost: 3, itemName: "『運が尽きた』", originText: "常にコイントスで行動を決めていたが、コインが縁で立った瞬間にフリーズして餓死した狂人。", priestMemo: "確率のバグに対応できなかったか。人生はコインの表裏だけではないのだよ。" },
  { rarity: "Rare", cost: 3, itemName: "『鍵が開かない』", originText: "絶対に開かない金庫の鍵を一生かけてピッキングし続け、開いた瞬間に中に入っていた毒ガスで死んだ泥棒。", priestMemo: "開かないものには理由がある。開けてはいけない箱だっただけのことだ。" },
  { rarity: "Rare", cost: 3, itemName: "『靴紐が解けた』", originText: "逃走劇の最中に靴紐が解け、それを結び直そうと立ち止まった瞬間に矢を脳天に受けた兵士。", priestMemo: "几帳面なのは良いことだが、時と場所を選べ。裸足で走る勇気が必要だったな。" },
  { rarity: "Rare", cost: 3, itemName: "『少しだけ待って』", originText: "敵の情けにすがり「少しだけ待ってくれ」と懇願し続けたが、舌を抜かれて待たれずに殺された男。", priestMemo: "待ってくれるのは優しい母親だけだ。戦場で言葉が通じると思うな。" },
  { rarity: "Rare", cost: 3, itemName: "『匂いでバレる』", originText: "体臭を消すために香辛料を全身に塗りたくり、その強烈な匂いのせいで敵の猟犬にすぐ見つかった逃亡奴隷。", priestMemo: "臭いを臭いで消そうとする浅はかさ。犬の嗅覚を舐めるからそうなる。" },
  { rarity: "Rare", cost: 3, itemName: "『光から逃げろ』", originText: "影の中しか移動できない呪いを受け、日の出と共に影が消え、太陽光で灰になった吸血鬼の眷属。", priestMemo: "夜明けの時間を計算し忘れたか。時間にルーズな奴は長生きできないぞ。" },
  { rarity: "Rare", cost: 3, itemName: "『指先が震える』", originText: "極度の緊張から鍵開けの際に指が震え、トラップのワイヤーを引きちぎって爆死した盗賊。", priestMemo: "プレッシャーに弱い盗賊とは滑稽だ。泥棒も楽な商売ではないな。" },
  { rarity: "Rare", cost: 3, itemName: "『壁になりたい』", originText: "恐怖のあまり壁のシミと同化する魔術を使い、そのまま二度と人間に戻れなくなった隠密。", priestMemo: "立派なシミになったな。今度、ペンキで上塗りしてやろう。" },

  // Uncommon (10)
  { rarity: "Uncommon", cost: 2, itemName: "『見つかりませんように』", originText: "かくれんぼの途中でタルの中に隠れ、そのまま誰にも見つけてもらえず餓死した子供。", priestMemo: "隠れんぼの天才だな。だが、ゲームには終わりが必要だということを誰も教えてやらなかったのか。" },
  { rarity: "Uncommon", cost: 2, itemName: "『逃げるが勝ちだ』", originText: "戦いから逃げ続け、ついに世界の果ての崖に追い詰められて足を滑らせた脱走兵。", priestMemo: "逃げた先に楽園はない。崖の下の冷たい海が彼を優しく迎えてくれただろう。" },
  { rarity: "Uncommon", cost: 2, itemName: "『靴擦れが痛い』", originText: "新しい革靴で戦場に出た結果、靴擦れの痛みに耐えきれず歩みを止め、背中から刺された新兵。", priestMemo: "オシャレは我慢だと言うが、命を懸けてまで履くべき靴ではなかったな。" },
  { rarity: "Uncommon", cost: 2, itemName: "『あと五分だけ』", originText: "敵の夜襲を告げる鐘の音を聞きながら、「あと五分だけ」と二度寝して寝首を掻かれた見張り。", priestMemo: "永遠の眠りにつけたのだから、彼の願いは叶ったと言える。" },
  { rarity: "Uncommon", cost: 2, itemName: "『誰も信じない』", originText: "味方すら疑い、誰もいない密室に引きこもって、自ら仕掛けた毒の罠で死んだ偏執狂。", priestMemo: "誰も信じないなら、自分自身すら信じるべきではなかったな。" },
  { rarity: "Uncommon", cost: 2, itemName: "『足がもつれる』", originText: "全力疾走の最中に自分の足に躓き、顔面から石畳に突っ込んで首の骨を折った配達人。", priestMemo: "急ぐあまり自分の足に殺されるとは。鈍臭いにも程がある。" },
  { rarity: "Uncommon", cost: 2, itemName: "『方向音痴の末路』", originText: "西へ逃げるつもりが、完全に方角を間違えて敵の本陣のど真ん中に突撃してしまった斥候。", priestMemo: "コンパスの一つも持っていなかったのか。敵の将軍もさぞ驚いたことだろう。" },
  { rarity: "Uncommon", cost: 2, itemName: "『忘れ物をした』", originText: "安全圏まで逃げ延びたのに、お守りを落としたことに気づいて引き返し、殺された農民。", priestMemo: "命より大事なお守りか。結局、そのお守りは彼を守ってくれなかったようだが。" },
  { rarity: "Uncommon", cost: 2, itemName: "『声が裏返る』", originText: "助けを呼ぼうとした瞬間に声が裏返り、敵に居場所を教えるだけの悲鳴となってしまった村娘。", priestMemo: "悲劇のヒロインを演じるなら、もっと腹式呼吸を練習すべきだったな。" },
  { rarity: "Uncommon", cost: 2, itemName: "『隠し事の重み』", originText: "機密文書を隠した靴底が重すぎて、川を渡る際に溺れ死んだスパイ。", priestMemo: "秘密は水より重かったか。魚たちには良い読み物になるだろうよ。" },

  // Common (10)
  { rarity: "Common", cost: 1, itemName: "『これが人生というものか』", originText: "ただひたすらに理不尽な不幸が重なり続け、空を仰いでため息をついた瞬間に隕石に当たった男。", priestMemo: "完璧なオチだ。コメディとしては一流の人生だったと褒めてやろう。" },
  { rarity: "Common", cost: 1, itemName: "『ちょっと転んだだけ』", originText: "何もない平坦な道で転び、打ち所が悪くてそのまま絶命した不運な村人。", priestMemo: "人間の命など、石ころ一つで終わる。その程度のものなのだよ。" },
  { rarity: "Common", cost: 1, itemName: "『財布を落とした』", originText: "全財産を入れた財布をスリにすられ、ショックで心臓が停止した守銭奴。", priestMemo: "金への執着が強すぎると、心臓が硬貨でできていると錯覚するらしいな。" },
  { rarity: "Common", cost: 1, itemName: "『お腹が痛い』", originText: "賞味期限の切れた干し肉を食べ、強烈な腹痛にのたうち回りながら死んだゴブリン討伐者。", priestMemo: "ゴブリンの剣より、自分の胃袋に殺されるとは。食中毒を甘く見るな。" },
  { rarity: "Common", cost: 1, itemName: "『犬に噛まれた』", originText: "狂犬病の犬に手を噛まれ、発症して水を極端に恐れながら泡を吹いて死んだ浮浪者。", priestMemo: "犬も必死だったのだろう。水への恐怖で狂い死ぬのは、さぞ不快だったろうな。" },
  { rarity: "Common", cost: 1, itemName: "『ハチに刺された』", originText: "森で用を足している最中にスズメバチに刺され、アナフィラキシーショックで死んだ木こり。", priestMemo: "ズボンを下ろしたまま死ぬのは、男としての尊厳に大きく関わる問題だ。" },
  { rarity: "Common", cost: 1, itemName: "『雷が怖い』", originText: "雷鳴に驚いて木から落ち、自らの持っていた斧の刃の上に落下した木こりの見習い。", priestMemo: "雷より斧の方がよほど怖いということを、死ぬ瞬間に学んだだろう。" },
  { rarity: "Common", cost: 1, itemName: "『鳥のフンが落ちてきた』", originText: "見上げた瞬間に鳥のフンが目に入り、パニックになって崖から落ちた旅人。", priestMemo: "運が付いたと言うべきか。まあ、落ちた先は地獄だったようだが。" },
  { rarity: "Common", cost: 1, itemName: "『階段を踏み外す』", originText: "暗闇で階段の一段目を踏み外し、そのまま首の骨を折って死んだ酒飲み。", priestMemo: "酔っ払いの末路としては王道だな。酒場での語り草にはなるだろう。" },
  { rarity: "Common", cost: 1, itemName: "『ただ、運が悪かった』", originText: "特に何もしていないのに、なぜか周囲のあらゆる不幸を引き寄せて死んだ名もなき平民。", priestMemo: "理由のない不幸もある。世界は公平ではないのだから、諦めるしかないさ。" }
];

const masterPath = 'src/data/memoryMaster.json';
const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

masterData.Support = supportItems;

fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2));
console.log('Support memory items rewritten successfully.');
