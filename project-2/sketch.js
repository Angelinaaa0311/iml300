
let bg1Video;
let bg2Video;
let bg3Image;
let bgAirportImage;
let bgSeaVideo;
let dinnerImage;
let planImage;
let bgSeaRoomImage;
let bg4Image;
let bg5Image;
let bgNightVideo;
let playImages = [];
let envelopeImage;
let endingPaperImage;
let luImage;
let moImage;
let xiaImage;
let zuoImage;
let callImage;
let bgMusic;
let callRingtone;
let messageSfx;
let startBtn = { x: 0, y: 0, w: 200, h: 56 };
let btnHover = false;
let mediaStarted = false;
let imageBounds = { x: 0, y: 0, w: 0, h: 0 };



let stage = 0;

let quizAnswers = Array(10).fill(null);
let stage1TextVisible = false;
let stage2TextVisible = false;
let stage2CallVisible = false;
let stage2PhoneCenterVisible = false;
let stage2Dialog2Visible = false;
let stage2ShockVisible = false;
let stage2ShockStartMs = -1;
let stage2MessageVisible = false;
let stage2PhoneFading = false;
let stage2PhoneAlpha = 255;
let stage2ChoiceVisible = false;
let stage2BranchResult = null; // 'A' | 'B'
let choiceAButton = { x: 0, y: 0, w: 220, h: 56 };
let choiceBButton = { x: 0, y: 0, w: 220, h: 56 };
let stage3Step = 0;
let stage3SelectedGuest = null; // 'A' | 'B' | 'C' | 'D' | null
let stage3GuestCards = [];
let stage3PlanVisible = false;
let stage3PlanZoomed = false;
let stage3Q1Visible = false;
let stage3Q1Choice = null; // 'A' | 'B' | 'C' | 'D'
let stage3Q1Buttons = [];
let stage4CarouselIndex = 0;
let stage4LastSwitchMs = 0;
let stage4SwitchIntervalMs = 2500;
let stage5TextVisible = false;
let stage5Question2Visible = false;
let stage5Q2Choice = null;
let stage5Q2Buttons = [];
let stage6Step = 0;
let stage6Q3Choice = null;
let stage6Q4Choice = null;
let stage7Step = 0;
let stage7Q5Choice = null;
let stage7Q6Choice = null;
let stage7Q7Choice = null;
let stage8Q8Choice = null;
let stage9Q9Choice = null;
let stage10CardTextVisible = false;
let stage10Q10Choice = null;
let stage11Step = 0;
let stage11EnvelopeRect = { x: 0, y: 0, w: 0, h: 0 };
let stage11PaperRect = { x: 0, y: 0, w: 0, h: 0 };
let genericChoiceButtons = [];
let homeFadeActive = false;
let homeFadeAlpha = 0;
let homeFadeMode = 'none'; // 'to_black' | 'to_clear' | 'none'

function preload() {

  bg1Video = createVideo(['imgs/BG1.mov', 'imgs/BG1.mp4'], function () {
    if (bg1Video) {
      bg1Video.volume(0);
      if (bg1Video.elt) {
        bg1Video.elt.muted = true;
        bg1Video.elt.setAttribute('playsinline', '');
      }
      bg1Video.hide();
    }
  });

  bg2Video = createVideo(['imgs/BG2.mov', 'imgs/BG2.mp4'], function () {
    if (bg2Video) {
      bg2Video.volume(0);
      if (bg2Video.elt) {
        bg2Video.elt.muted = true;
        bg2Video.elt.setAttribute('playsinline', '');
      }
      bg2Video.hide();
    }
  });
  bg3Image = loadImage('imgs/BG3.jpg');
  bgAirportImage = loadImage('imgs/BGairport.jpg');
  bgSeaVideo = createVideo(['imgs/BGsea.mov', 'imgs/BGsea.mp4'], function () {
    if (bgSeaVideo) {
      bgSeaVideo.volume(0);
      if (bgSeaVideo.elt) {
        bgSeaVideo.elt.muted = true;
        bgSeaVideo.elt.setAttribute('playsinline', '');
      }
      bgSeaVideo.hide();
    }
  });
  dinnerImage = loadImage('imgs/Dinner.jpg');
  planImage = loadImage('imgs/Plan.jpg');
  bgSeaRoomImage = loadImage('imgs/BGsearoom.jpg');
  bg4Image = loadImage('imgs/BG4.jpg');
  bg5Image = loadImage('imgs/BG5.jpg');
  bgNightVideo = createVideo(['imgs/BGnight.mov', 'imgs/BGnight.mp4'], function () {
    if (bgNightVideo) {
      bgNightVideo.volume(0);
      if (bgNightVideo.elt) {
        bgNightVideo.elt.muted = true;
        bgNightVideo.elt.setAttribute('playsinline', '');
      }
      bgNightVideo.hide();
    }
  });
  playImages = [
    loadImage('imgs/play1.jpg'),
    loadImage('imgs/play2.jpg'),
    loadImage('imgs/play3.jpg'),
    loadImage('imgs/play4.jpg'),
  ];
  envelopeImage = loadImage('imgs/envelope.PNG');
  endingPaperImage = loadImage('imgs/END.JPG');
  luImage = loadImage('imgs/Lu.PNG');
  moImage = loadImage('imgs/Mo.PNG');
  xiaImage = loadImage('imgs/Xia.PNG');
  zuoImage = loadImage('imgs/Zuo.PNG');
  callImage = loadImage('imgs/Call.PNG');
  bgMusic = loadSound('sound/结局BGM.MP3', function () {}, function () {
    console.log('背景音乐未找到');
  });
  callRingtone = loadSound('sound/电话来电.MP3', function () {}, function () {
    console.log('来电音效未找到');
  });
  messageSfx = loadSound('sound/信息提示.MP3', function () {}, function () {
    console.log('消息提示音未找到');
  });
}

function startMedia() {
  if (mediaStarted) return;
  mediaStarted = true;
  if (bg1Video) {
    if (bg1Video.elt) {
      bg1Video.elt.muted = true;
      bg1Video.elt.setAttribute('playsinline', '');
    }
    bg1Video.loop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  updateButtonPosition();


  if (bg1Video && bg1Video.elt) {
    bg1Video.elt.muted = true;
    bg1Video.elt.setAttribute('playsinline', '');
    bg1Video.loop();
  }
}

function draw() {
  const shockElapsed = stage2ShockStartMs >= 0 ? millis() - stage2ShockStartMs : 0;
  const isShockActive = stage2ShockVisible && shockElapsed < 1000;
  if (isShockActive) {
    const progress = shockElapsed / 1000;
    const shakeStrength = lerp(6, 1.5, progress);
    translate(random(-shakeStrength, shakeStrength), random(-shakeStrength, shakeStrength));
  }

  if (stage === 11 && bgNightVideo) {
    background(0);
    drawVideoBackground(bgNightVideo);
  } else if (stage === 10 && bgNightVideo) {
    background(0);
    drawVideoBackground(bgNightVideo);
  } else if (stage === 9 && bgSeaVideo) {
    background(0);
    drawVideoBackground(bgSeaVideo);
  } else if (stage === 8 && bg5Image) {
    background(0);
    drawImageBackground(bg5Image);
  } else if (stage === 7) {
    background(0);
    if (stage7Step <= 0 && bgSeaVideo) {
      drawVideoBackground(bgSeaVideo);
    } else if (stage7Step <= 1 && bg4Image) {
      drawImageBackground(bg4Image);
    } else if (stage7Step >= 2 && bgNightVideo) {
      drawVideoBackground(bgNightVideo);
    }
  } else if (stage === 6) {
    background(0);
    if (stage6Step <= 0 && bgSeaVideo) {
      drawVideoBackground(bgSeaVideo);
    } else if (bgSeaRoomImage) {
      drawImageBackground(bgSeaRoomImage);
    }
  } else if (stage === 5 && bgSeaRoomImage) {
    background(0);
    drawImageBackground(bgSeaRoomImage);
  } else if (stage === 4) {
    background(0);
    if (bgSeaVideo) {
      drawVideoBackground(bgSeaVideo);
    } else {
      drawGradientBackground();
    }
  } else if (stage === 3) {
    background(0);
    if (stage3Step <= 1 && bgAirportImage) {
      drawImageBackground(bgAirportImage);
    } else if (stage3Step <= 3 && bgSeaVideo) {
      drawVideoBackground(bgSeaVideo);
    } else if (stage3Step >= 4 && dinnerImage) {
      drawImageBackground(dinnerImage);
    }
  } else if (stage === 2 && bg3Image) {
    background(0);
    drawImageBackground(bg3Image);
  } else {
    const activeVideo = stage === 0 ? bg1Video : bg2Video;
    const hasVideo =
      activeVideo &&
      ((activeVideo.elt && activeVideo.elt.videoWidth > 0) || activeVideo.width > 0);
    if (hasVideo) {

      background(0);
      drawVideoBackground(activeVideo);
    } else {
      imageBounds = { x: 0, y: 0, w: width, h: height };
      drawGradientBackground();
    }
  }

  if (stage === 0) {

    push();
    fill(255);
    textSize(min(width, height) * 0.08);
    textStyle(BOLD);
    textFont('Georgia, "Times New Roman", serif');
    text('Crush Island', width / 2, height * 0.38);
    pop();


    updateButtonPosition();
    drawStartButton();
    cursor(btnHover ? HAND : ARROW);
  } else if (stage === 1) {
    if (stage1TextVisible) {
      drawStage1Text();
    }
    cursor(ARROW);
  } else if (stage === 2) {
    if (stage2BranchResult) {
      drawStage2BranchResult();
    } else if (stage2ChoiceVisible) {
      drawStage2Choices();
    } else if (stage2PhoneFading) {
      drawStage2PhoneFadeOut();
    } else if (stage2MessageVisible) {
      drawStage2MessageEvent();
    } else if (stage2ShockVisible) {
      drawStage2ShockEvent();
    } else if (stage2Dialog2Visible) {
      drawStage2Dialog2Event();
    } else if (stage2PhoneCenterVisible) {
      drawStage2PhoneCenterEvent();
    } else if (stage2CallVisible) {
      drawStage2CallEvent();
    } else if (stage2TextVisible) {
      drawStage2Text();
    }
    cursor(ARROW);
  } else if (stage === 3) {
    drawStage3Flow();
    cursor(ARROW);
  } else if (stage === 4) {
    drawStage4Flow();
    cursor(ARROW);
  } else if (stage === 5) {
    drawDayTag("Day 2");
    if (stage5Question2Visible) {
      drawQuestionScreen(
        "After the day's date comes to an end, you return to your room and lie down on the bed. Scenes from today's outing keep replaying in your mind. One moment stands out above the rest-which one draws you in the most?",
        [
          "A. He's dressed in a particularly eye-catching outfit today-sunlight spills over him like a built-in filter. During the batik session, his color combinations and patterns have a uniquely creative flair. You find yourself drawn to his talent and that effortless confidence.",
          "B. As the sun sets, you sit together on the terrace. The sunset before you is almost too beautiful for words, yet a quiet melancholy rises in your chest. He doesn't ask what's wrong. He simply stays by your side, watching you with a gentle smile-as if to say, \"I understand.\"",
          "C. It's your first time surfing. You wipe out several times, your frustration starting to build. He swims over. No pep talk, no empty encouragement-just quietly guides your board to where the waves are best. Then he looks at you and says, \"One more try. I'm right here with you.\"",
          "D. After dinner, you're walking back to the guesthouse when a cool sea breeze sweeps in. Without a word, he shifts to the windward side, shielding you. You let out a small sneeze, and he pulls a jacket from his bag, handing it over. \"Brought an extra. Don't catch a cold.\"",
        ],
        stage5Q2Choice
      );
    } else if (stage5TextVisible) {
      drawNarrationText(
        "After the day's date comes to an end, you return to your room and lie down on the bed. Scenes from today's outing keep replaying in your mind. One moment stands out above the rest-which one draws you in the most?"
      );
    }
    cursor(ARROW);
  } else if (stage === 6) {
    drawStage6Flow();
    cursor(ARROW);
  } else if (stage === 7) {
    drawStage7Flow();
    cursor(ARROW);
  } else if (stage === 8) {
    drawDayTag("Day 5");
    drawQuestionScreen(
      "The production team arranges a 'Friends Visit' segment. Two of his close friends come to the island, and the four of you have a meal together. After it ends, what's your feeling?",
      [
        "A. You care a little about how his friends see you-you wonder if you've been accepted.",
        "B. It's fine. A brief introduction is enough-no need to go too deep.",
        "C. It doesn't really matter. He has his friends, you have yours. It's better to not interfere.",
        "D. You're slightly aware of it, but as long as his friends don't cross any lines, you're fine with however things go.",
      ],
      stage8Q8Choice
    );
    cursor(ARROW);
  } else if (stage === 9) {
    drawDayTag("Day 6");
    drawQuestionScreen(
      "Today is the final day of filming. What does your ideal, most comfortable everyday relationship look like?",
      [
        "A. Saying \"I miss you\" every day, video calling before bed, wanting to be glued to each other 24/7. (The passionate, lovey-dovey type.)",
        "B. Not needing many words-just a look, and you know what the other is thinking. Two people who truly understand each other. (The soulmate type.)",
        "C. Each having their own life, but always there when needed. Supporting each other without being tied at the hip. (The partner-in-crime type.)",
        "D. Grocery shopping and cooking together, sinking into the sofa to watch TV-simple, peaceful, reassuring. (The family-like, homebody type.)",
      ],
      stage9Q9Choice
    );
    cursor(ARROW);
  } else if (stage === 10) {
    if (!stage10CardTextVisible) {
      drawNarrationText(
        "After you finish writing, the production team calls you down to the beach. They hand you an envelope and a card.\nOn the card, it reads:\n\"Over these ten days-was the person who made your heart race the same as the one who made you feel most at ease?\"\n\"If 'who you like' and 'who you fit with' don't align... which do you choose?\""
      );
    } else {
      drawQuestionScreen(
        "If 'who you like' and 'who you fit with' don't align... which do you choose?",
        [
          "A. Choose who I like. Even if it takes exhausting work to make it fit, I don't want to settle.",
          "B. Choose who's right for me. Butterflies fade, but compatibility lasts.",
          "C. I'm torn. I want to find the balance between the two.",
          "D. Go with the feeling. Follow my heart-no need to set limits in advance.",
        ],
        stage10Q10Choice
      );
    }
    cursor(ARROW);
  } else if (stage === 11) {
    drawStage11Flow();
    cursor(ARROW);
  } else {
    cursor(ARROW);
  }


  if (homeFadeActive) {
    noStroke();
    fill(0, 0, 0, homeFadeAlpha);
    rect(0, 0, width, height);

    const fadeStep = 255 / (60 * 3);
    if (homeFadeMode === 'to_black') {
      homeFadeAlpha = min(255, homeFadeAlpha + fadeStep);
      if (homeFadeAlpha >= 255) {
        resetToHome();
        homeFadeMode = 'to_clear';
      }
    } else if (homeFadeMode === 'to_clear') {
      homeFadeAlpha = max(0, homeFadeAlpha - fadeStep);
      if (homeFadeAlpha <= 0) {
        homeFadeActive = false;
        homeFadeMode = 'none';
      }
    }
  }
}

function drawStage11Flow() {
  if (stage11Step === 0) {
    drawNarrationText(
      "You hold the envelope in your hands, standing by the shore for a long time.\nThe wind brushes past you, carrying the salt of the sea and the warmth of the setting sun.\nYou're not sure how to choose.\nOr maybe, deep down, you've always known the answer."
    );
  } else if (stage11Step === 1) {
    drawStage11Envelope();
  } else if (stage11Step >= 2) {
    drawStage11PaperOnly();
    drawTextOnEndingPaper(buildFinalEndingText());
    if (stage11Step >= 3) {
      background(0);
      fill(255);
      textAlign(CENTER, CENTER);
      textStyle(NORMAL);
      textSize(min(width, height) * 0.032);
      text(
        "Where will your next heartbeat take you?\nMay you carry your answer with you, and keep going.",
        width / 2,
        height / 2
      );
    }
  }
}

function getDominantChoice() {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const ans of quizAnswers) {
    if (ans && counts[ans] !== undefined) counts[ans]++;
  }
  const order = ['A', 'B', 'C', 'D'];
  let best = 'A';
  for (const k of order) {
    if (counts[k] > counts[best]) best = k;
  }
  return best;
}

function buildFinalEndingText() {
  const commonENHead =
    "Dear Experience Tester:\n\nThank you for spending these five days with us.\n\nBefore you leave, we'd like to share a few \"little discoveries\" about you.\n\nOver these days, through the different choices you made, you've quietly revealed the truest parts of your heart.";
  const middleEN = {
    A: "You're naturally drawn to people who stand out: appearance, style, and personality. You're attracted to romance, a sense of occasion, and the thrill of something new. In love, you seek the feeling of being seen and cherished.\n\nWhat suits you best is not someone of the same \"chasing novelty\" type, but someone steady and reliable. They can embrace your ever-changing moods and provide a secure foundation, letting you enjoy the romance while still having something solid to come back to.",
    B: "You long for a love that feels like two souls intertwined. You're drawn to people who are gentle, thoughtful, and truly understand you. In a relationship, emotional connection matters most. You want someone who can hold space for your quiet hurts and small frustrations, and who values deep, meaningful conversations.\n\nWhat suits you best is either a kindred spirit who connects on that emotional frequency, or someone grounded and emotionally steady. The kindred spirit will understand your subtleties, while the steady one will offer calm when you're vulnerable and help you both avoid unnecessary friction.",
    C: "You hate feeling trapped. You're drawn to people who are independent, strong-willed, and not overly clingy. In love, you value clear boundaries. You want each person to have their own space without feeling consumed by the relationship. You're looking for a partnership of equals.\n\nWhat suits you best is either someone equally independent, or someone gentle and empathetic. The independent type will respect your rhythm, and the empathetic type will quietly step into your world when you're feeling alone, without disturbing your peace.",
    D: "Your expectations for love are simple. You're drawn to people who are steady, reliable, and emotionally grounded. You don't like drama. In love, you're looking for something comfortable, down-to-earth, and genuine. What matters most to you is tangible presence and a sense of responsibility.\n\nWhat suits you best is either someone equally grounded and reliable, or someone independent and free-spirited. The grounded one will walk with you through daily routines, while the independent one will bring just enough freshness to keep life from feeling dull.",
  };
  const winner = getDominantChoice();
  return `${commonENHead}\n\n${middleEN[winner]}`;
}

function drawStage11Envelope() {
  if (!envelopeImage) return;
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const w = min(bounds.w * 0.24, 320);
  const h = (envelopeImage.height / envelopeImage.width) * w;
  const x = bounds.x + (bounds.w - w) / 2;
  const y = bounds.y + (bounds.h - h) / 2 + bounds.h * 0.12;
  image(envelopeImage, x, y, w, h);
  stage11EnvelopeRect = { x, y, w, h };
}

function drawStage11PaperOnly() {
  if (!endingPaperImage) return;
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const w = min(bounds.w * 0.72, 940);
  const h = (endingPaperImage.height / endingPaperImage.width) * w;
  const x = bounds.x + (bounds.w - w) / 2;
  const y = bounds.y + (bounds.h - h) / 2;
  image(endingPaperImage, x, y, w, h);
  stage11PaperRect = { x, y, w, h };
}

function drawTextOnEndingPaper(content) {
  const paper = stage11PaperRect;
  if (!paper.w || !paper.h) return;
  const textX = paper.x + paper.w * 0.12;
  const textY = paper.y + paper.h * 0.13;
  const textW = paper.w * 0.76;
  const textH = paper.h * 0.72;
  let fontSize = min(width, height) * 0.02;
  const minFontSize = 12;
  let lineGap = fontSize * 0.34;
  let lines = [];

  while (fontSize >= minFontSize) {
    textSize(fontSize);
    textStyle(NORMAL);
    lineGap = fontSize * 0.34;
    lines = wrapTextByWidth(content, textW);
    const contentH = lines.length * fontSize + max(0, lines.length - 1) * lineGap;
    if (contentH <= textH) break;
    fontSize -= 1;
  }

  push();
  fill(45, 35, 25, 235);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(fontSize);
  textLeading(fontSize + lineGap);
  text(lines.join('\n'), textX, textY, textW, textH);
  pop();
}

function isInsideStage11Envelope(mx, my) {
  const r = stage11EnvelopeRect;
  return mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
}

function drawStage4Flow() {
  drawDayTag("Day 2");
  drawStage4Carousel();
}

function ensureGenericChoiceButtons(options) {
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const btnW = min(bounds.w * 0.42, 460);
  const colGap = min(bounds.w * 0.04, 30);
  const rowGap = min(bounds.h * 0.03, 22);
  const totalW = btnW * 2 + colGap;
  const startX = bounds.x + (bounds.w - totalW) / 2;

  let fontSize = min(width, height) * 0.0185;
  const minFontSize = 11;
  const hPad = 14;
  const vPad = 10;
  let lineGap = fontSize * 0.3;
  let wrapped = [];
  let itemHeights = [];
  let row1H = 0;
  let row2H = 0;
  let totalH = 0;


  while (fontSize >= minFontSize) {
    lineGap = fontSize * 0.3;
    textSize(fontSize);
    textStyle(NORMAL);
    wrapped = options.map((opt) => wrapTextByWidth(opt, btnW - hPad * 2));
    itemHeights = wrapped.map((lines) => {
      const textH = lines.length * fontSize + max(0, lines.length - 1) * lineGap;
      return max(44, textH + vPad * 2);
    });
    row1H = max(itemHeights[0] || 44, itemHeights[1] || 44);
    row2H = max(itemHeights[2] || 44, itemHeights[3] || 44);
    totalH = row1H + rowGap + row2H;
    if (totalH <= bounds.h * 0.45) break;
    fontSize -= 1;
  }

  const startY = bounds.y + (bounds.h - totalH) / 2 + bounds.h * 0.04;
  genericChoiceButtons = [
    {
      key: 'A',
      x: startX,
      y: startY + (row1H - itemHeights[0]) / 2,
      w: btnW,
      h: itemHeights[0],
      lines: wrapped[0],
      fontSize,
      lineGap,
      hPad,
      vPad,
    },
    {
      key: 'B',
      x: startX + btnW + colGap,
      y: startY + (row1H - itemHeights[1]) / 2,
      w: btnW,
      h: itemHeights[1],
      lines: wrapped[1],
      fontSize,
      lineGap,
      hPad,
      vPad,
    },
    {
      key: 'C',
      x: startX,
      y: startY + row1H + rowGap + (row2H - itemHeights[2]) / 2,
      w: btnW,
      h: itemHeights[2],
      lines: wrapped[2],
      fontSize,
      lineGap,
      hPad,
      vPad,
    },
    {
      key: 'D',
      x: startX + btnW + colGap,
      y: startY + row1H + rowGap + (row2H - itemHeights[3]) / 2,
      w: btnW,
      h: itemHeights[3],
      lines: wrapped[3],
      fontSize,
      lineGap,
      hPad,
      vPad,
    },
  ];
}

function drawQuestionScreen(question, options, selected) {
  drawNarrationText(question);
  ensureGenericChoiceButtons(options);
  for (let i = 0; i < genericChoiceButtons.length; i++) {
    const btn = genericChoiceButtons[i];
    const isSelected = selected === btn.key;
    push();
    fill(isSelected ? color(255, 255, 255, 58) : color(0, 0, 0, 165));
    stroke(255, 230);
    strokeWeight(1.4);
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    noStroke();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(btn.fontSize);
    textLeading(btn.fontSize + btn.lineGap);
    text((btn.lines || [options[i] || btn.key]).join('\n'), btn.x + btn.hPad, btn.y + btn.vPad);
    pop();
  }
}

function drawStage6Flow() {
  drawDayTag("Day 3");
  if (stage6Step === 0) {
    drawQuestionScreen(
      "The recording enters Day 3. The production team sets up a \"Chemistry Challenge.\" You and your date need to work together to complete a task-but along the way, a small disagreement arises. Using limited materials, you're supposed to build a \"sun shelter\" on the beach. The problem is, the two of you have completely different ideas on how to do it. At this moment, you say -",
      [
        "A. \"Can we just go with my way this time...? Next time, I'll follow yours, okay?\" (You care about their attitude.)",
        "B. \"Can we take a moment to explain why you think your plan is better?\" (You care about getting to the bottom of things.)",
        "C. \"You just cut me off. I wasn't finished speaking.\" (You care about being respected.)",
        "D. \"Forget it. Let's just do it your way. No point wasting time.\" (You care about smoothing things over quickly.)",
      ],
      stage6Q3Choice
    );
  } else {
    drawQuestionScreen(
      "It's 1:00 AM. Which kind of interaction would feel most comforting?",
      [
        "A. He instantly calls you: \"Can't sleep? I'll stay on the line with you. Want me to tell you a little story?\"",
        "B. A message pops up: \"I'm awake too. Talk if you feel like it. Or just stay on the call-I'm here.\"",
        "C. He doesn't message you directly, but you notice he's shared a lullaby-like track on his feed. The caption simply reads: \"For tonight.\"",
        "D. A photo comes through-it's the shells he collected on the beach earlier, carefully arranged into the shape of a moon. \"For you. I'll bring them tomorrow.\"",
      ],
      stage6Q4Choice
    );
  }
}

function drawStage7Flow() {
  drawDayTag("Day 4");
  if (stage7Step === 0) {
    drawQuestionScreen(
      "A few days in, which turn-off detail hits you the hardest?",
      [
        "A. You notice he's always very particular when it comes to splitting the bill-counting every last cent, even for a bottle of water. And the little preferences you mentioned in passing? He never seems to remember them.",
        "B. When you're feeling down, he doesn't pick up on it at all. He just keeps enthusiastically talking about his own things. You drop a few hints, but he never catches on.",
        "C. You notice he's started asking where you are and who you're with a little too often. When you say you want to take a walk alone, he says, \"I'll come with you.\" You feel yourself starting to suffocate a little.",
        "D. You ask him what his plans are after the show ends. He says, \"Haven't really thought about it. We'll see.\" No direction, no plans for the future.",
      ],
      stage7Q5Choice
    );
  } else if (stage7Step === 1) {
    drawQuestionScreen(
      "What is the greatest meaning of two people being together?",
      [
        "A. \"It's about becoming better together. Going to more places, growing into stronger versions of ourselves-together.\"",
        "B. \"Having someone there to catch you. No matter how hard things get, you know you're not alone.\"",
        "C. \"I think both matter. Being able to enjoy the good times together, and getting through the hard times together.\"",
        "D. \"I don't overthink it. Feeling comfortable with each other-that's what really counts.\"",
      ],
      stage7Q6Choice
    );
  } else {
    drawQuestionScreen(
      "After the show ends, what are your plans for relationships?",
      [
        "A. \"I hope we can plan together-aligned goals, moving at the same pace.\"",
        "B. \"Take it slow and find a rhythm that works for both of us.\"",
        "C. \"We can each plan our own lives. Just check in with each other now and then.\"",
        "D. \"Just go with the flow. Overthinking things just gets exhausting.\"",
      ],
      stage7Q7Choice
    );
  }
}

function drawStage4Carousel() {
  if (!playImages.length) return;
  if (millis() - stage4LastSwitchMs > stage4SwitchIntervalMs) {
    stage4CarouselIndex = (stage4CarouselIndex + 1) % playImages.length;
    stage4LastSwitchMs = millis();
  }

  const img = playImages[stage4CarouselIndex];
  if (!img) return;
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  // const frameW = min(bounds.w * 0.52, 760);
  // const frameH = min(bounds.h * 0.52, 470);
  const frameW = bounds.w
  const frameH = bounds.h
  const frameX = bounds.x + (bounds.w - frameW) / 2;
  const frameY = bounds.y + (bounds.h - frameH) / 2;

  image(img, frameX, frameY, frameW, frameH);
}

function drawStage3Flow() {
  if (stage3Step === 1) {
    drawNarrationText(
      "A few days later, you drag your suitcase along and board the flight to the island."
    );
  } else if (stage3Step >= 2) {
    drawDayTag("Day 1");
    if (stage3Step === 3) {
      drawNarrationText(
        "As you step onto the island, the production team has prepared an icebreaker dinner for everyone."
      );
    } else if (stage3Step === 5) {
      drawNarrationText("For the first time, you meet the four male guests of the show.");
    } else if (stage3Step === 6) {
      drawStage3GuestGrid();
      if (stage3SelectedGuest) {
        drawStage3GuestDetail(stage3SelectedGuest);
      }
    } else if (stage3Step === 7) {
      drawNarrationText(
        "After the icebreaker session, the production team announces the schedule and locations for the next day."
      );
    } else if (stage3Step === 8 && stage3PlanVisible) {
      drawStage3PlanImage();
    } else if (stage3Step === 9 && stage3Q1Visible) {
      drawStage3Q1();
    }
  }
}

function updateStage3Q1Buttons() {
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const btnW = min(bounds.w * 0.42, 430);
  const btnH = 52;
  const colGap = min(bounds.w * 0.04, 30);
  const rowGap = min(bounds.h * 0.03, 24);
  const totalW = btnW * 2 + colGap;
  const totalH = btnH * 2 + rowGap;
  const startX = bounds.x + (bounds.w - totalW) / 2;
  const startY = bounds.y + bounds.h * 0.56;

  stage3Q1Buttons = [
    { key: 'A', label: 'A. Artisan Market', x: startX, y: startY, w: btnW, h: btnH },
    { key: 'B', label: 'B. Sunset Bar', x: startX + btnW + colGap, y: startY, w: btnW, h: btnH },
    { key: 'C', label: 'C. Ocean Adventure', x: startX, y: startY + btnH + rowGap, w: btnW, h: btnH },
    { key: 'D', label: 'D. Local Eatery', x: startX + btnW + colGap, y: startY + btnH + rowGap, w: btnW, h: btnH },
  ];
}

function drawStage3Q1() {
  drawNarrationText(
    "After looking over the itinerary, which date spot are you most looking forward to?"
  );

  if (!stage3Q1Buttons.length) updateStage3Q1Buttons();
  for (const btn of stage3Q1Buttons) {
    const selected = stage3Q1Choice === btn.key;
    push();
    fill(selected ? color(255, 255, 255, 56) : color(0, 0, 0, 165));
    stroke(255, 230);
    strokeWeight(1.4);
    rect(btn.x, btn.y, btn.w, btn.h, btn.h / 2);
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(min(width, height) * 0.02);
    text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    pop();
  }
}

function drawStage3PlanImage() {
  if (!planImage) return;
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const smallW = min(bounds.w * 0.22, 260);
  const smallH = (planImage.height / planImage.width) * smallW;
  const largeW = min(bounds.w * 0.58, 720);
  const largeH = (planImage.height / planImage.width) * largeW;

  const targetW = stage3PlanZoomed ? largeW : smallW;
  const targetH = stage3PlanZoomed ? largeH : smallH;
  const targetX = stage3PlanZoomed
    ? bounds.x + (bounds.w - targetW) / 2
    : bounds.x + bounds.w - targetW - 18;
  const targetY = stage3PlanZoomed
    ? bounds.y + (bounds.h - targetH) / 2
    : bounds.y + 18;

  if (!drawStage3PlanImage.state) {
    drawStage3PlanImage.state = { x: targetX, y: targetY, w: targetW, h: targetH };
  }
  const s = drawStage3PlanImage.state;
  s.x = lerp(s.x, targetX, 0.16);
  s.y = lerp(s.y, targetY, 0.16);
  s.w = lerp(s.w, targetW, 0.16);
  s.h = lerp(s.h, targetH, 0.16);

  push();
  fill(0, 0, 0, 90);
  noStroke();
  rect(s.x - 6, s.y - 6, s.w + 12, s.h + 12, 10);
  image(planImage, s.x, s.y, s.w, s.h);
  pop();
}

function drawStage3GuestGrid() {
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const cardW = min(bounds.w * 0.24, 210);
  const cardH = cardW * 1.08;
  const colGap = min(bounds.w * 0.05, 44);
  const rowGap = min(bounds.h * 0.06, 40);
  const totalW = cardW * 2 + colGap;
  const totalH = cardH * 2 + rowGap;
  const startX = bounds.x + (bounds.w - totalW) / 2;
  const startY = bounds.y + (bounds.h - totalH) / 2 + 10;

  stage3GuestCards = [
    { key: 'A', label: 'A', img: luImage, x: startX, y: startY, w: cardW, h: cardH },
    { key: 'B', label: 'B', img: moImage, x: startX + cardW + colGap, y: startY, w: cardW, h: cardH },
    { key: 'C', label: 'C', img: xiaImage, x: startX, y: startY + cardH + rowGap, w: cardW, h: cardH },
    { key: 'D', label: 'D', img: zuoImage, x: startX + cardW + colGap, y: startY + cardH + rowGap, w: cardW, h: cardH },
  ];

  for (const card of stage3GuestCards) {
    push();
    fill(0, 0, 0, 120);
    stroke(255, 220);
    strokeWeight(1.5);
    rect(card.x, card.y, card.w, card.h, 10);
    if (card.img) image(card.img, card.x + 4, card.y + 4, card.w - 8, card.h - 36);
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(`${card.label}`, card.x + card.w / 2, card.y + card.h - 18);
    pop();
  }
}

function drawStage3GuestDetail(guestKey) {
  const details = {
    A: "A - Streetwear brand founder. He's got a brilliant smile and immediately starts making the rounds-clinking glasses, shaking hands, acting like he's known everyone for years.",
    B: "B - A psychologist. He stands quietly at the edge of the group. When he catches your eye, he gives a soft smile and speaks in a gentle, low voice.",
    C: "C - An outdoor guide. He leans against the railing, gazing at the ocean. His skin has that warm, sun-kissed tan. He doesn't say much-just nods at you in acknowledgment.",
    D: "D - An architect. He's been helping the crew set up chairs, quick and efficient. When it's his turn to speak, he keeps it simple, giving a straightforward introduction.",
  };

  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const boxW = min(bounds.w * 0.94, 1100);
  const horizontalPad = 20;
  const verticalPad = 18;
  let fontSize = min(width, height) * 0.022;
  const minFontSize = 10;
  let wrapped = [];
  let textH = 0;
  let lineGap = 0;
  const maxBoxH = bounds.h - 24;


  while (fontSize >= minFontSize) {
    lineGap = fontSize * 0.35;
    textSize(fontSize);
    textStyle(NORMAL);
    wrapped = wrapTextByWidth(details[guestKey] || '', boxW - horizontalPad * 2);
    textH = fontSize * wrapped.length + lineGap * max(0, wrapped.length - 1);
    if (textH + verticalPad * 2 <= maxBoxH) break;
    fontSize -= 1;
  }

  const boxH = min(textH + verticalPad * 2, maxBoxH);
  const boxX = bounds.x + (bounds.w - boxW) / 2;
  const boxY = bounds.y + bounds.h - boxH - 12;

  push();
  fill(0, 0, 0, 175);
  noStroke();
  rect(boxX, boxY, boxW, boxH, 12);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(fontSize);
  textLeading(fontSize + lineGap);
  text(
    wrapped.join('\n'),
    boxX + horizontalPad,
    boxY + verticalPad
  );
  pop();
}

function drawDayTag(label) {
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const margin = 18;
  const x = bounds.x + margin;
  const y = bounds.y + margin;
  const w = 112;
  const h = 38;
  push();
  noStroke();
  fill(0, 0, 0, 150);
  rect(x, y, w, h, 8);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text(label, x + w / 2, y + h / 2 + 1);
  pop();
}

function drawImageBackground(img) {
  const imgAspect = img.width / img.height;
  const canvasAspect = width / height;
  let drawW, drawH, drawX, drawY;
  if (canvasAspect > imgAspect) {
    drawH = height;
    drawW = height * imgAspect;
    drawX = (width - drawW) / 2;
    drawY = 0;
  } else {
    drawW = width;
    drawH = width / imgAspect;
    drawX = 0;
    drawY = (height - drawH) / 2;
  }
  image(img, drawX, drawY, drawW, drawH);
  imageBounds = { x: drawX, y: drawY, w: drawW, h: drawH };
}

function drawStage1Text() {
  const stage1Text =
    "You're a freelance illustrator who's never been in a relationship. Having just wrapped up a big project, you finally welcome a long vacation that lasts two months.";
  drawNarrationText(stage1Text);
}

function drawStage2Text() {
  const stage2Text =
    "In the morning, you're buried in your soft blanket, lost in a sweet dream.";
  drawNarrationText(stage2Text);
}

function drawStage2CallEvent() {

  if (callImage) {
    const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
    const iconW = min(bounds.w * 0.14, 180);
    const iconH = (callImage.height / callImage.width) * iconW;

    const rightPadding = min(bounds.w * 0.03, 26);
    const baseX = bounds.x + bounds.w - iconW - rightPadding;
    const baseY = bounds.y + bounds.h * 0.18;
    const shakeX = sin(frameCount * 0.8) * 4;
    const shakeY = cos(frameCount * 0.6) * 4;
    image(callImage, baseX + shakeX, baseY + shakeY, iconW, iconH);
  }

  drawNarrationText(
    "A sudden, urgent ringtone yanks you out of your dream."
  );
}

function drawStage2PhoneCenterEvent() {
  if (callImage) {
    const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
    const iconH = min(bounds.h * 0.85, 840);
    const iconW = (callImage.width / callImage.height) * iconH;
    const drawX = bounds.x + (bounds.w - iconW) / 2;
    const drawY = bounds.y + (bounds.h - iconH) * 0.38;
    image(callImage, drawX, drawY, iconW, iconH);
  }

  drawNarrationText(
    "Still half-asleep, you fumble to answer the phone. Your best friend's familiar voice explodes from the receiver:\"Hellooo—! You're on break, aren't you?!\""
  );
}

function drawStage2Dialog2Event() {
  if (callImage) {
    const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
    const iconH = min(bounds.h * 0.85, 840);
    const iconW = (callImage.width / callImage.height) * iconH;
    const drawX = bounds.x + (bounds.w - iconW) / 2;
    const drawY = bounds.y + (bounds.h - iconH) * 0.38;
    image(callImage, drawX, drawY, iconW, iconH);
  }

  drawNarrationText(
    "You're still not fully awake, assuming this is just another round of her usual nagging about finding a partner. Just as you're about to mumble a few words and hang up, she excitedly announces:\n\"I signed you up for a dating show! On an island! All-inclusive! Free! Just think of it as a vacation!\""
  );
}

function drawStage2ShockEvent() {
  const shockElapsed = stage2ShockStartMs >= 0 ? millis() - stage2ShockStartMs : 0;
  const isShockActive = shockElapsed < 1000;

  if (callImage) {
    const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
    const iconH = min(bounds.h * 0.85, 840);
    const iconW = (callImage.width / callImage.height) * iconH;
    const centerX = bounds.x + (bounds.w - iconW) / 2;
    const centerY = bounds.y + (bounds.h - iconH) * 0.38;

    const phoneShakeX = isShockActive ? sin(frameCount * 2.5) * 10 : 0;
    const phoneShakeY = isShockActive ? cos(frameCount * 2.1) * 7 : 0;
    image(callImage, centerX + phoneShakeX, centerY + phoneShakeY, iconW, iconH);
  }

  drawNarrationText(
    "You snap awake instantly.\"Wait-what?\"  Before you can even refuse, your phone buzzes again.\nA new message pops up:\"Program Invitation has been sent to your email.\""
  );
}

function drawStage2MessageEvent() {
  if (callImage) {
    const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
    const iconH = min(bounds.h * 0.85, 840);
    const iconW = (callImage.width / callImage.height) * iconH;
    const drawX = bounds.x + (bounds.w - iconW) / 2;
    const drawY = bounds.y + (bounds.h - iconH) * 0.38;
    image(callImage, drawX, drawY, iconW, iconH);
  }

  drawNarrationText(
    "You stare at the words on the screen, falling completely silent.To be honest, you've never really understood what \"liking someone\" even feels like. Not since you were a kid.\nWhat is a racing heart? What does \"compatible\" even mean? You can't even put your own \"type\" into words."
  );
}

function drawStage2PhoneFadeOut() {
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  if (callImage && stage2PhoneAlpha > 0) {
    const iconH = min(bounds.h * 0.85, 840);
    const iconW = (callImage.width / callImage.height) * iconH;
    const drawX = bounds.x + (bounds.w - iconW) / 2;
    const drawY = bounds.y + (bounds.h - iconH) * 0.38;
    push();
    tint(255, stage2PhoneAlpha);
    image(callImage, drawX, drawY, iconW, iconH);
    pop();
  }

  stage2PhoneAlpha = max(0, stage2PhoneAlpha - 18);
  if (stage2PhoneAlpha === 0) {
    stage2PhoneFading = false;
    stage2ChoiceVisible = true;
    updateStage2ChoiceButtons();
  }
}

function updateStage2ChoiceButtons() {
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const btnW = min(bounds.w * 0.28, 260);
  const btnH = 56;
  const gap = min(bounds.w * 0.06, 48);
  const totalW = btnW * 2 + gap;
  const startX = bounds.x + (bounds.w - totalW) / 2;
  const y = bounds.y + bounds.h * 0.78;
  choiceAButton = { x: startX + btnW / 2, y, w: btnW, h: btnH };
  choiceBButton = { x: startX + btnW + gap + btnW / 2, y, w: btnW, h: btnH };
}

function drawChoiceButton(btn, label) {
  push();
  rectMode(CENTER);
  fill(0, 0, 0, 170);
  stroke(255, 230);
  strokeWeight(1.5);
  rect(btn.x, btn.y, btn.w, btn.h, btn.h / 2);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.028);
  text(label, btn.x, btn.y);
  pop();
}

function drawStage2Choices() {
  drawChoiceButton(choiceAButton, 'A. Go');
  drawChoiceButton(choiceBButton, "B. Don't go");
}

function drawStage2BranchResult() {
  background(0);
  fill(255);
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(min(width, height) * 0.034);
  const boxW = width * 0.82;
  const boxX = (width - boxW) / 2;
  const boxY = height * 0.34;
  const boxH = height * 0.34;
  if (stage2BranchResult === 'B') {
    text(
      "You decide not to go. You spend the entire vacation happily holed up at home.\nEnding Achieved: Homebody",
      boxX,
      boxY,
      boxW,
      boxH
    );
  } else if (stage2BranchResult === 'A') {
    text(
      "Ah, whatever.\nIt's not like you have anything better to do.",
      boxX,
      boxY,
      boxW,
      boxH
    );
  }
}

function isInsideButton(mx, my, btn) {
  return (
    mx > btn.x - btn.w / 2 &&
    mx < btn.x + btn.w / 2 &&
    my > btn.y - btn.h / 2 &&
    my < btn.y + btn.h / 2
  );
}

function hitGuestCard(mx, my) {
  for (const card of stage3GuestCards) {
    if (mx >= card.x && mx <= card.x + card.w && my >= card.y && my <= card.y + card.h) {
      return card.key;
    }
  }
  return null;
}

function isInsidePlan(mx, my) {
  const s = drawStage3PlanImage.state;
  if (!s) return false;
  return mx >= s.x && mx <= s.x + s.w && my >= s.y && my <= s.y + s.h;
}

function hitStage3Q1Button(mx, my) {
  for (const btn of stage3Q1Buttons) {
    if (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h) {
      return btn.key;
    }
  }
  return null;
}

function hitGenericChoiceButton(mx, my) {
  for (const btn of genericChoiceButtons) {
    if (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h) {
      return btn.key;
    }
  }
  return null;
}

function saveQuizAnswer(questionIndex, choice) {
  if (questionIndex < 0 || questionIndex >= quizAnswers.length) return;
  quizAnswers[questionIndex] = choice;
}

function advanceStage3Flow() {
  if (stage3Step === 6 && stage3SelectedGuest) {

    stage3SelectedGuest = null;
    return;
  }

  if (stage3Step < 7) {
    stage3Step++;
    if (stage3Step === 2 && bgSeaVideo) {
      bgSeaVideo.loop();
    }
    if (stage3Step === 4 && bgSeaVideo) {
      bgSeaVideo.pause();
    }
  } else if (stage3Step === 7) {
    stage3Step = 8;
    stage3PlanVisible = true;
    stage3PlanZoomed = false;
    stage3Q1Visible = false;
    stage3Q1Choice = null;
    stage3Q1Buttons = [];
  }
}

function resetToHome() {
  stage = 0;
  stage1TextVisible = false;
  stage2TextVisible = false;
  stage2CallVisible = false;
  stage2PhoneCenterVisible = false;
  stage2Dialog2Visible = false;
  stage2ShockVisible = false;
  stage2ShockStartMs = -1;
  stage2MessageVisible = false;
  stage2PhoneFading = false;
  stage2PhoneAlpha = 255;
  stage2ChoiceVisible = false;
  stage2BranchResult = null;
  mediaStarted = false;
  if (callRingtone && callRingtone.isPlaying()) callRingtone.stop();
  if (bgMusic && bgMusic.isPlaying()) bgMusic.stop();
  if (bg2Video) bg2Video.pause();
  if (bg1Video) bg1Video.loop();
}

function startHomeReturnTransition() {
  homeFadeActive = true;
  homeFadeMode = 'to_black';
  homeFadeAlpha = 0;
}

function drawNarrationText(content) {

  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  const textPadding = min(bounds.w, bounds.h) * 0.04;
  const fontSize = min(width, height) * 0.022;
  textSize(fontSize);
  textStyle(NORMAL);
  const horizontalPad = 22;
  const verticalPad = 16;
  const lineGap = fontSize * 0.35;
  const maxTextW = bounds.w * 0.92 - horizontalPad * 2;
  const wrappedLines = wrapTextByWidth(content, maxTextW);
  const longestLineWidth = max(...wrappedLines.map((line) => textWidth(line)));
  const textBlockH = fontSize * wrappedLines.length + lineGap * (wrappedLines.length - 1);
  const boxW = min(longestLineWidth + horizontalPad * 2, bounds.w * 0.92);
  const boxH = textBlockH + verticalPad * 2;
  const boxX = bounds.x + (bounds.w - boxW) / 2;
  const boxY = bounds.y + bounds.h - boxH - textPadding;

  push();
  noStroke();
  fill(0, 0, 0, 155);
  rect(boxX, boxY, boxW, boxH, 14);

  fill(255);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  textSize(fontSize);
  textLeading(fontSize + lineGap);
  text(wrappedLines.join('\n'), boxX + horizontalPad, boxY + verticalPad);
  pop();
}

function wrapTextByWidth(content, maxWidth) {

  const paragraphs = content.split('\n');
  const lines = [];

  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p].trim();
    if (!paragraph) {
      lines.push('');
      continue;
    }

    const words = paragraph.split(/\s+/);
    let current = '';

    for (const word of words) {
      let wordPart = word;

      if (textWidth(wordPart) > maxWidth) {
        if (current) {
          lines.push(current);
          current = '';
        }
        let chunk = '';
        for (const ch of wordPart) {
          const nextChunk = chunk + ch;
          if (textWidth(nextChunk) <= maxWidth) {
            chunk = nextChunk;
          } else {
            if (chunk) lines.push(chunk);
            chunk = ch;
          }
        }
        if (chunk) current = chunk;
        continue;
      }

      const candidate = current ? `${current} ${wordPart}` : wordPart;
      if (textWidth(candidate) <= maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);


    if (p < paragraphs.length - 1) {
      lines.push('');
    }
  }
  return lines;
}

function drawVideoBackground(video) {
  const vw = video?.elt?.videoWidth || video?.width || 1;
  const vh = video?.elt?.videoHeight || video?.height || 1;
  if (!video || vw === 0 || vh === 0) return;
  const videoAspect = vw / vh;
  const canvasAspect = width / height;
  let drawW, drawH, drawX, drawY;
  if (canvasAspect > videoAspect) {
    drawH = height;
    drawW = height * videoAspect;
    drawX = (width - drawW) / 2;
    drawY = 0;
  } else {
    drawW = width;
    drawH = width / videoAspect;
    drawX = 0;
    drawY = (height - drawH) / 2;
  }
  image(video, drawX, drawY, drawW, drawH);
  imageBounds = { x: drawX, y: drawY, w: drawW, h: drawH };
}

function drawGradientBackground() {

  background(0);
}

function drawStartButton() {
  const { x, y, w, h } = startBtn;
  const r = h / 2;
  const hoverScale = btnHover ? 1.03 : 1;

  push();
  translate(x, y);
  scale(hoverScale);


  fill(255, 255, 255, btnHover ? 30 : 18);
  noStroke();
  rect(-w / 2, -h / 2, w, h, r);
  noFill();
  stroke(255, 240);
  strokeWeight(1.5);
  rect(-w / 2, -h / 2, w, h, r);


  fill(255);
  textSize(20);
  textStyle(NORMAL);
  text('Start', 0, 0);
  pop();
}

function updateButtonPosition() {
  const bounds = imageBounds.w > 0 ? imageBounds : { x: 0, y: 0, w: width, h: height };
  startBtn.x = bounds.x + bounds.w / 2;
  startBtn.w = min(200, bounds.w * 0.32);
  startBtn.h = 50;

  startBtn.y = bounds.y + bounds.h - startBtn.h * 0.9;
}

function mouseMoved() {
  if (stage !== 0) {
    btnHover = false;
    return;
  }
  const { x, y, w, h } = startBtn;
  btnHover =
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2;
}

function mousePressed() {
  if (stage === 11) {
    if (stage11Step === 0) {
      stage11Step = 1;
    } else if (stage11Step === 1) {
      if (isInsideStage11Envelope(mouseX, mouseY)) {
        stage11Step = 2;
      }
    } else if (stage11Step === 2) {
      stage11Step = 3;
    } else if (stage11Step >= 3) {
      startHomeReturnTransition();
    }
    return;
  }
  if (stage === 10) {
    if (!stage10CardTextVisible) {
      stage10CardTextVisible = true;
      genericChoiceButtons = [];
    } else {
      const hit = hitGenericChoiceButton(mouseX, mouseY);
      if (hit) {
        stage10Q10Choice = hit;
        saveQuizAnswer(9, hit); // Q10
        stage = 11;
        stage11Step = 0;
        if (bgMusic && !bgMusic.isPlaying()) bgMusic.loop();
      }
    }
    return;
  }
  if (stage === 9) {
    const hit = hitGenericChoiceButton(mouseX, mouseY);
    if (hit) {
      stage9Q9Choice = hit;
      saveQuizAnswer(8, hit); // Q9
      stage = 10;
      stage10CardTextVisible = false;
      stage10Q10Choice = null;
      genericChoiceButtons = [];
      if (bgNightVideo) bgNightVideo.loop();
    }
    return;
  }
  if (stage === 8) {
    const hit = hitGenericChoiceButton(mouseX, mouseY);
    if (hit) {
      stage8Q8Choice = hit;
      saveQuizAnswer(7, hit); // Q8
      stage = 9;
    }
    return;
  }
  if (stage === 7) {
    const hit = hitGenericChoiceButton(mouseX, mouseY);
    if (!hit) return;
    if (stage7Step === 0) {
      stage7Q5Choice = hit;
      saveQuizAnswer(4, hit); // Q5
      stage7Step = 1;
    } else if (stage7Step === 1) {
      stage7Q6Choice = hit;
      saveQuizAnswer(5, hit); // Q6
      stage7Step = 2;
      if (bgNightVideo) bgNightVideo.loop();
    } else {
      stage7Q7Choice = hit;
      saveQuizAnswer(6, hit); // Q7
      if (bgNightVideo) bgNightVideo.pause();
      stage = 8;
    }
    return;
  }
  if (stage === 6) {
    const hit = hitGenericChoiceButton(mouseX, mouseY);
    if (!hit) return;
    if (stage6Step === 0) {
      stage6Q3Choice = hit;
      saveQuizAnswer(2, hit); // Q3
      stage6Step = 1;
    } else {
      stage6Q4Choice = hit;
      saveQuizAnswer(3, hit); // Q4
      stage = 7;
      stage7Step = 0;
    }
    return;
  }
  if (stage === 5) {
    if (!stage5TextVisible) {
      stage5TextVisible = true;
    } else if (!stage5Question2Visible) {
      stage5Question2Visible = true;
    } else {
      const hit = hitGenericChoiceButton(mouseX, mouseY);
      if (hit) {
        stage5Q2Choice = hit;
        saveQuizAnswer(1, hit); // Q2
        stage = 6;
        stage6Step = 0;
      }
    }
    return;
  }
  if (stage === 4) {
    stage = 5;
    stage5TextVisible = true;
    stage5Question2Visible = false;
    genericChoiceButtons = [];
    if (bgSeaVideo) bgSeaVideo.pause();
    return;
  }
  if (stage === 3) {
    if (stage3Step === 9 && stage3Q1Visible) {
      const hit = hitStage3Q1Button(mouseX, mouseY);
      if (hit) {
        stage3Q1Choice = hit;
        saveQuizAnswer(0, hit); // Q1
        stage = 4;
        stage4CarouselIndex = 0;
        stage4LastSwitchMs = millis();
        if (bgSeaVideo) bgSeaVideo.loop();
      }
      return;
    }
    if (stage3Step === 8 && stage3PlanVisible) {
      if (!stage3PlanZoomed) {
        stage3PlanZoomed = true;
      } else if (stage3PlanZoomed) {
        stage3PlanVisible = false;
        stage3Step = 9;
        stage3Q1Visible = true;
        updateStage3Q1Buttons();
      }
      return;
    }
    if (stage3Step === 6) {
      const guest = hitGuestCard(mouseX, mouseY);
      if (guest) {
        stage3SelectedGuest = guest;
        return;
      }
    }
    advanceStage3Flow();
    return;
  }
  if (stage === 1) {
    if (!stage1TextVisible) {
      stage1TextVisible = true;
    } else {
      stage = 2;
      stage1TextVisible = false;
      if (bg2Video) bg2Video.pause();
    }
    return;
  }
  if (stage === 2) {
    if (stage2BranchResult === 'B') {
      startHomeReturnTransition();
      return;
    }
    if (stage2ChoiceVisible) {
      if (isInsideButton(mouseX, mouseY, choiceAButton)) {
        stage2BranchResult = 'A';
        stage = 3;
        stage2ChoiceVisible = false;
        stage3Step = 0;
        stage3SelectedGuest = null;
        stage3PlanVisible = false;
        stage3PlanZoomed = false;
        stage3Q1Visible = false;
        stage3Q1Choice = null;
        stage3Q1Buttons = [];
        drawStage3PlanImage.state = null;
        if (bgSeaVideo) bgSeaVideo.pause();
      } else if (isInsideButton(mouseX, mouseY, choiceBButton)) {
        stage2BranchResult = 'B';
        stage2ChoiceVisible = false;
      }
      return;
    }
    if (stage2PhoneFading || stage2BranchResult) return;

    if (!stage2TextVisible) {
      stage2TextVisible = true;
    } else if (!stage2CallVisible) {
      stage2CallVisible = true;
      if (callRingtone && !callRingtone.isPlaying()) {
        callRingtone.loop();
      }
    } else if (!stage2PhoneCenterVisible) {
      stage2PhoneCenterVisible = true;

      if (callRingtone && callRingtone.isPlaying()) {
        callRingtone.stop();
      }
    } else if (!stage2Dialog2Visible) {
      stage2Dialog2Visible = true;
    } else if (!stage2ShockVisible) {
      stage2ShockVisible = true;
      stage2ShockStartMs = millis();
    } else if (!stage2MessageVisible) {
      stage2MessageVisible = true;
      if (messageSfx) {
        messageSfx.stop();
        messageSfx.play();
      }
    } else if (!stage2PhoneFading && !stage2ChoiceVisible) {
      stage2PhoneFading = true;
      stage2PhoneAlpha = 255;
    }
    return;
  }
  if (stage !== 0) return;
  const { x, y, w, h } = startBtn;
  if (
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2
  ) {
    startMedia();
    onStartClick();
  }
}

function touchStarted() {
  const tx = touches[0]?.x ?? mouseX;
  const ty = touches[0]?.y ?? mouseY;
  if (stage === 11) {
    if (stage11Step === 0) {
      stage11Step = 1;
    } else if (stage11Step === 1) {
      if (isInsideStage11Envelope(tx, ty)) {
        stage11Step = 2;
      }
    } else if (stage11Step === 2) {
      stage11Step = 3;
    } else if (stage11Step >= 3) {
      startHomeReturnTransition();
    }
    return true;
  }
  if (stage === 10) {
    if (!stage10CardTextVisible) {
      stage10CardTextVisible = true;
      genericChoiceButtons = [];
    } else {
      const hit = hitGenericChoiceButton(tx, ty);
      if (hit) {
        stage10Q10Choice = hit;
        saveQuizAnswer(9, hit); // Q10
        stage = 11;
        stage11Step = 0;
        if (bgMusic && !bgMusic.isPlaying()) bgMusic.loop();
      }
    }
    return true;
  }
  if (stage === 9) {
    const hit = hitGenericChoiceButton(tx, ty);
    if (hit) {
      stage9Q9Choice = hit;
      saveQuizAnswer(8, hit); // Q9
      stage = 10;
      stage10CardTextVisible = false;
      stage10Q10Choice = null;
      genericChoiceButtons = [];
      if (bgNightVideo) bgNightVideo.loop();
    }
    return true;
  }
  if (stage === 8) {
    const hit = hitGenericChoiceButton(tx, ty);
    if (hit) {
      stage8Q8Choice = hit;
      saveQuizAnswer(7, hit); // Q8
      stage = 9;
    }
    return true;
  }
  if (stage === 7) {
    const hit = hitGenericChoiceButton(tx, ty);
    if (!hit) return true;
    if (stage7Step === 0) {
      stage7Q5Choice = hit;
      saveQuizAnswer(4, hit); // Q5
      stage7Step = 1;
    } else if (stage7Step === 1) {
      stage7Q6Choice = hit;
      saveQuizAnswer(5, hit); // Q6
      stage7Step = 2;
      if (bgNightVideo) bgNightVideo.loop();
    } else {
      stage7Q7Choice = hit;
      saveQuizAnswer(6, hit); // Q7
      if (bgNightVideo) bgNightVideo.pause();
      stage = 8;
    }
    return true;
  }
  if (stage === 6) {
    const hit = hitGenericChoiceButton(tx, ty);
    if (!hit) return true;
    if (stage6Step === 0) {
      stage6Q3Choice = hit;
      saveQuizAnswer(2, hit); // Q3
      stage6Step = 1;
    } else {
      stage6Q4Choice = hit;
      saveQuizAnswer(3, hit); // Q4
      stage = 7;
      stage7Step = 0;
    }
    return true;
  }
  if (stage === 5) {
    if (!stage5TextVisible) {
      stage5TextVisible = true;
    } else if (!stage5Question2Visible) {
      stage5Question2Visible = true;
    } else {
      const hit = hitGenericChoiceButton(tx, ty);
      if (hit) {
        stage5Q2Choice = hit;
        saveQuizAnswer(1, hit); // Q2
        stage = 6;
        stage6Step = 0;
      }
    }
    return true;
  }
  if (stage === 4) {
    stage = 5;
    stage5TextVisible = true;
    stage5Question2Visible = false;
    genericChoiceButtons = [];
    if (bgSeaVideo) bgSeaVideo.pause();
    return true;
  }
  if (stage === 3) {
    const txStage3 = touches[0]?.x ?? mouseX;
    const tyStage3 = touches[0]?.y ?? mouseY;
    if (stage3Step === 9 && stage3Q1Visible) {
      const hit = hitStage3Q1Button(txStage3, tyStage3);
      if (hit) {
        stage3Q1Choice = hit;
        saveQuizAnswer(0, hit); // Q1
        stage = 4;
        stage4CarouselIndex = 0;
        stage4LastSwitchMs = millis();
        if (bgSeaVideo) bgSeaVideo.loop();
      }
      return true;
    }
    if (stage3Step === 8 && stage3PlanVisible) {
      if (!stage3PlanZoomed) {
        stage3PlanZoomed = true;
      } else if (stage3PlanZoomed) {
        stage3PlanVisible = false;
        stage3Step = 9;
        stage3Q1Visible = true;
        updateStage3Q1Buttons();
      }
      return true;
    }
    if (stage3Step === 6) {
      const guest = hitGuestCard(txStage3, tyStage3);
      if (guest) {
        stage3SelectedGuest = guest;
        return true;
      }
    }
    advanceStage3Flow();
    return true;
  }
  if (stage === 1) {
    if (!stage1TextVisible) {
      stage1TextVisible = true;
    } else {
      stage = 2;
      stage1TextVisible = false;
      if (bg2Video) bg2Video.pause();
    }
    return true;
  }
  if (stage === 2) {
    const txChoice = touches[0]?.x ?? mouseX;
    const tyChoice = touches[0]?.y ?? mouseY;
    if (stage2BranchResult === 'B') {
      startHomeReturnTransition();
      return true;
    }
    if (stage2ChoiceVisible) {
      if (isInsideButton(txChoice, tyChoice, choiceAButton)) {
        stage2BranchResult = 'A';
        stage = 3;
        stage2ChoiceVisible = false;
        stage3Step = 0;
        stage3SelectedGuest = null;
        stage3PlanVisible = false;
        stage3PlanZoomed = false;
        stage3Q1Visible = false;
        stage3Q1Choice = null;
        stage3Q1Buttons = [];
        drawStage3PlanImage.state = null;
        if (bgSeaVideo) bgSeaVideo.pause();
      } else if (isInsideButton(txChoice, tyChoice, choiceBButton)) {
        stage2BranchResult = 'B';
        stage2ChoiceVisible = false;
      }
      return true;
    }
    if (stage2PhoneFading || stage2BranchResult) return true;

    if (!stage2TextVisible) {
      stage2TextVisible = true;
    } else if (!stage2CallVisible) {
      stage2CallVisible = true;
      if (callRingtone && !callRingtone.isPlaying()) {
        callRingtone.loop();
      }
    } else if (!stage2PhoneCenterVisible) {
      stage2PhoneCenterVisible = true;

      if (callRingtone && callRingtone.isPlaying()) {
        callRingtone.stop();
      }
    } else if (!stage2Dialog2Visible) {
      stage2Dialog2Visible = true;
    } else if (!stage2ShockVisible) {
      stage2ShockVisible = true;
      stage2ShockStartMs = millis();
    } else if (!stage2MessageVisible) {
      stage2MessageVisible = true;
      if (messageSfx) {
        messageSfx.stop();
        messageSfx.play();
      }
    } else if (!stage2PhoneFading && !stage2ChoiceVisible) {
      stage2PhoneFading = true;
      stage2PhoneAlpha = 255;
    }
    return true;
  }
  if (stage !== 0) return true;
  const { x, y, w, h } = startBtn;
  if (tx > x - w / 2 && tx < x + w / 2 && ty > y - h / 2 && ty < y + h / 2) {
    startMedia();
    onStartClick();
  }
  return true;
}

function keyPressed() {
  if (stage !== 4 || !playImages.length) return;
  if (keyCode === LEFT_ARROW) {
    stage4CarouselIndex =
      (stage4CarouselIndex - 1 + playImages.length) % playImages.length;
    stage4LastSwitchMs = millis();
  } else if (keyCode === RIGHT_ARROW) {
    stage4CarouselIndex = (stage4CarouselIndex + 1) % playImages.length;
    stage4LastSwitchMs = millis();
  }
}

function onStartClick() {
  stage = 1;
  stage1TextVisible = false;
  stage2TextVisible = false;
  stage2CallVisible = false;
  stage2PhoneCenterVisible = false;
  stage2Dialog2Visible = false;
  stage2ShockVisible = false;
  stage2ShockStartMs = -1;
  stage2MessageVisible = false;
  stage2PhoneFading = false;
  stage2PhoneAlpha = 255;
  stage2ChoiceVisible = false;
  stage2BranchResult = null;
  stage3Step = 0;
  stage3SelectedGuest = null;
  stage3PlanVisible = false;
  stage3PlanZoomed = false;
  stage3Q1Visible = false;
  stage3Q1Choice = null;
  stage3Q1Buttons = [];
  stage4CarouselIndex = 0;
  stage4LastSwitchMs = 0;
  stage5TextVisible = false;
  stage5Question2Visible = false;
  stage5Q2Choice = null;
  stage5Q2Buttons = [];
  stage6Step = 0;
  stage6Q3Choice = null;
  stage6Q4Choice = null;
  stage7Step = 0;
  stage7Q5Choice = null;
  stage7Q6Choice = null;
  stage7Q7Choice = null;
  stage8Q8Choice = null;
  stage9Q9Choice = null;
  stage10CardTextVisible = false;
  stage10Q10Choice = null;
  stage11Step = 0;
  stage11EnvelopeRect = { x: 0, y: 0, w: 0, h: 0 };
  stage11PaperRect = { x: 0, y: 0, w: 0, h: 0 };
  genericChoiceButtons = [];
  quizAnswers = Array(10).fill(null);
  drawStage3PlanImage.state = null;
  if (callRingtone && callRingtone.isPlaying()) callRingtone.stop();
  if (bgNightVideo) bgNightVideo.pause();
  if (bgSeaVideo) bgSeaVideo.pause();
  if (bg1Video) bg1Video.pause();
  if (bg2Video) bg2Video.loop();
  console.log(`Start clicked - 已切换到 BG2 城市街道场景，当前 stage=${stage}`);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateButtonPosition();
}
