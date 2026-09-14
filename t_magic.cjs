const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/memoryMaster.json', 'utf8'));

const translations = {
  "真理を暴いた舌": {
    "itemNameEn": "Tongue That Bared the Truth",
    "originTextEn": "A sage who deciphered the language of God to rewrite the world's logic, only to disintegrate while spewing light from every orifice the moment he spoke a single verse.",
    "priestMemoEn": "\"A cheap price to glimpse God's secret. Well, not that he has a mouth left to speak of it.\""
  },
  "虚空を掴む隻眼": {
    "itemNameEn": "One Eye Grasping the Void",
    "originTextEn": "A witch who perfected a formula to murder her parallel selves and steal their mana. Ultimately, she lost the ability to recognize herself and descended into raving madness.",
    "priestMemoEn": "\"More efficient than stealing from strangers. Assuming, of course, you can turn a blind eye to the trivial side effect of erasing your own existence.\""
  },
  "星を降らす頭蓋": {
    "itemNameEn": "Skull of the Meteor",
    "originTextEn": "A king who carved astral orbits directly into his skull to invoke a grand spell of meteor showers, annihilating his entire kingdom along with his enemies.",
    "priestMemoEn": "\"The starry sky inside his head must have been beautiful. Not a bad price for a firework show that burned a nation to ash.\""
  },
  "因果を喰らう胎児": {
    "itemNameEn": "Karma-Devouring Fetus",
    "originTextEn": "An archmage who endlessly chanted a time-reversal incantation, eventually regressing all the way back into a fetus before he was even born.",
    "priestMemoEn": "\"This is what happens when you beg for a do-over in life. Wouldn't returning to nothingness have been far happier?\""
  },
  "神を灼く灰": {
    "itemNameEn": "God-Scorching Ash",
    "originTextEn": "An inquisitor who captured an angel, dissected it, and burned its internal organs to synthesize an elixir of immortality. He was reduced to eternal ash before he could taste it.",
    "priestMemoEn": "\"How did the messenger of God taste? Pity he became immortal ash before securing an immortal life.\""
  },
  "禁忌を綴る血文字": {
    "itemNameEn": "Bloodscript of Taboos",
    "originTextEn": "A madman who, having run out of ink and parchment, finished writing his grimoire using his own blood and bone marrow, drying into a husk upon its completion.",
    "priestMemoEn": "\"All that effort for a book that's now just kindling. That is the ultimate destination of all passion.\""
  },
  "次元を裂く咆哮": {
    "itemNameEn": "Dimension-Rending Roar",
    "originTextEn": "An assassin who embedded a teleportation magic circle in his vocal cords. With every word he spoke, he warped space and shredded his enemies.",
    "priestMemoEn": "\"What is the point of a life where you can't even sing a song? A body reduced to a mere killing tool is a pitiful thing.\""
  },
  "思考を溶かす杯": {
    "itemNameEn": "Mind-Melting Chalice",
    "originTextEn": "A scholar who seared decades of knowledge into his own mind in an instant by dissolving and drinking the brains of others.",
    "priestMemoEn": "\"Borrowing the wisdom of others doesn't change the capacity of your own skull. Make sure to wipe up the madness leaking from your ears.\""
  },
  "夢魔の抜け殻": {
    "itemNameEn": "Succubus Husk",
    "originTextEn": "A shut-in who cast a spell to live exclusively inside dreams, allowing his physical body to rot away unattended.",
    "priestMemoEn": "\"Escapism taken to the level of high art. Assuming, of course, you can tolerate the stench of your own rotting flesh.\""
  },
  "記憶を喰む蟲": {
    "itemNameEn": "Memory-Devouring Worm",
    "originTextEn": "A woman who harbored a familiar in her brain to devour her memories, erasing the grief of losing her beloved, until she forgot everything.",
    "priestMemoEn": "\"Erasing yourself just to erase your sorrow? Human emotions are truly inefficient.\""
  },
  "狂乱のタクト": {
    "itemNameEn": "Baton of Frenzy",
    "originTextEn": "A mad musician who turned ambient mana into a melody, waving his baton until the eardrums and internal organs of every audience member ruptured.",
    "priestMemoEn": "\"They say music is an explosion, but what good is causing physical detonations? Still, I admit it was the ultimate finale.\""
  },
  "死霊を束ねる指輪": {
    "itemNameEn": "Ring of Bound Wraiths",
    "originTextEn": "A necromancer who forcibly stitched together the souls of the dead as a massive mana source, only to have his finger torn off by the weight of their grudges.",
    "priestMemoEn": "\"Treat the dead as tools and they will bite back. Did you forget the physical laws of gravity?\""
  },
  "概念を燃やす炎": {
    "itemNameEn": "Concept-Burning Flame",
    "originTextEn": "A sorcerer who created a black flame fueled not by matter, but by concepts like 'sorrow' and 'pain,' incinerating his own psyche in the process.",
    "priestMemoEn": "\"Burn your emotions and you feel nothing. Very peaceful. It just means you're now a meat puppet, that's all.\""
  },
  "未来を映す瞳": {
    "itemNameEn": "Eye Reflecting the Future",
    "originTextEn": "A swordsman who branded a magic circle directly onto his retinas to see one second into the future, fighting through agonizing pain.",
    "priestMemoEn": "\"Seeing the future is useless if you can't dodge it. Slowing down because of the sheer agony completely defeats the purpose.\""
  },
  "空虚を満たす泥": {
    "itemNameEn": "Void-Filling Sludge",
    "originTextEn": "An old hag who depleted all her mana but kept chanting anyway, vomiting up her own internal organs as substitute fuel.",
    "priestMemoEn": "\"Who was she trying to curse that badly? Vindictiveness is an old woman's privilege, but she should have known her limits.\""
  },
  "『頭が割れる』": {
    "itemNameEn": "\"My Head Is Splitting\"",
    "originTextEn": "A scribe whose brain was injected with knowledge beyond capacity, dying as cerebrospinal fluid leaked from the sutures of his skull.",
    "priestMemoEn": "\"Knowledge is power, but his vessel was far too small. A bit too physical for a mere headache.\""
  },
  "『数字が這い回る』": {
    "itemNameEn": "\"Crawling Numbers\"",
    "originTextEn": "A mathematician who tried to unravel the universe's truth, starving to death while scribbling bloody equations all over his walls.",
    "priestMemoEn": "\"Did the calculations not add up, or did he just forget to budget for food? The thoughts of a genius are beyond me.\""
  },
  "『声が止まない』": {
    "itemNameEn": "\"The Voices Won't Stop\"",
    "originTextEn": "A man who acquired a mystic eye to read minds, only to receive every drop of ambient malice, driving him to slice off his own ears.",
    "priestMemoEn": "\"Slicing off your ears won't stop the voices echoing directly into your brain. Never underestimate human malice.\""
  },
  "『色が見えない』": {
    "itemNameEn": "\"I Can't See Colors\"",
    "originTextEn": "An artist who over-enhanced his vision with mana until he could only see the constituent particles of matter, losing colors and human faces forever.",
    "priestMemoEn": "\"The result of pursuing ultimate realism. You need a little bit of blindness to paint a beautiful picture.\""
  },
  "『魔法陣が歪む』": {
    "itemNameEn": "\"The Magic Circle is Warped\"",
    "originTextEn": "An ascetic monk who sought geometric perfection, stabbing the needle of a compass through his own palm to draw endless circles.",
    "priestMemoEn": "\"The lines drawn through all that pain are still slightly trembling. A third-rate end for a perfectionist.\""
  },
  "『詠唱が噛み合わない』": {
    "itemNameEn": "\"Flubbed Incantation\"",
    "originTextEn": "An apprentice mage who slit his own tongue into three pieces just to chant overly complex spells without biting his tongue.",
    "priestMemoEn": "\"A textbook example of misdirected effort. You should have just shut up and practiced waving your staff.\""
  },
  "『影が笑う』": {
    "itemNameEn": "\"The Shadow Laughs\"",
    "originTextEn": "A man who imbued his own shadow with mana to make it a familiar, only to be strangled by it in the pitch darkness.",
    "priestMemoEn": "\"This is what happens when you materialize your own dark side. Seems your shadow was far more competent than you.\""
  },
  "『炎が冷たい』": {
    "itemNameEn": "\"The Flame is Cold\"",
    "originTextEn": "An alchemist who accidentally ignited himself during an experiment to create a cryogenic flame, carbonizing as he froze to death.",
    "priestMemoEn": "\"Pursuing paradoxes is the nature of a scholar, but there was no need to prove it with your own life.\""
  },
  "『鏡の中の他人』": {
    "itemNameEn": "\"Stranger in the Mirror\"",
    "originTextEn": "A sorcerer who used cloning spells too many times, losing track of the original and engaging in a battle to the death with his own copies.",
    "priestMemoEn": "\"Proving with your own body the truth that you are the one you can trust the least. Splendid.\""
  },
  "『時間が遅い』": {
    "itemNameEn": "\"Time is Slow\"",
    "originTextEn": "A warrior who drank a potion to accelerate his thoughts by thousands of times, experiencing the momentary agony of his death for an eternity.",
    "priestMemoEn": "\"How does it feel to experience the moment of death for centuries? Amateurs shouldn't dabble in time manipulation.\""
  },
  "『空間が裏返る』": {
    "itemNameEn": "\"Space Inside Out\"",
    "originTextEn": "A spatial mage who botched a teleportation coordinate calculation, arriving at his destination with his skin and internal organs completely inverted.",
    "priestMemoEn": "\"The arrangement of your organs is beautiful, but you might catch a cold like that. Calculate more carefully next time.\""
  },
  "『雷が落ちない』": {
    "itemNameEn": "\"The Lightning Won't Strike\"",
    "originTextEn": "A shaman who failed a weather-manipulation ritual, turning his own staff into a lightning rod and reducing himself to a charred corpse.",
    "priestMemoEn": "\"Taking on the wrath of the gods single-handedly... a shaman's ultimate honor. You're just a crispy corpse, though.\""
  },
  "『呪文を忘れた』": {
    "itemNameEn": "\"Forgot the Spell\"",
    "originTextEn": "A pitiful old mage who was cursed with memory loss just before casting a spell, beaten to death by an enemy while merely holding his staff up.",
    "priestMemoEn": "\"Should have retired before senility set in. A staff is not a club, you know.\""
  },
  "『血が沸騰する』": {
    "itemNameEn": "\"Blood Boiling\"",
    "originTextEn": "A vampire who mismanaged a spell converting mana directly into blood, boiling all his blood into steam until he violently burst.",
    "priestMemoEn": "\"An eco-friendly power source, but this is what happens when you neglect heat dissipation. A vampire dying of burns isn't even funny.\""
  },
  "『重力が上に向かう』": {
    "itemNameEn": "\"Gravity Goes Up\"",
    "originTextEn": "The final despair of a levitation mage who accidentally cast a gravity-inversion spell on himself, falling upwards into the endless sky.",
    "priestMemoEn": "\"The man who became a star. Romantic, but suffocating in the void must have been unimaginable torture.\""
  },
  "『字が読めない』": {
    "itemNameEn": "\"Can't Read the Words\"",
    "originTextEn": "A scholar who succumbed to the toxic ink of a grimoire, continuing to turn the pages even as he slowly lost his sight and intellect.",
    "priestMemoEn": "\"Risking your life to read is admirable, but you should curse the author's twisted taste in poisonous ink.\""
  },
  "『杖が重い』": {
    "itemNameEn": "\"The Staff is Heavy\"",
    "originTextEn": "An apprentice who grabbed a cursed staff that drains mana, unable to let go until he was completely mummified.",
    "priestMemoEn": "\"That's what you get for touching things that aren't yours. Let this be a good lesson to you.\""
  },
  "『火の粉が熱い』": {
    "itemNameEn": "\"The Embers Are Hot\"",
    "originTextEn": "A novice mage who was so mesmerized by the beauty of his first successful fireball that he forgot to dodge, burning off his own face.",
    "priestMemoEn": "\"Dying mesmerized by your own talent. In a way, perhaps the happiest end one could ask for.\""
  },
  "『水に溺れる幻覚』": {
    "itemNameEn": "\"Hallucination of Drowning\"",
    "originTextEn": "A soldier subjected to a water-torture illusion, dying of asphyxiation while completely dry on land, convinced his lungs were full of water.",
    "priestMemoEn": "\"The human brain is so easily fooled. Drowning to death without a single drop of water... what ridiculous creatures.\""
  },
  "『砂が目に入る』": {
    "itemNameEn": "\"Sand in My Eyes\"",
    "originTextEn": "A third-rate wind user who failed to control a sandstorm spell, filling his own eyes and lungs with sand.",
    "priestMemoEn": "\"You should have read where you were standing before you tried reading the wind. 'Reaping what you sow' suits you perfectly.\""
  },
  "『石に変わる足』": {
    "itemNameEn": "\"Feet Turning to Stone\"",
    "originTextEn": "A man who bled to death trying to chop off his own legs to slow the progression of a petrification curse.",
    "priestMemoEn": "\"Turn to stone or bleed dry. The ultimate choice. You were destined to die either way, though.\""
  },
  "『呪符が剥がれない』": {
    "itemNameEn": "\"The Talisman Won't Peel Off\"",
    "originTextEn": "A paranoiac who glued anti-spirit talismans over his entire body, suffocating to death because his skin could no longer breathe.",
    "priestMemoEn": "\"Protected from evil spirits, maybe. Not protected from suffocation, it seems.\""
  },
  "『幻の金貨』": {
    "itemNameEn": "\"Phantom Gold Coin\"",
    "originTextEn": "A con artist who died of heavy metal poisoning after swallowing a lump of lead, convinced his alchemy had successfully turned it into gold.",
    "priestMemoEn": "\"A con artist fooled by his own lie. Talentless, or a genius in a twisted way? Hard to say.\""
  },
  "『星が囁く』": {
    "itemNameEn": "\"The Stars Whisper\"",
    "originTextEn": "A hermit who starved to death with his head wrapped in aluminum foil, mistaking the cosmic noise of the universe for telepathy.",
    "priestMemoEn": "\"The stars speak to no one. It was just the worms in your brain making all that noise.\""
  },
  "『闇が怖い』": {
    "itemNameEn": "\"Afraid of the Dark\"",
    "originTextEn": "A coward who could only use light magic, starving to death because he constantly cast spells out of an absolute terror of the dark.",
    "priestMemoEn": "\"Seems you failed to realize that starvation and loneliness are far scarier than the dark.\""
  },
  "『火が点かない』": {
    "itemNameEn": "\"The Fire Won't Light\"",
    "originTextEn": "A vagrant who froze to death on a bitter winter night, falling into despair after repeatedly failing even a basic fire-starting spell.",
    "priestMemoEn": "\"A single match could have saved your life. This is what you get for relying on something as fickle as magic.\""
  },
  "『杖の破片が刺さる』": {
    "itemNameEn": "\"Staff Splinters Pierce\"",
    "originTextEn": "An idiot who pumped too much mana into a cheap staff causing it to explode, dying when a wooden splinter pierced his eyeball.",
    "priestMemoEn": "\"Didn't anyone teach you how to use your tools? You get what you pay for—in this case, death.\""
  },
  "『計算が合わない』": {
    "itemNameEn": "\"The Math is Wrong\"",
    "originTextEn": "An apprentice alchemist who messed up the measurements for a simple potion and was caught in the exploding cauldron.",
    "priestMemoEn": "\"Go back and learn basic arithmetic. Well, I suppose you don't have an extra life for that.\""
  },
  "『文字が滲む』": {
    "itemNameEn": "\"The Letters Are Blurring\"",
    "originTextEn": "A student who read grimoires all through the night, his heart stopping from overwork as he collapsed face-first onto his book.",
    "priestMemoEn": "\"It's good to be studious, but you can't get a degree if you're dead.\""
  },
  "『水晶球が割れる』": {
    "itemNameEn": "\"The Crystal Ball Shatters\"",
    "originTextEn": "A fortune teller who foresaw his own miserable future in a crystal ball and smashed his head against it in sheer despair, dying instantly.",
    "priestMemoEn": "\"Giving up before you even try to change the future? A third-rate seer and bottom-tier trash of a human.\""
  },
  "『呪文を噛む』": {
    "itemNameEn": "\"Biting the Incantation\"",
    "originTextEn": "A mage who fumbled his chant in front of an enemy and got his head chopped off while frozen in embarrassment.",
    "priestMemoEn": "\"Sluggish speech proved fatal. The price for slacking on your tongue-twister practice.\""
  },
  "『帽子が風で飛ぶ』": {
    "itemNameEn": "\"The Hat Blows Away\"",
    "originTextEn": "An old man who suffered a fatal heart attack from the shock of losing his precious pointed hat while failing to manipulate strong winds.",
    "priestMemoEn": "\"Dying over a hat? Just how fragile was that paper-thin pride of yours?\""
  },
  "『指がつる』": {
    "itemNameEn": "\"Cramping Fingers\"",
    "originTextEn": "A man whose fingers cramped while attempting complex hand seals, eaten alive by wild dogs while writhing in agony.",
    "priestMemoEn": "\"That's what you get for skipping your warm-ups. You basically hand-signed your way into becoming dog food.\""
  },
  "『マントが引っかかる』": {
    "itemNameEn": "\"Caught Cloak\"",
    "originTextEn": "A wizard whose obnoxiously long cloak caught on a tree branch while fleeing, getting him instantly skewered by his pursuers.",
    "priestMemoEn": "\"This is why you don't wear pointlessly long cloaks for fashion. The demise of a fool who ignores practicality.\""
  },
  "『何も起こらない』": {
    "itemNameEn": "\"Nothing Happens\"",
    "originTextEn": "A completely ordinary man who spent his entire life screaming incantations, utterly convinced he possessed hidden magical powers.",
    "priestMemoEn": "\"I suppose he was happy in his madness. Dying without ever facing reality.\""
  }
};

data.Magic.forEach(item => {
  const trans = translations[item.itemName];
  if (trans) {
    item.itemNameEn = trans.itemNameEn;
    item.originTextEn = trans.originTextEn;
    item.priestMemoEn = trans.priestMemoEn;
  }
});

fs.writeFileSync('src/data/memoryMaster.json', JSON.stringify(data, null, 2));
