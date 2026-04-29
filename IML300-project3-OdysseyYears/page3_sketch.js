let bgImg;
let houseImg;

// ===== 人物 =====
let personImgs = [];
let currentPerson = 0;

// ⭐ 单独配置人物每个状态的大小和位置
let personConfigs = [
  { offsetX: -25, offsetY: 60, width: 120 }, // 人物 0
  { offsetX: -28, offsetY: 60, width: 110 }, // 人物 1
  { offsetX: -25, offsetY: 60, width: 135 }  // 人物 2
];

// 人物相关的动画变量
let personAlpha = 255;
let personScale = 1.0;

// ===== 对话 (已翻译) =====
let messages = [
  "Feeling bored?",
  "Doing simple things can help overcome emptiness when you are bored.",
  "Let's open today's little things blind box!"
];

let currentMessage = "";
let step = -1;

// 气泡的透明度变量
let bubbleAlpha = 0;

let personArea = { x: 0, y: 0, w: 0, h: 0 };

// ===== 礼物盒 =====
let gifts = [];
let giftAreas = [];
let showGifts = false;

// ⭐ 单独配置每个礼物盒的大小和位置
let giftConfigs = [
  { offsetX: -350, offsetY: -90, size: 150 }, // 礼物盒 1 (左上)
  { offsetX: -350, offsetY: 30,  size: 195 }, // 礼物盒 2 (左中)
  { offsetX: -320, offsetY: 175, size: 155 }, // 礼物盒 3 (左下)
  { offsetX: 350,  offsetY: -90, size: 140 }, // 礼物盒 4 (右上)
  { offsetX: 350,  offsetY: 40,  size: 130 }, // 礼物盒 5 (右中)
  { offsetX: 320,  offsetY: 175, size: 140 }  // 礼物盒 6 (右下)
];

// 6个礼物盒的动画与状态
let giftScales = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
let disabledGifts = [false, false, false, false, false, false];
// ⭐ 新增：控制礼物盒依次渐显的透明度数组
let giftAlphas = [0, 0, 0, 0, 0, 0];
let activeGift = -1;

// ===== 任务库 (50个治愈小事，已全翻译为英文) =====
let tasks = [
  "Brew a warm cup of milk and drink it slowly.",
  "Organize your desk and put away the clutter.",
  "Handwrite three words of encouragement to yourself.",
  "Take a slow walk and carefully observe the scenery.",
  "Fold and store the piled up clothes.",
  "Listen to pure music and space out for five minutes.",
  "Peel a sweet piece of fruit for yourself.",
  "Look through childhood photos and recall happy moments.",
  "Do some light stretching to relax stiff shoulders.",
  "Write down random thoughts without logic, just freely.",
  "Turn on a night light and sit quietly for a while.",
  "Wash small items like your mug or mirror.",
  "Learn a short, simple poem.",
  "Open the window and feel the fresh natural air.",
  "Water your plants and take good care of them.",
  "Turn off your phone and stay away from screens for 10 mins.",
  "Apply your favorite hand cream and pamper yourself.",
  "Record one tiny happy thing that happened today.",
  "Try deep breathing slowly to regulate your mood.",
  "Put together a small puzzle and focus on the present.",
  "Organize your photo album and delete junk photos.",
  "Cook a bowl of simple, light, and warm food.",
  "Softly hum a favorite song, don't worry about the tune.",
  "Copy down a piece of healing text.",
  "Take off restrictive clothes and lie down comfortably.",
  "Observe the shapes of clouds and let your imagination run.",
  "Organize small stationery like bookmarks and notes.",
  "Apply a warm compress to your eyes to relieve fatigue.",
  "Send a short greeting to a distant friend.",
  "Try sitting quietly and accepting all negative emotions.",
  "Pick a beautiful picture and set it as your wallpaper.",
  "Do a quick clean-up of a small corner of your room.",
  "Taste a favorite candy to sweeten your mood.",
  "Recall a small moment when you were treated tenderly.",
  "Learn a super simple life hack.",
  "Step barefoot on the floor and relax your feet.",
  "Plan one small thing for tomorrow to build anticipation.",
  "Watch a very short, healing video clip.",
  "Rub your hands together to warm them up.",
  "Sort your bookmarks and clear out cluttered info.",
  "Smell the faint scent of laundry detergent.",
  "Take a slow walk in place to move your body.",
  "Write down recent worries, then close the notebook.",
  "Take a bite of food and slowly, carefully taste it.",
  "Give yourself a big, warm hug.",
  "Learn about a small flower or plant you haven't seen.",
  "Dim the lights to create a relaxing atmosphere.",
  "Quit short videos for 5 minutes and empty your mind.",
  "Fix a small broken item, like a hair tie.",
  "Look up at the sky, whether it's sunny or cloudy."
];

// ===== 选项 =====
let optionAreas = [];

function preload() {
  bgImg = loadImage("imgs/page3.png");
  houseImg = loadImage("imgs/house.png");

  personImgs[0] = loadImage("imgs/peo3-3.png");
  personImgs[1] = loadImage("imgs/peo3-2.png");
  personImgs[2] = loadImage("imgs/peo3.png");

  for (let i = 1; i <= 6; i++) {
    gifts[i - 1] = loadImage(`imgs/lw${i}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // ⭐ 动态加载 Share Tech 字体
  let fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Share+Tech&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  textFont("'Share Tech', sans-serif");
}

function draw() {
  background(0);

  // ===== 背景 =====
  image(bgImg, 0, 0, width, height);

  // ===== 房子 =====
  let w = min(width * 0.4, 500);
  let h = w * (houseImg.height / houseImg.width);
  let floatY = sin(frameCount * 0.02) * 6;

  let houseX = width / 2 - w / 2;
  let houseY = height / 2 - h / 2 + floatY;

  image(houseImg, houseX, houseY, w, h);

  // ===== 人物 Hover 与渐显逻辑 =====
  let isPersonHovered =
    mouseX > personArea.x &&
    mouseX < personArea.x + personArea.w &&
    mouseY > personArea.y &&
    mouseY < personArea.y + personArea.h;

  personScale = lerp(personScale, isPersonHovered ? 1.08 : 1.0, 0.2);
  personAlpha = lerp(personAlpha, 255, 0.15);

  let configIndex = min(step < 0 ? 0 : step, 2);
  let pConfig = personConfigs[configIndex];
  let pImg = personImgs[configIndex];

  let pw = pConfig.width * personScale;
  let ph = (pConfig.width * (pImg.height / pImg.width)) * personScale;

  let centerX = houseX + w / 2;
  let centerY = houseY + h / 2;

  let px = centerX + pConfig.offsetX - pw / 2;
  let py = centerY + pConfig.offsetY - ph / 2;

  tint(255, personAlpha);
  image(pImg, px, py, pw, ph);
  noTint();

  personArea = { x: px, y: py, w: pw, h: ph };

  // ===== 气泡 =====
  if (step >= 0) {
    drawBubble(px, py, pw);
  }

  // ===== 选项按钮 =====
  if (step === 3) {
    drawOptions(px, py, pw);
  }

  // ===== 礼物盒 =====
  if (showGifts) {
    drawGifts(houseX, houseY, w, h);
  }
}

// ===== 点击 =====
function mousePressed() {

  // 1. 优先判断是否点击了“就这个”或“换一个”
  if (step === 3) {
    for (let i = 0; i < optionAreas.length; i++) {
      let a = optionAreas[i];
      if (mouseX > a.x && mouseX < a.x + a.w && mouseY > a.y && mouseY < a.y + a.h) {

        if (i === 0) {
          // This one!
          step = 4;
          currentMessage = "Go enjoy this little thing!"; // ⭐ 英文翻译
          bubbleAlpha = 0;
        } else {
          // Another one!
          disabledGifts[activeGift] = true;
          activeGift = -1;
          step = 2;

          let allDisabled = disabledGifts.every(val => val === true);
          currentMessage = allDisabled ? "All blind boxes are opened, pick one to complete!" : "Pick another blind box!";
          bubbleAlpha = 0;
        }
        return;
      }
    }
  }

  // 2. 判断礼物盒点击
  if (showGifts && step === 2) {
    for (let i = 0; i < giftAreas.length; i++) {
      let g = giftAreas[i];

      // 若点击了未置灰，且已经渐显出来的礼物盒
      if (mouseX > g.x && mouseX < g.x + g.w && mouseY > g.y && mouseY < g.y + g.h && !disabledGifts[i] && giftAlphas[i] > 150) {
        currentMessage = random(tasks);
        activeGift = i;
        step = 3;
        bubbleAlpha = 0;
        return;
      }
    }
  }

  // 3. 点击人物推进开场对话
  if (
    mouseX > personArea.x &&
    mouseX < personArea.x + personArea.w &&
    mouseY > personArea.y &&
    mouseY < personArea.y + personArea.h
  ) {
    if (step < 2) {
      step++;
      currentPerson = step;
      currentMessage = messages[step];

      personAlpha = 0;
      bubbleAlpha = 0;

      if (step === 2) {
        showGifts = true;
      }
    }
    return;
  }
}

// ===== 气泡 =====
function drawBubble(px, py, pw) {
  bubbleAlpha = lerp(bubbleAlpha, 255, 0.15);

  textSize(16);
  let padding = 20;

  // ⭐ 优化气泡的换行尺寸计算，适配英文长文本
  let rawTw = textWidth(currentMessage);
  let tw = min(max(rawTw, 180), 380); // 最小 180，最大 380
  let isMultiLine = rawTw > 380;
  let th = isMultiLine ? 90 : 60; // 多行变高

  let bx = px + pw / 2 - tw / 2 - padding;
  let by = py - th - 30; // 向上偏移

  noStroke();
  fill(0, 25 * (bubbleAlpha / 255));
  rect(bx + 6, by + 6, tw + padding * 2, th, 22);

  fill(255, bubbleAlpha);
  stroke(120, bubbleAlpha);
  rect(bx, by, tw + padding * 2, th, 22);

  noStroke();
  fill(60, bubbleAlpha);
  textAlign(CENTER, CENTER);
  textLeading(20);

  // 利用文本边界让英文自动居中换行
  text(currentMessage, bx + padding, by + padding / 2, tw, th - padding);
}

// ===== 选项按钮 =====
function drawOptions(px, py, pw) {
  optionAreas = [];
  let options = ["This one!", "Another one!"]; // ⭐ 英文翻译

  let bw = 120; // 适配英文略微加宽按钮
  let bh = 36;
  let gap = 140;
  let center = px + pw / 2;
  let y = py - 30;

  for (let i = 0; i < options.length; i++) {
    let x = center + (i === 0 ? -gap / 2 : gap / 2) - bw / 2;

    fill(255, bubbleAlpha);
    stroke(120, bubbleAlpha);
    rect(x, y, bw, bh, 15);

    fill(60, bubbleAlpha);
    noStroke();
    textAlign(CENTER, CENTER);
    text(options[i], x + bw / 2, y + bh / 2);

    optionAreas[i] = { x: x, y: y, w: bw, h: bh };
  }
}

// ===== 礼物盒 (带依次渐显动画) =====
function drawGifts(houseX, houseY, w, h) {
  giftAreas = [];

  let centerX = houseX + w / 2;
  let centerY = houseY + h / 2;

  for (let i = 0; i < gifts.length; i++) {

    // ⭐ 依次渐显逻辑：前一个盒子透明度超过 100 时，后一个盒子才开始出现
    if (i === 0 || giftAlphas[i - 1] > 100) {
      giftAlphas[i] = lerp(giftAlphas[i], 255, 0.1);
    }

    let config = giftConfigs[i];
    let baseSize = config.size;

    let cx = centerX + config.offsetX;
    let cy = centerY + config.offsetY;

    // Hover 生效条件包含 giftAlphas[i] > 200 (防止还没出现就能交互)
    let isHovered =
      mouseX > cx - baseSize / 2 &&
      mouseX < cx + baseSize / 2 &&
      mouseY > cy - baseSize / 2 &&
      mouseY < cy + baseSize / 2 &&
      step === 2 &&
      !disabledGifts[i] &&
      giftAlphas[i] > 200;

    giftScales[i] = lerp(giftScales[i], isHovered ? 1.15 : 1.0, 0.2);

    let currentSize = baseSize * giftScales[i];
    let x = cx - currentSize / 2;
    let y = cy - currentSize / 2;

    // 应用透明度（包含依次渐显）
    tint(255, giftAlphas[i]);

    if (disabledGifts[i]) {
      drawingContext.filter = 'grayscale(100%) opacity(70%)';
      image(gifts[i], x, y, currentSize, currentSize);
      drawingContext.filter = 'none';
    } else {
      image(gifts[i], x, y, currentSize, currentSize);
    }

    noTint(); // 清除 tint 状态，防止污染其他画面

    giftAreas[i] = { x: x, y: y, w: currentSize, h: currentSize };
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
