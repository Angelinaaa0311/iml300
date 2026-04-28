let bgImg, fogImg, fogLayer;
let isCleared = false;
let fogAlpha = 255;
let bgProps = { x: 0, y: 0, w: 0, h: 0 };
let scrollY = 0;
let maxScroll = 0;
let drops = [];
let letterPositions = {};

// --- 【雨伞插件变量】 ---
let umbrellaImages = [];
let showFinalMenu = false;
let menuUmbrellas = [];
let appearanceOrder = [2, 1, 4, 3, 0]; // 顺序 3,2,5,4,1 对应的索引

function preload() {
  bgImg = loadImage('imgs/BG-2.jpeg');
  fogImg = loadImage('imgs/BG-1.jpeg');

  // --- 【关键改动】：后缀改为 .png ---
  for (let i = 1; i <= 5; i++) {
    umbrellaImages.push(loadImage(`imgs/U${i}.png`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("'Share Tech', sans-serif");
  calculateLongImage();

  fogLayer = createGraphics(windowWidth, windowHeight);
  fogLayer.image(fogImg, bgProps.x, bgProps.y, bgProps.w, bgProps.h);

  for (let i = 0; i < 80; i++) {
    drops.push(new Drop());
  }

  // 初始化雨伞数据
  menuUmbrellas = [
    { img: umbrellaImages[0], x: width * 0.25, y: height * 0.20, url: 'page-1.html', size: 275, alpha: 0 },
    { img: umbrellaImages[1], x: width * 0.18, y: height * 0.65, url: 'page-2.html', size: 375, alpha: 0 },
    { img: umbrellaImages[2], x: width * 0.50, y: height * 0.50, url: 'page-3.html', size: 260, alpha: 0 },
    { img: umbrellaImages[3], x: width * 0.45, y: height * 0.80, url: 'page-4.html', size: 250, alpha: 0 },
    { img: umbrellaImages[4], x: width * 0.78, y: height * 0.60, url: 'page-5.html', size: 360, alpha: 0 }
  ];
}

function draw() {
  background('#1a1a1a');

  // 1. 确定背景坐标
  let currentY = showFinalMenu ? (bgProps.y - maxScroll) : (bgProps.y - scrollY);
  image(bgImg, bgProps.x, currentY, bgProps.w, bgProps.h);

  let fadeProgress = map(fogAlpha, 255, 0, 0, 1, true);

  // 2. 原始擦雾逻辑
  if (!isCleared) {
    if (mouseIsPressed) {
      fogLayer.erase();
      fogLayer.noStroke();
      fogLayer.ellipse(mouseX, mouseY, 200, 200);
      fogLayer.noErase();
    }
    if (frameCount % 30 === 0) checkWipeProgress();
  } else {
    if (fogAlpha > 0) fogAlpha -= 3;
  }

  // 3. 下雨逻辑（菜单页保留）
  if (isCleared) {
    for (let i = 0; i < drops.length; i++) {
      drops[i].fall();
      drops[i].show(fadeProgress);
    }
  }

  // 4. 原始雾气渲染
  if (fogAlpha > 0) {
    tint(255, fogAlpha);
    image(fogLayer, 0, 0);
    noTint();
  }

  // 5. 文字与雨伞分流
  if (isCleared) {
    if (!showFinalMenu) {
      drawScrollText(fadeProgress);
      if (scrollY >= maxScroll * 0.95) {
        fill(255, 120 + sin(frameCount*0.1)*100);
        textAlign(CENTER); textSize(16);
        text("Click screen to open umbrellas", width/2, height - 40);
      }
    } else {
      drawUmbrellaPlugin();
    }
  }
}

function drawUmbrellaPlugin() {
  let isHover = false;
  imageMode(CENTER);

  for (let i = 0; i < appearanceOrder.length; i++) {
    let idx = appearanceOrder[i];
    let u = menuUmbrellas[idx];

    // 依次渐显
    let prevAlpha = (i === 0) ? 255 : menuUmbrellas[appearanceOrder[i-1]].alpha;
    if (prevAlpha > 150 && u.alpha < 255) u.alpha += 5;

    if (u.alpha > 0) {
      let d = dist(mouseX, mouseY, u.x, u.y);
      let s = (d < u.size/2) ? u.size * 1.1 : u.size;
      if (d < u.size/2) isHover = true;

      push();
      tint(255, u.alpha); // PNG 透明度处理
      image(u.img, u.x, u.y, s, s);
      pop();
    }
  }
  imageMode(CORNER);
  if (isHover) cursor(HAND); else cursor(ARROW);

  fill(255); textAlign(CENTER); textSize(22);
  text("Choose your umbrella to continue...", width/2, 100);
}

// ======================================================
// 后面所有函数（文字物理、滚动逻辑、雨滴类）均保持原样不动
// ======================================================

function interactiveText(txt, x, y, lineID) {
  let chars = txt.split('');
  let totalW = textWidth(txt);
  let currentX = x - totalW / 2;
  for (let i = 0; i < chars.length; i++) {
    let char = chars[i];
    let charW = textWidth(char);
    let charHomeX = currentX + charW / 2;
    let charHomeY = y;
    let id = lineID + "_" + i;
    if (!letterPositions[id]) letterPositions[id] = { x: 0, y: 0 };
    let d = dist(mouseX, mouseY, charHomeX, charHomeY);
    let targetX = 0; let targetY = 0;
    if (d < 100) {
      let angle = atan2(charHomeY - mouseY, charHomeX - mouseX);
      let distPush = map(d, 0, 100, 50, 0);
      targetX = cos(angle) * distPush;
      targetY = sin(angle) * distPush;
    }
    letterPositions[id].x = lerp(letterPositions[id].x, targetX, 0.1);
    letterPositions[id].y = lerp(letterPositions[id].y, targetY, 0.1);
    text(char, charHomeX + letterPositions[id].x, charHomeY + letterPositions[id].y);
    currentX += charW;
  }
}

function drawScrollText(fadeProgress) {
  textAlign(CENTER, CENTER);
  noStroke();
  let ctx = drawingContext;
  let shadowAlpha = 180 * fadeProgress;
  ctx.shadowColor = `rgba(0, 15, 40, ${shadowAlpha})`; ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

  function getAlpha(startFadeIn, endFadeIn, startFadeOut, endFadeOut) {
    let startIn = maxScroll * startFadeIn; let endIn = maxScroll * endFadeIn;
    let startOut = maxScroll * startFadeOut; let endOut = maxScroll * endFadeOut;
    let alpha = 0;
    if (scrollY >= startIn && scrollY <= endIn) {
      alpha = (startIn === endIn) ? 255 : map(scrollY, startIn, endIn, 0, 255);
    } else if (scrollY > endIn && scrollY < startOut) {
      alpha = 255;
    } else if (scrollY >= startOut && scrollY <= endOut) {
      alpha = (startOut === endOut) ? 0 : map(scrollY, startOut, endOut, 255, 0);
    }
    return alpha * fadeProgress;
  }

  // 1-7 段落文字逻辑（保留原稿内容）
  let t1Alpha = getAlpha(0, 0, 0.05, 0.12);
  if (t1Alpha > 0) { fill(255, 255, 255, t1Alpha); textSize(70); interactiveText("The Odyssey Years", width / 2, height / 2 - 40, "t1"); textSize(24); interactiveText("The Prolonged Rainy Season of Life", width / 2, height / 2 + 45, "t2"); textSize(14); text("↓ Scroll Down ↓", width / 2, height - 100); }
  let p1Alpha = getAlpha(0.12, 0.18, 0.24, 0.30);
  if (p1Alpha > 0) { fill(255, 255, 255, p1Alpha); textSize(28); interactiveText("The decade of our 20s is like a prolonged rainy season—", width / 2, height / 2 - 45, "p1_1"); interactiveText("filled with confusion, anxiety, exploration, and uncertainty.", width / 2, height / 2, "p1_2"); interactiveText("Sociologists call it the 'Odyssey Years.'", width / 2, height / 2 + 45, "p1_3"); }
  let p2Alpha = getAlpha(0.30, 0.36, 0.42, 0.48);
  if (p2Alpha > 0) { fill(255, 255, 255, p2Alpha); textSize(28); interactiveText("Like Odysseus, drifting at sea for a decade,", width / 2, height / 2 - 45, "p2_1"); interactiveText("pushed off course by storms and besieged by isolation,", width / 2, height / 2, "p2_2"); interactiveText("before finally seeing the way home.", width / 2, height / 2 + 45, "p2_3"); }
  let p3Alpha = getAlpha(0.48, 0.54, 0.62, 0.68);
  if (p3Alpha > 0) { fill(255, 255, 255, p3Alpha); textSize(26); interactiveText("You might not yet know which path truly belongs to you.", width / 2, height / 2 - 60, "p3_1"); interactiveText("You might scroll through social media late at night,", width / 2, height / 2 - 20, "p3_2"); interactiveText("feeling like the whole world is basking in the sun,", width / 2, height / 2 + 20, "p3_3"); interactiveText("while you alone are left holding an umbrella in the mist.", width / 2, height / 2 + 60, "p3_4"); }
  let p4Alpha = getAlpha(0.68, 0.74, 0.82, 0.88);
  if (p4Alpha > 0) { fill(255, 255, 255, p4Alpha); textSize(28); interactiveText("If you are currently navigating this endless rain...", width / 2, height / 2 - 60, "p4_1"); interactiveText("I want to gently remind you, my dear:", width / 2, height / 2 - 20, "p4_2"); interactiveText("Even heroes take ten years to find their way home.", width / 2, height / 2 + 20, "p4_3"); interactiveText("You are not lost. You are simply on your way.", width / 2, height / 2 + 60, "p4_4"); }
  let p5Alpha = getAlpha(0.88, 0.92, 0.96, 0.99);
  if (p5Alpha > 0) { fill(255, 255, 255, p5Alpha); textSize(28); interactiveText("The purpose of this chapter isn't to arrive quickly,", width / 2, height / 2 - 25, "p5_1"); interactiveText("but to slowly discover who you truly are.", width / 2, height / 2 + 25, "p5_2"); }
  let endAlpha = getAlpha(0.98, 1.0, 2.0, 2.0);
  if (endAlpha > 0) { fill(255, 255, 255, endAlpha); textSize(34); interactiveText("It’s okay if it rains. Just open your umbrella.", width / 2, height / 2, "end"); }

  ctx.shadowBlur = 0;
}

function mousePressed() {
  if (!showFinalMenu && isCleared && scrollY >= maxScroll * 0.95) {
    showFinalMenu = true;
    return;
  }
  if (showFinalMenu) {
    for (let u of menuUmbrellas) {
      if (u.alpha > 200 && dist(mouseX, mouseY, u.x, u.y) < u.size/2) {
        window.location.href = u.url;
      }
    }
  }
}

function mouseWheel(event) {
  if (isCleared && fogAlpha <= 0 && !showFinalMenu) {
    scrollY += event.delta; scrollY = constrain(scrollY, 0, maxScroll);
  }
  return false;
}

function calculateLongImage() {
  let imgRatio = bgImg.width / bgImg.height;
  bgProps.w = windowWidth; bgProps.h = windowWidth / imgRatio;
  bgProps.x = 0; bgProps.y = 0;
  if (bgProps.h < windowHeight) {
    bgProps.h = windowHeight; bgProps.w = windowHeight * imgRatio;
    bgProps.x = (windowWidth - bgProps.w) / 2;
  }
  maxScroll = max(0, bgProps.h - windowHeight);
}

function checkWipeProgress() {
  fogLayer.loadPixels();
  let clearCount = 0; let totalCount = 0;
  for (let i = 0; i < fogLayer.pixels.length; i += 40) {
    totalCount++; if (fogLayer.pixels[i + 3] === 0) clearCount++;
  }
  if (clearCount / totalCount > 0.3) isCleared = true;
}

class Drop {
  constructor() {
    this.x = random(width + 200); this.y = random(-height, height); this.z = random(0, 1);
    this.len = map(this.z, 0, 1, 15, 80); this.slantRatio = random(0.15, 0.25); this.speed = map(this.z, 0, 1, 6, 25);
    this.color = color(random(230, 245), random(235, 250), random(240, 255));
    this.opacity = map(this.z, 0, 1, 30, 200); this.weight = map(this.z, 0, 1, 1, 4.5);
  }
  fall() {
    this.y += this.speed; this.x -= this.speed * this.slantRatio;
    if (this.y > height) { this.y = random(-height/2, -50); this.x = random(width + 200); }
    if (this.x < -200) { this.x = random(width + 200); this.y = random(-height/2, -50); }
  }
  show(fadeProgress) {
    push();
    let r = red(this.color); let g = green(this.color); let b = blue(this.color);
    stroke(r, g, b, this.opacity * fadeProgress); strokeWeight(this.weight); strokeCap(ROUND);
    line(this.x, this.y, this.x - this.len * this.slantRatio, this.y + this.len);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateLongImage();
  if (!isCleared) {
    fogLayer = createGraphics(windowWidth, windowHeight);
    fogLayer.image(fogImg, bgProps.x, bgProps.y, bgProps.w, bgProps.h);
  }
}

// --- 极简 About 逻辑 ---
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('about-btn');
  const overlay = document.getElementById('about-overlay');

  // 悬停变亮效果
  btn.addEventListener('mouseenter', () => btn.style.color = '#fff');
  btn.addEventListener('mouseleave', () => btn.style.color = 'rgba(255,255,255,0.7)');

  // 点击 About 打开
  btn.addEventListener('click', (e) => {
    overlay.style.display = 'flex';
    e.stopPropagation();
  });

  // 点击全屏任意位置关闭
  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
  });
});
