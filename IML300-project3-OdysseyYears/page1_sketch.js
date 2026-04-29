let imgs = [];
let sounds = [];

let currentIndex = 0;
let nextIndex = 0;

let alpha = 255;
let fading = false;

let houseImg, personImg, radioImg;

let isPlaying = false;

// ===== 图标 =====
let icons = [];
let iconSounds = [];
let iconPlaying = [false, false, false, false, false, false];
let iconAreas = [];
let iconScales = [1, 1, 1, 1, 1, 1];

// ===== 图标配置（以后只改这里）=====
let iconConfig = [
  { name: "bird",   x: 150, y: 100, size: 200},
  { name: "cat",    xRatio: 0.25, yRatio: 0.65, size: 80 },
  { name: "cloud",  x: -250, y: 80, size: 100, alignRight: true },
  { name: "xy",     x: -375, y: 40, size: 125, alignRight: true },
  { name: "wave",   x: 200, y: -200, size: 100, alignBottom: true },
  { name: "fire",   xRatio: 0.45, yRatio: 0.75, size: 80 }
];

// ===== 对话 =====
let messages = [
  "Hi～",
];

let currentMessage = "";
let showBubble = false;

let personArea = {};
let radioArea = {};

let personScale = 1;
let radioScale = 1;

function preload() {
  imgs[0] = loadImage("imgs/Green.png");
  imgs[1] = loadImage("imgs/Yellow.png");
  imgs[2] = loadImage("imgs/Pink.png");
  imgs[3] = loadImage("imgs/Blue.png");
  imgs[4] = loadImage("imgs/Purple.png");

  houseImg = loadImage("imgs/house.png");
  personImg = loadImage("imgs/peo.png");
  radioImg = loadImage("imgs/syj.png");

  sounds[0] = loadSound("sds/GS.MP3");
  sounds[1] = loadSound("sds/YS.MP3");
  sounds[2] = loadSound("sds/PKS.MP3");
  sounds[3] = loadSound("sds/BS.MP3");
  sounds[4] = loadSound("sds/PS.MP3");

  icons[0] = loadImage("imgs/xn.png");
  icons[1] = loadImage("imgs/xm.png");
  icons[2] = loadImage("imgs/wy.png");
  icons[3] = loadImage("imgs/xy.png");
  icons[4] = loadImage("imgs/hl.png");
  icons[5] = loadImage("imgs/gh.png");

  iconSounds[0] = loadSound("sds/xn.MP3");
  iconSounds[1] = loadSound("sds/xm.MP3");
  iconSounds[2] = loadSound("sds/wy.MP3");
  iconSounds[3] = loadSound("sds/xy.MP3");
  iconSounds[4] = loadSound("sds/hl.MP3");
  iconSounds[5] = loadSound("sds/gh.MP3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("sans-serif");
}

function draw() {
  background(0);

  // ===== 背景 =====
  tint(255, alpha);
  image(imgs[currentIndex], 0, 0, width, height);

  if (fading) {
    tint(255, 255 - alpha);
    image(imgs[nextIndex], 0, 0, width, height);

    alpha -= 10;

    if (alpha <= 0) {
      currentIndex = nextIndex;
      alpha = 255;
      fading = false;

      if (isPlaying) playCurrentMusic();
    }
  }

  noTint();

  // ===== 房子 =====
  let w = min(width * 0.4, 500);
  let h = w * (houseImg.height / houseImg.width);
  let floatY = sin(frameCount * 0.02) * 6;

  let houseX = width / 2 - w / 2;
  let houseY = height / 2 - h / 2 + floatY;

  image(houseImg, houseX, houseY, w, h);

  // ===== 人物 =====
  let basePW = w * 0.27;
  let basePH = basePW * (personImg.height / personImg.width);

  let px = houseX + w * 0.45;
  let py = houseY + h * 0.5;

  let hoverPerson =
    mouseX > px && mouseX < px + basePW &&
    mouseY > py && mouseY < py + basePH;

  personScale = lerp(personScale, hoverPerson ? 1.08 : 1, 0.1);

  let pw = basePW * personScale;
  let ph = basePH * personScale;

  let pX = px - (pw - basePW) / 2;
  let pY = py - (ph - basePH) / 2;

  image(personImg, pX, pY, pw, ph);

  personArea = { x: pX, y: pY, w: pw, h: ph };

  if (showBubble) drawBubble(pX, pY, pw);

  // ===== 收音机 =====
  let baseRW = w * 0.12;
  let baseRH = baseRW * (radioImg.height / radioImg.width);

  let rx = houseX + w * 0.71;
  let ry = houseY + h * 0.64;

  let hoverRadio =
    mouseX > rx && mouseX < rx + baseRW &&
    mouseY > ry && mouseY < ry + baseRH;

  radioScale = lerp(radioScale, hoverRadio ? 1.08 : 1, 0.1);

  let rw = baseRW * radioScale;
  let rh = baseRH * radioScale;

  let rX = rx - (rw - baseRW) / 2;
  let rY = ry - (rh - baseRH) / 2;

  image(radioImg, rX, rY, rw, rh);

  radioArea = { x: rX, y: rY, w: rw, h: rh };

  // ===== 图标 =====
  drawIcons(houseX, houseY, w, h);

  drawArrows();
}

// ===== 图标绘制（修复挤压变形版）=====
function drawIcons(houseX, houseY, w, h) {
  for (let i = 0; i < icons.length; i++) {

    let cfg = iconConfig[i];
    let img = icons[i];

    // 动态计算图片的真实宽高比例
    let aspectRatio = img.height / img.width;
    let baseW = cfg.size;
    let baseH = baseW * aspectRatio;

    let px, py;

    if (cfg.xRatio !== undefined) {
      px = houseX + w * cfg.xRatio;
      py = houseY + h * cfg.yRatio;
    } else {
      px = cfg.alignRight ? width + cfg.x : cfg.x;
      py = cfg.alignBottom ? height + cfg.y : cfg.y;
    }

    // 根据真实比例的宽高来判断鼠标悬浮
    let hover =
      mouseX > px && mouseX < px + baseW &&
      mouseY > py && mouseY < py + baseH;

    iconScales[i] = lerp(iconScales[i], hover ? 1.08 : 1, 0.1);

    let currentW = baseW * iconScales[i];
    let currentH = baseH * iconScales[i];

    let drawX = px - (currentW - baseW) / 2;
    let drawY = py - (currentH - baseH) / 2;

    // 按照计算后的比例绘制，不再固定宽高一致
    image(img, drawX, drawY, currentW, currentH);

    iconAreas[i] = { x: drawX, y: drawY, w: currentW, h: currentH };
  }
}

// ===== 点击 =====
function mousePressed() {

  // 图标
  for (let i = 0; i < iconAreas.length; i++) {
    let a = iconAreas[i];
    if (mouseX > a.x && mouseX < a.x + a.w &&
        mouseY > a.y && mouseY < a.y + a.h) {

      if (iconPlaying[i]) {
        iconSounds[i].stop();
        iconPlaying[i] = false;
      } else {
        iconSounds[i].loop();
        iconPlaying[i] = true;
      }
      return;
    }
  }

  // 人物
  if (mouseX > personArea.x && mouseX < personArea.x + personArea.w &&
      mouseY > personArea.y && mouseY < personArea.y + personArea.h) {
    currentMessage = random(messages);
    showBubble = true;
    return;
  }

  // 收音机
  if (mouseX > radioArea.x && mouseX < radioArea.x + radioArea.w &&
      mouseY > radioArea.y && mouseY < radioArea.y + radioArea.h) {
    toggleMusic();
    return;
  }

  // 箭头
  let margin = 30;
  let size = 40;

  if (mouseX < margin + size) {
    nextIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    fading = true;
  }

  if (mouseX > width - margin - size) {
    nextIndex = (currentIndex + 1) % imgs.length;
    fading = true;
  }
}

// ===== 音乐 =====
function toggleMusic() {
  if (isPlaying) {
    sounds[currentIndex].stop();
    isPlaying = false;
  } else {
    playCurrentMusic();
    isPlaying = true;
  }
}

function playCurrentMusic() {
  for (let s of sounds) {
    if (s.isPlaying()) s.stop();
  }
  sounds[currentIndex].loop();
}

// ===== 气泡 =====
function drawBubble(px, py, pw) {
  let padding = 20;
  let scale = 1.15;

  textSize(16);
  let tw = textWidth(currentMessage);
  let th = 20;

  let bw = (tw + padding * 2) * scale;
  let bh = (th + padding) * scale;

  let bx = px + pw / 2 - bw / 2;
  let by = py - 95;

  noStroke();
  fill(0, 25);
  rect(bx + 6, by + 6, bw, bh, 24);

  fill(255);
  stroke(120);
  strokeWeight(1.5);
  rect(bx, by, bw, bh, 24);

  noStroke();
  fill(60);
  text(currentMessage, bx + (bw - tw) / 2, by + bh / 2 + 6);
}

// ===== 箭头 =====
function drawArrows() {
  let size = 40;
  let margin = 30;

  let leftHover = dist(mouseX, mouseY, margin, height/2) < 60;
  let rightHover = dist(mouseX, mouseY, width-margin, height/2) < 60;

  let sL = leftHover ? size*1.2 : size;
  let sR = rightHover ? size*1.2 : size;

  fill(255, leftHover ? 255 : 190);
  triangle(margin, height/2,
           margin+sL, height/2-sL/2,
           margin+sL, height/2+sL/2);

  fill(255, rightHover ? 255 : 190);
  triangle(width-margin, height/2,
           width-margin-sR, height/2-sR/2,
           width-margin-sR, height/2+sR/2);
}
