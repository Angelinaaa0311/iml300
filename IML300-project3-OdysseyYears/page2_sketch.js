let bgImg, houseImg;

// ===== 人物 =====
let personImgs = [];
let currentPerson = 0;
let personAlpha = 255;

// ⭐ 单独配置人物每个动作状态的大小和位置
let personConfigs = [
  { offsetX: 80, offsetY: 60, width: 200 }, // 人物 0 (默认)
  { offsetX: -100, offsetY: 60, width: 100 }, // 人物 1
  { offsetX: 80, offsetY: 70, width: 120 }, // 人物 2
  { offsetX: 80, offsetY: 80, width: 100 }  // 人物 3
];

// ⭐ 新增：人物相关的缩放变量（用于 Hover）
let personScale = 1.0;

// ===== 植物 =====
let plantImgs = [];
let plantStage = -1;
let plantAlpha = 255;
let growing = false;

// ⭐ 单独配置树苗每个成长阶段的大小和位置
let plantConfigs = [
  { offsetX: -20, offsetY: 130, width: 100 }, // 阶段 0
  { offsetX: -17, offsetY: 135, width: 140 }, // 阶段 1
  { offsetX: -25, offsetY: 115, width: 140 }, // 阶段 2
  { offsetX: -23, offsetY: 80, width: 190 }, // 阶段 3
  { offsetX: -23, offsetY: 55, width: 200 }, // 阶段 4
  { offsetX: -20, offsetY: -30, width: 400 }, // 阶段 5
  { offsetX: -20, offsetY: -40, width: 500 }, // 阶段 6
  { offsetX: -45, offsetY: -70, width: 500 }  // 阶段 7
];

// ===== 工具 =====
let tools = [];
let toolAreas = [];

// ⭐ 单独配置每一个工具的大小和相对位置
let toolConfigs = [
  { offsetX: -110, offsetY: -30, width: 110 },  // 工具 1
  { offsetX: 10,    offsetY: 0, width: 80 },  // 工具 2
  { offsetX: 120,  offsetY: 0, width: 80 }   // 工具 3
];

// ⭐ 新增：工具的悬停缩放比例数组
let toolScales = [1.0, 1.0, 1.0];

// ===== 对话系统 =====
let dialogueStep = -1;
let showBubble = false;
let showButton = false;

// 对话气泡和按钮的透明度（用于渐显动画）
let bubbleAlpha = 0;
let buttonAlpha = 0;

let personArea = { x: 0, y: 0, w: 0, h: 0 };
let buttonArea = {};
let optionAreas = [];

let currentMessage = "";

// ===== 🍎 苹果系统 =====
let apples = [];
let appleImg;
let appleMessages = [
  "Believe in your ability to overcome any difficulty and trust that you will eventually reach your ideal destination. It's normal to feel afraid, anxious, or lost in your twenties. Don't be defeated by toxic success culture and empty rhetoric on the internet.",
  "Build trust in yourself. Tell yourself, 'I have the courage to face the unknown and conquer it.' Don't run away. If you don't believe you can overcome the hurdle in front of you, no one else's belief in you will help.",
  "Allow yourself to feel down, confused, anxious, and terrified. Face and accept your negative emotions; otherwise, you won't find a way to overcome them. Only by walking into the darkness can you cross it.",
  "Be patient. The Odyssey years are a long and difficult time. You cannot become the person you want to be in just a day or two. You must carefully sculpt your inner self bit by bit.",
  "Build multiple anchor points in your life. Don't put all your focus solely on love or work. You are only in your twenties, with plenty of time and experiences to spend. When you have multiple anchors, you have multiple safe havens.",
  "No matter how beautiful someone else's life looks, it's just their timeline. Measuring your life with someone else's ruler will always be wrong. You dictate your own pace.",
  "Don't wait until you are 'completely ready' to start. The truth is, you will never have a day where you are 100% ready. Just aim for sixty percent first; starting is always more important than doing it perfectly."
];

let showAppleMessage = false;
let currentAppleText = "";
// 控制苹果文字气泡的位置和消失动画
let appleMsgAlpha = 0;
let appleMsgPos = { x: 0, y: 0 };
let appleMsgFading = false;

// ===== 资源 =====
function preload() {
  bgImg = loadImage("imgs/page2.png");
  houseImg = loadImage("imgs/house.png");

  personImgs[0] = loadImage("imgs/peo2.png");
  personImgs[1] = loadImage("imgs/jiaoshui.png");
  personImgs[2] = loadImage("imgs/pen.png");
  personImgs[3] = loadImage("imgs/baosun.png");

  for (let i = 0; i <= 7; i++) {
    plantImgs[i] = loadImage(`imgs/${i}.png`);
  }

  tools[0] = loadImage("imgs/sh.png");
  tools[1] = loadImage("imgs/scj.png");
  tools[2] = loadImage("imgs/sun.png");

  appleImg = loadImage("imgs/pg.png");
}

// ===== setup =====
function setup() {
  createCanvas(windowWidth, windowHeight);

  // 动态加载 Share Tech 字体
  let fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Share+Tech&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  // 应用字体
  textFont("'Share Tech', sans-serif");
}

// ===== draw =====
function draw() {
  background(0);
  if (bgImg) {
    image(bgImg, 0, 0, width, height);
  }

  let w = min(width * 0.4, 500);
  let h = w * (houseImg.height / houseImg.width);
  let floatY = sin(frameCount * 0.02) * 6;

  let houseX = width / 2 - w / 2;
  let houseY = height / 2 - h / 2 + floatY;

  image(houseImg, houseX, houseY, w, h);

  // ===== ⭐ 人物 Hover 与缩放逻辑 =====
  // 判断鼠标是否在人物区域内，并且只有在处于等待对话点击时才产生 Hover 效果
  let isPersonHovered =
    mouseX > personArea.x &&
    mouseX < personArea.x + personArea.w &&
    mouseY > personArea.y &&
    mouseY < personArea.y + personArea.h &&
    dialogueStep === -1;

  personScale = lerp(personScale, isPersonHovered ? 1.08 : 1.0, 0.2);

  let pConfig = personConfigs[currentPerson];
  let pImg = personImgs[currentPerson];

  // 结合缩放比例计算实际显示的宽高
  let pw = pConfig.width * personScale;
  let ph = (pConfig.width * (pImg.height / pImg.width)) * personScale;

  let centerX = houseX + w / 2;
  let centerY = houseY + h / 2;

  // 根据缩放后的尺寸计算渲染坐标（保持中心对齐）
  let px = centerX + pConfig.offsetX - pw / 2;
  let py = centerY + pConfig.offsetY - ph / 2;

  personAlpha = lerp(personAlpha, 255, 0.1);

  tint(255, personAlpha);
  image(pImg, px, py, pw, ph);
  noTint();

  personArea = { x: px, y: py, w: pw, h: ph };

  // ===== 植物 =====
  if (plantStage >= 0) {
    let config = plantConfigs[plantStage];
    let img = plantImgs[plantStage];

    let sw = config.width;
    let sh = sw * (img.height / img.width);

    let sx = centerX + config.offsetX - sw / 2;
    let sy = centerY + config.offsetY - sh / 2;

    plantAlpha = lerp(plantAlpha, 255, 0.1);

    if (plantAlpha > 250) growing = false;

    tint(255, plantAlpha);
    image(img, sx, sy, sw, sh);
    noTint();
  }

  // ===== 🍎 苹果 =====
  drawApples();

  // ===== 气泡 =====
  if (showBubble) {
    bubbleAlpha = lerp(bubbleAlpha, 255, 0.1);
    drawBubble(px, py, pw);
  }

  // ===== 选项 =====
  if (dialogueStep === 0) {
    drawOptions(px, py, pw);
  }

  // ===== YES =====
  if (showButton) {
    buttonAlpha = lerp(buttonAlpha, 255, 0.1);
    drawButton(houseX, houseY, w, h);
  }

  // ===== 工具 =====
  if (dialogueStep === 2) drawTools(houseX, houseY, w, h);

  // ===== 🍎 鼓励文字 =====
  if (showAppleMessage) drawAppleMessage();
}

// ===== 点击 =====
function mousePressed() {
  // 🍎 点击苹果
  for (let i = apples.length - 1; i >= 0; i--) {
    let a = apples[i];

    if (dist(mouseX, mouseY, a.x, a.y) < a.size) {
      currentAppleText = random(appleMessages);
      showAppleMessage = true;
      appleMsgAlpha = 255;
      appleMsgFading = false;

      let maxBoxWidth = min(480, width - 40);
      appleMsgPos.x = random(20, max(20, width - maxBoxWidth - 20));
      appleMsgPos.y = random(20, max(20, height - 250));

      apples.splice(i, 1);
      return;
    }
  }

  // 点击任意区域让苹果文字气泡开始渐渐消失
  if (showAppleMessage && !appleMsgFading) {
    appleMsgFading = true;
    return;
  }

  // 点击任意区域让结束语消失
  if (dialogueStep === 2 && showBubble) {
    showBubble = false;
    return;
  }

  // 点击人物
  if (
    mouseX > personArea.x &&
    mouseX < personArea.x + personArea.w &&
    mouseY > personArea.y &&
    mouseY < personArea.y + personArea.h &&
    dialogueStep === -1
  ) {
    dialogueStep = 0;
    showBubble = true;
    bubbleAlpha = 0;
    currentMessage = "How was your day?";
    return;
  }

  // 点击选项
  for (let i = 0; i < optionAreas.length; i++) {
    let a = optionAreas[i];

    if (
      mouseX > a.x &&
      mouseX < a.x + a.w &&
      mouseY > a.y &&
      mouseY < a.y + a.h
    ) {
      dialogueStep = 1;
      currentMessage = "Want to plant a tree with me?";
      bubbleAlpha = 0;
      showButton = true;
      buttonAlpha = 0;
      return;
    }
  }

  // 点击 YES
  if (
    showButton &&
    mouseX > buttonArea.x &&
    mouseX < buttonArea.x + buttonArea.w &&
    mouseY > buttonArea.y &&
    mouseY < buttonArea.y + buttonArea.h
  ) {
    showButton = false;
    dialogueStep = 2;

    plantStage = 0;
    plantAlpha = 80;
    growing = true;

    currentMessage = "Remember to take good care of it!";
    bubbleAlpha = 0;
    return;
  }

  // 点击工具
  if (dialogueStep === 2) {
    for (let i = 0; i < toolAreas.length; i++) {
      let a = toolAreas[i];

      if (
        mouseX > a.x &&
        mouseX < a.x + a.w &&
        mouseY > a.y &&
        mouseY < a.y + a.h
      ) {
        currentPerson = i + 1;
        personAlpha = 80;

        if (plantStage < 7 && !growing) {
          plantStage++;
          plantAlpha = 80;
          growing = true;

          createApple();
        }

        return;
      }
    }
  }
}

// ===== 🍎 生成苹果 =====
function createApple() {
  let x = random(50, width - 50);
  let y = random(50, height - 150);

  apples.push({
    x: x,
    y: y,
    size: 60,
    alpha: 0,
    scale: 1.0 // ⭐ 新增：苹果悬停动画比例
  });
}

// ===== 🍎 绘制苹果 =====
function drawApples() {
  for (let a of apples) {
    a.alpha = lerp(a.alpha, 255, 0.1);

    // ⭐ 新增：检测鼠标是否悬停在苹果上，平滑过渡缩放
    let isHovered = dist(mouseX, mouseY, a.x, a.y) < a.size;
    a.scale = lerp(a.scale, isHovered ? 1.2 : 1.0, 0.2);

    tint(255, a.alpha);
    if (appleImg) {
      let currentSize = a.size * a.scale;
      let ah = currentSize * (appleImg.height / appleImg.width);
      // 根据缩放尺寸计算中心渲染偏移
      image(appleImg, a.x - currentSize / 2, a.y - ah / 2, currentSize, ah);
    }
    noTint();
  }
}

// ===== 🍎 鼓励文字 =====
function drawAppleMessage() {
  if (appleMsgAlpha <= 0) {
    showAppleMessage = false;
    appleMsgFading = false;
    return;
  }

  if (appleMsgFading) {
    appleMsgAlpha -= 5;
  }

  let w = min(480, width - 40);
  let h = 180;
  let x = appleMsgPos.x;
  let y = appleMsgPos.y;

  fill(0, 160 * (appleMsgAlpha / 255));
  noStroke();
  rect(x, y, w, h, 20);

  fill(255, appleMsgAlpha);
  textAlign(CENTER, CENTER);
  textSize(16);
  textLeading(22);
  text(currentAppleText, x + 20, y + 20, w - 40, h - 40);
}

// ===== 气泡 =====
function drawBubble(px, py, pw) {
  textSize(18);

  let padding = 20;
  let tw = textWidth(currentMessage);

  let bx = px + pw / 2 - tw / 2 - padding;
  let by = py - 90;

  noStroke();
  fill(0, 25 * (bubbleAlpha / 255));
  rect(bx + 6, by + 6, tw + padding * 2, 50, 22);

  fill(255, bubbleAlpha);
  stroke(120, bubbleAlpha);
  rect(bx, by, tw + padding * 2, 50, 22);

  fill(60, bubbleAlpha);
  noStroke();
  textAlign(CENTER, CENTER);
  text(currentMessage, bx + (tw + padding * 2) / 2, by + 25);
}

// ===== 选项 =====
function drawOptions(px, py, pw) {
  optionAreas = [];

  let options = ["Bad", "Okay", "Great"];
  let bw = 80;
  let bh = 30;
  let gap = 100;

  let startX = px + pw / 2 - gap;
  let y = py - 20;

  for (let i = 0; i < options.length; i++) {
    let x = startX + i * gap;

    fill(255, bubbleAlpha);
    stroke(120, bubbleAlpha);
    rect(x, y, bw, bh, 10);

    fill(60, bubbleAlpha);
    noStroke();
    textAlign(CENTER, CENTER);
    text(options[i], x + bw / 2, y + bh / 2);

    optionAreas[i] = { x, y, w: bw, h: bh };
  }
}

// ===== YES =====
function drawButton(houseX, houseY, w, h) {
  let bw = 80;
  let bh = 35;

  let bx = houseX + w / 2 - bw / 2;
  let by = houseY + h + 20;

  fill(255, buttonAlpha);
  stroke(120, buttonAlpha);
  rect(bx, by, bw, bh, 10);

  fill(60, buttonAlpha);
  noStroke();
  textAlign(CENTER, CENTER);
  text("YES", bx + bw / 2, by + bh / 2);

  buttonArea = { x: bx, y: by, w: bw, h: bh };
}

// ===== 工具 =====
function drawTools(houseX, houseY, w, h) {
  toolAreas = [];

  let centerX = houseX + w / 2;
  let baseY = houseY + h + 20;

  for (let i = 0; i < tools.length; i++) {
    let img = tools[i];
    let config = toolConfigs[i];

    let baseW = config.width;
    let baseH = baseW * (img.height / img.width);

    // 计算原本的中心点位置，用作缩放和悬停判定的依据
    let cx = centerX + config.offsetX;
    let cy = baseY + config.offsetY + baseH / 2;

    // ⭐ 新增：检测鼠标是否在工具上，只在 dialogueStep === 2 (可点击状态) 触发
    let isHovered =
      mouseX > cx - baseW / 2 &&
      mouseX < cx + baseW / 2 &&
      mouseY > cy - baseH / 2 &&
      mouseY < cy + baseH / 2 &&
      dialogueStep === 2;

    toolScales[i] = lerp(toolScales[i], isHovered ? 1.15 : 1.0, 0.2);

    // 结合缩放比例计算显示的宽高
    let toolW = baseW * toolScales[i];
    let toolH = toolW * (img.height / img.width);

    // 绘制坐标（保持中心对齐）
    let x = cx - toolW / 2;
    let y = cy - toolH / 2;

    image(img, x, y, toolW, toolH);

    toolAreas[i] = { x: x, y: y, w: toolW, h: toolH };
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
