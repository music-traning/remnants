const fs = require('fs');

const healingItems = [
  // Legendary (5)
  { rarity: "Legendary", cost: 5, itemName: "万物を産む肉壺", originText: "疫病に苦しむ民を救うため、自らの肉を無限に増殖させ切り分けさせた聖女のなれの果て。", priestMemo: "無限の肉とは便利なものだ。だが、民は病が治った後もその肉の味が忘れられなかったらしいぞ。" },
  { rarity: "Legendary", cost: 5, itemName: "血を分かつ聖杯", originText: "干ばつの村で、自らの血液を水に変える奇跡を起こし、干からびて死んだ神父の記憶。", priestMemo: "血を水に変える奇跡か。村人はその後、ただの水を飲んでも鉄の味がすると嘆いたそうだ。" },
  { rarity: "Legendary", cost: 5, itemName: "永遠を縛る産声", originText: "死産した我が子を蘇らせるため、自分の寿命を完全に逆転させ、赤子の代わりに土へ還った母。", priestMemo: "等価交換の法則だよ。だが蘇った赤子が、その後どう育ったかはお前も知るまい。" },
  { rarity: "Legendary", cost: 5, itemName: "慈悲深き断頭台", originText: "苦痛に満ちた生を送る患者たちを救うため、苦しみを感じる前に全てを斬首して回った狂医。", priestMemo: "死ねば病気の苦しみからは解放される。ある意味で最高の特効薬だ。倫理は死ぬがね。" },
  { rarity: "Legendary", cost: 5, itemName: "神を食らう胃袋", originText: "世界中の毒を自らの体内に納めるため、猛毒の沼を飲み干して内臓から溶け落ちた救世主。", priestMemo: "毒を飲み干したところで、人間の心に湧く毒までは飲み込めなかったようだな。" },

  // Epic (10)
  { rarity: "Epic", cost: 4, itemName: "痛みを喰らう面", originText: "他者の傷口を舐めることで、その傷を自らの肉体へ転移させ、全身腐爛して死んだ修行僧。", priestMemo: "他人の痛みなど背負うものではない。自分の痛みすら処理できないのが人間という生き物だ。" },
  { rarity: "Epic", cost: 4, itemName: "涙を編む糸", originText: "戦死した息子を思い泣き続け、その涙腺から血が枯れるまで涙を流し続けて石化した老婆。", priestMemo: "石になればもう泣かずに済む。悲しみを物理的に克服した素晴らしい事例だな。" },
  { rarity: "Epic", cost: 4, itemName: "祈りを釘打つ手", originText: "祈りが天に届かぬ絶望から、両手を合わせて太い鉄釘で貫き、永遠の祈りの姿勢を保った教徒。", priestMemo: "手が離れなくなっただけで、心が神に向かっているわけではない。滑稽なパフォーマンスだ。" },
  { rarity: "Epic", cost: 4, itemName: "骨を砕く子守唄", originText: "凍死寸前の赤子を温めるため、自らの骨を砕いて摩擦熱を起こし、抱きしめたまま事切れた男。", priestMemo: "摩擦熱で温まる前に内出血で死ぬ。理科の成績が悪かった男の哀れな末路だ。" },
  { rarity: "Epic", cost: 4, itemName: "太陽を盗む眼", originText: "地下の民に光を与えるため、地上で太陽を直視し続け、両目に光を宿したまま盲目となった娘。", priestMemo: "眼球を光らせても地下は照らせない。ただの不気味な照明器具に成り下がっただけだ。" },
  { rarity: "Epic", cost: 4, itemName: "肉を紡ぐ縫い針", originText: "引き裂かれた恋人の死体を縫い合わせるため、自分の髪の毛を糸にして命を編み込んだ少女。", priestMemo: "フランケンシュタインも真っ青の執念だが、縫い合わせた肉はただ腐るだけだと知るべきだった。" },
  { rarity: "Epic", cost: 4, itemName: "罪を洗う酸", originText: "己の罪の意識に耐えきれず、皮膚を溶かす強酸の川で身を清めようとして骨だけになった罪人。", priestMemo: "確かに皮膚ごと罪は消え去ったな。骨まで綺麗になったのだから、神も許してくださるだろう。" },
  { rarity: "Epic", cost: 4, itemName: "夢を喰らう獏", originText: "悪夢にうなされる子供を救うため、自らの脳を悪夢の苗床にして発狂死した父親。", priestMemo: "子供の夢は守られたが、父親が狂人になる現実の方がよほど子供にとっては悪夢だろうに。" },
  { rarity: "Epic", cost: 4, itemName: "心臓を捧げる祭壇", originText: "豊穣の神を呼び寄せるため、自らの胸を裂いて心臓を取り出し、脈打つ間に大地に埋めた神官。", priestMemo: "肥料としては優秀かもしれないが、豊穣の神とやらが肉食だとは聞いたことがないな。" },
  { rarity: "Epic", cost: 4, itemName: "泥を練る息吹", originText: "壊れた土人形に命を吹き込もうと、三日三晩息を吹き込み続け、過呼吸で肺が破裂した魔術師。", priestMemo: "肺活量を鍛えてから出直すべきだったな。土人形は今も冷たいままだよ。" },

  // Rare (15)
  { rarity: "Rare", cost: 3, itemName: "『傷口が痒い』", originText: "治りかけの傷の痒みに耐えきれず、自らの肉を骨が見えるまで掻き毟って出血死した男。", priestMemo: "治りかけが一番痒いと言うからな。少しの我慢が足りなかっただけで命を落とすとは。" },
  { rarity: "Rare", cost: 3, itemName: "『包帯が足りない』", originText: "全身の火傷を隠すため、家中の布を巻きつけ、最後はシーツに包まったままミイラ化した女。", priestMemo: "見られたくないという自意識が命を奪った。美意識とは時に毒より厄介だ。" },
  { rarity: "Rare", cost: 3, itemName: "『薬が苦い』", originText: "特効薬の苦味に耐えられず、砂糖を大量に混ぜて飲んだ結果、薬効が失われて病死した子供。", priestMemo: "良薬口に苦し。甘いだけの人生など存在しないという真理を、身をもって学んだようだな。" },
  { rarity: "Rare", cost: 3, itemName: "『血が止まらない』", originText: "小さな切り傷から血が止まらず、一滴残らず体内の血液が流れ出ていくのを静かに見つめた貴族。", priestMemo: "血友病の家系か。青き血の貴族様も、流れる血は赤かったようで何よりだ。" },
  { rarity: "Rare", cost: 3, itemName: "『眠りが浅い』", originText: "不眠症に悩み、睡眠薬の代わりに致死量の毒をあおり、ついに永遠の眠りを手に入れた商人。", priestMemo: "最高の睡眠薬だな。二度と起きる心配がないのだから、不眠症は完全に治ったと言える。" },
  { rarity: "Rare", cost: 3, itemName: "『体温が下がる』", originText: "雪山で遭難し、凍える体を温めようと自分の衣服を燃やし、最後は素っ裸で凍死した登山家。", priestMemo: "火の温もりは一瞬、凍える時間は永遠。先を読む力が少しばかり足りなかったな。" },
  { rarity: "Rare", cost: 3, itemName: "『息がくさい』", originText: "内臓の腐敗による口臭を気にして、香水をがぶ飲みし、アルコール中毒で胃が破裂した娼婦。", priestMemo: "香水は外から振るものだ。内面まで美しくなろうという心意気だけは買ってやろう。" },
  { rarity: "Rare", cost: 3, itemName: "『心臓がうるさい』", originText: "静寂を求めるあまり、自らの鼓動が煩わしくなり、胸に杭を打ち込んで沈黙を得た修道士。", priestMemo: "生きている証を騒音と感じるとは。お前の神も、さぞ呆れていることだろう。" },
  { rarity: "Rare", cost: 3, itemName: "『髪が抜ける』", originText: "病の進行で髪が抜ける恐怖から、自分の頭皮を接着剤で固め、皮膚呼吸ができず死んだ女優。", priestMemo: "美しさへの執着が醜い死を生む。皮肉な喜劇のヒロインとしては満点だ。" },
  { rarity: "Rare", cost: 3, itemName: "『爪が伸びる』", originText: "新陳代謝が異常に早まる奇病にかかり、伸び続ける爪が自らの肉を貫いて死んだ労働者。", priestMemo: "爪切りを買う金すら無かったのか。労働の対価としては安すぎるな。" },
  { rarity: "Rare", cost: 3, itemName: "『喉が渇く』", originText: "砂漠でオアシスの幻影を追いかけ、最後は砂を水だと思い込んで腹一杯に詰め込んだ旅人。", priestMemo: "砂は水分を吸うからな。余計に喉が渇いたまま死んでいったのだろう。" },
  { rarity: "Rare", cost: 3, itemName: "『光が眩しい』", originText: "長年の地下牢生活の後、解放された日に太陽の光を浴びてショック死した囚人。", priestMemo: "自由の光は強すぎたか。暗闇でしか生きられない虫もいるのだよ。" },
  { rarity: "Rare", cost: 3, itemName: "『音が消えない』", originText: "耳鳴りを消すため、大砲の銃口に頭を突っ込み、轟音と共に頭を吹き飛ばした砲兵。", priestMemo: "確かに耳鳴りは消えた。頭ごと物理的にな。見事な問題解決能力だ。" },
  { rarity: "Rare", cost: 3, itemName: "『肉が腐る』", originText: "不治の病により自分の体が少しずつ腐っていくのを、毎日鏡の前で記録し続けた学者。", priestMemo: "死の観察記録としては一級品だが、最後に自分の目玉が腐り落ちる瞬間はどう記録したのかな？" },
  { rarity: "Rare", cost: 3, itemName: "『祈りが届かない』", originText: "神像の前で百日間絶食して祈り続けたが、結局神は現れず、餓死した狂信者。", priestMemo: "神はお前のダイエットに興味は無い。飯を食ってから祈ればよかったものを。" },

  // Uncommon (10)
  { rarity: "Uncommon", cost: 2, itemName: "『絆創膏が剥がれない』", originText: "傷が治った後も絆創膏を剥がすのを極度に恐れ、その下で肉が壊死して敗血症で死んだ子供。", priestMemo: "過保護の末路だな。小さな痛みを避けた結果、最大の苦痛を迎えるとは。" },
  { rarity: "Uncommon", cost: 2, itemName: "『うがい薬を飲む』", originText: "体内のバイ菌を消毒しようと、大量のうがい薬を飲み干して胃粘膜を破壊された潔癖症。", priestMemo: "体内は綺麗になっただろうが、生き物としての機能も一緒に消毒されてしまったな。" },
  { rarity: "Uncommon", cost: 2, itemName: "『湿布が冷たい』", originText: "全身の筋肉痛を治すため、体に百枚の湿布を貼り付け、低体温症で凍死した肉体労働者。", priestMemo: "筋肉の熱は引いたが、命の炎まで消してしまっては意味がない。" },
  { rarity: "Uncommon", cost: 2, itemName: "『松葉杖が折れる』", originText: "折れた松葉杖の破片が動脈に刺さり、病院の目の前で失血死した不運な怪我人。", priestMemo: "運が悪いとしか言いようがない。神も時折、こういう悪趣味なイタズラをする。" },
  { rarity: "Uncommon", cost: 2, itemName: "『ギプスが重い』", originText: "骨折を治すため全身を石膏で固められ、重みで呼吸ができず窒息死した患者。", priestMemo: "骨は完璧に固定されただろうが、肺まで固定されては生きられない。" },
  { rarity: "Uncommon", cost: 2, itemName: "『点滴が漏れる』", originText: "栄養剤の点滴が血管から漏れ、腕が風船のように膨れ上がった恐怖で心臓麻痺を起こした男。", priestMemo: "栄養の摂りすぎだな。ビビりすぎて死ぬとは、栄養剤も形無しだ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『注射針が怖い』", originText: "注射の恐怖から逃げ出し、階段から転げ落ちて首の骨を折った臆病者。", priestMemo: "注射針より階段の角の方が痛かっただろう。臆病者の喜劇だ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『ベッドから落ちる』", originText: "悪夢から逃れようと寝返りを打ち、二段ベッドの上から落下して脳挫傷で死んだ子供。", priestMemo: "夢の中の怪物より、現実の重力の方が確実に命を奪うということだ。" },
  { rarity: "Uncommon", cost: 2, itemName: "『毛布が重い』", originText: "寒さをしのぐため数十枚の毛布を被り、その重圧で胸が潰れて圧死した老人。", priestMemo: "暖かさと引き換えに圧殺されるとは。貧乏人の工夫は時に命取りになる。" },
  { rarity: "Uncommon", cost: 2, itemName: "『枕が合わない』", originText: "首の痛みに悩み、石の枕で寝てみた結果、寝返りを打って頭蓋骨を割った男。", priestMemo: "硬い枕が良いとは言うが、石はやりすぎだ。永遠の眠りには最適な枕だったようだが。" },

  // Common (10)
  { rarity: "Common", cost: 1, itemName: "『少し休ませて』", originText: "過酷な労働の合間に、木陰で十分だけ眠ろうとして、そのまま二度と目を覚まさなかった農夫。", priestMemo: "永遠の十分間だな。最高の休息を手に入れた彼を羨むべきかもしれない。" },
  { rarity: "Common", cost: 1, itemName: "『お腹が空いた』", originText: "三日三晩何も食べられず、最後は自分の泥だらけの靴を齧りながら餓死した孤児。", priestMemo: "革靴は煮込まないと硬くて食えないぞ。知識の欠如が死を早めたな。" },
  { rarity: "Common", cost: 1, itemName: "『明日も早いから』", originText: "明日も過労の仕事が待っている恐怖から、自ら首に縄をかけて「早退」した平民。", priestMemo: "仕事からの最高の逃避行だ。無断欠勤には違いないが、誰も怒るまい。" },
  { rarity: "Common", cost: 1, itemName: "『風邪を引いた』", originText: "ただの風邪だと高を括り、大雨の中で労働を続けて肺炎で呆気なく死んだ男。", priestMemo: "己の体力を過信した愚か者。風邪は万病の元と言うだろう？" },
  { rarity: "Common", cost: 1, itemName: "『お茶が熱い』", originText: "熱々の茶を急いで飲み込み、食道を火傷して息ができなくなり窒息死したせっかちな老人。", priestMemo: "急いては事を仕損じる。死に急ぐ必要はなかっただろうに。" },
  { rarity: "Common", cost: 1, itemName: "『スープが薄い』", originText: "薄味の配給スープに絶望し、生きる気力を失ってそのまま餓死した老婆。", priestMemo: "味覚への執着が命より重かったか。塩ひとつまみで救われた命だな。" },
  { rarity: "Common", cost: 1, itemName: "『布団が薄い』", originText: "すきま風の吹く部屋で、一枚の薄い布団を抱きしめながら丸まって凍死した少女。", priestMemo: "貧困は最も静かな殺し屋だ。彼女は寒さの中でどんな夢を見ていたのかね。" },
  { rarity: "Common", cost: 1, itemName: "『母さんに会いたい』", originText: "戦場で致命傷を負い、泥にまみれながら母の名を呼び続けて事切れた少年兵。", priestMemo: "戦場に母親は来ない。そんな当たり前のことすら、死の淵では忘れるのだな。" },
  { rarity: "Common", cost: 1, itemName: "『背中が痛い』", originText: "重い荷物を背負い続けた結果、背骨が完全に折れ曲がり、肺を圧迫して窒息した歩荷。", priestMemo: "荷物を下ろすという選択肢はなかったのか？愚直さは時に罪となる。" },
  { rarity: "Common", cost: 1, itemName: "『少しだけ横になる』", originText: "戦いの合間に一息つこうと横たわった草むらが、毒蛇の巣であった不運な兵士。", priestMemo: "休息の場所は選ぶべきだ。彼には少しばかり運が足りなかったようだな。" }
];

const masterPath = 'src/data/memoryMaster.json';
const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

masterData.Healing = healingItems;

fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2));
console.log('Healing memory items rewritten successfully.');
