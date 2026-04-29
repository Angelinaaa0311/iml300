let bgImg, houseImg, peoImg;
let bqImgs = [];

// ===== Person Configuration =====
let personConfig = { offsetX: -25, offsetY: 60, width: 140 };
let personScale = 1.0;
let personArea = { x: 0, y: 0, w: 0, h: 0 };

// ===== Dialog & UI =====
let bubbleAlpha = 0;
let currentMessage = ""; // 初始为空
let messageTimer = -5001;
let randomMessages = [

  "You can tell me anything.",

];

let inputArea;
let btnHovered = false;

// ===== Note Data Storage =====
let notes = [];
let hoveredNote = null;
let activeNote = null;
let noteBaseSize = 220;

function preload() {
  bgImg = loadImage("imgs/page5.png");
  houseImg = loadImage("imgs/house.png");
  peoImg = loadImage("imgs/peo5.png");

  for (let i = 1; i <= 4; i++) {
    bqImgs.push(loadImage(`imgs/bq${i}.png`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  let fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Share+Tech&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
  textFont("'Share Tech', sans-serif");

  inputArea = createElement('textarea');
  inputArea.attribute('placeholder', "Write down everything here...");
  inputArea.style('font-family', "'Share Tech', sans-serif");
  inputArea.style('font-size', '16px');
  inputArea.style('padding', '15px');
  inputArea.style('border-radius', '12px');
  inputArea.style('border', '2px solid #ccc');
  inputArea.style('outline', 'none');
  inputArea.style('background', 'rgba(255, 255, 255, 0.85)');
  inputArea.style('resize', 'none');
  inputArea.style('line-height', '1.5');
  inputArea.style('box-sizing', 'border-box');

  loadLocalNotes();
}

function safeAspect(img) {
  if (!img || typeof img.width === 'undefined' || img.width === 0) return 1;
  return img.height / img.width;
}

function draw() {
  background(0);

  if (bgImg && bgImg.width > 0) {
    image(bgImg, 0, 0, width, height);
  }

  drawNotes();

  let w = min(width * 0.4, 500);
  let h = w * safeAspect(houseImg);
  let floatY = sin(frameCount * 0.02) * 6;
  let houseX = width / 2 - w / 2;
  let houseY = height / 2 - h / 2 + floatY;

  drawingContext.shadowColor = 'rgba(0,0,0,0.3)';
  drawingContext.shadowBlur = 30;
  if (houseImg && houseImg.width > 0) {
    image(houseImg, houseX, houseY, w, h);
  }
  drawingContext.shadowBlur = 0;

  // Person Interaction
  let isPersonHovered =
    mouseX > personArea.x &&
    mouseX < personArea.x + personArea.w &&
    mouseY > personArea.y &&
    mouseY < personArea.y + personArea.h;

  personScale = lerp(personScale, isPersonHovered ? 1.08 : 1.0, 0.2);

  let pw = personConfig.width * personScale;
  let ph = (personConfig.width * safeAspect(peoImg)) * personScale;
  let centerX = houseX + w / 2;
  let centerY = houseY + h / 2;
  let px = centerX + personConfig.offsetX - pw / 2;
  let py = centerY + personConfig.offsetY - ph / 2;

  if (peoImg && peoImg.width > 0) {
    image(peoImg, px, py, pw, ph);
  }
  personArea = { x: px, y: py, w: pw, h: ph };

  // Bubble Logic
  if (millis() > messageTimer + 5000) {
    bubbleAlpha = lerp(bubbleAlpha, 0, 0.1);
  } else {
    bubbleAlpha = lerp(bubbleAlpha, 255, 0.1);
  }

  if (currentMessage !== "" && bubbleAlpha > 1) {
    drawBubble(px, py, pw);
  }

  // Input & Button
  let inputW = 340;
  let inputH = 100;
  if (!isNaN(houseY) && !isNaN(h)) {
    inputArea.position(width / 2 - inputW / 2, houseY + h + 20);
    inputArea.size(inputW, inputH);
  }
  drawSubmitButton(width / 2, houseY + h + 20 + inputH + 25);

  // Detail View
  if (activeNote) {
    drawNoteDetail();
  }
}

function drawNotes() {
  hoveredNote = null;
  for (let i = notes.length - 1; i >= 0; i--) {
    let note = notes[i];
    let nx = note.relX * width;
    let ny = note.relY * height;
    let bqImg = bqImgs[note.bqIndex] || bqImgs[0];
    if (!bqImg || bqImg.width === 0) continue;

    let nw = noteBaseSize;
    let nh = nw * safeAspect(bqImg);

    let isHovered = false;
    if (dist(mouseX, mouseY, nx, ny) < nw / 2) {
      isHovered = true;
      hoveredNote = note;
    }

    let currentScale = (isHovered || activeNote === note) ? 1.05 : 1.0;

    push();
    translate(nx, ny);
    rotate(note.rotation || 0);
    imageMode(CENTER);
    if (isHovered || activeNote === note) {
      drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';
      drawingContext.shadowBlur = 15;
    }
    image(bqImg, 0, 0, nw * currentScale, nh * currentScale);
    pop();
  }
}

function drawBubble(px, py, pw) {
  textSize(16);
  let padding = 20;
  let rawTw = textWidth(currentMessage);
  let tw = min(max(rawTw, 200), 320);
  let isMultiLine = rawTw > 320 || currentMessage.includes('\n');
  let th = isMultiLine ? 80 : 50;
  let bx = px + pw / 2 - tw / 2 - padding;
  let by = py - th - 30;
  noStroke();
  fill(0, 25 * (bubbleAlpha / 255));
  rect(bx + 6, by + 6, tw + padding * 2, th, 22);
  fill(255, bubbleAlpha);
  stroke(120, bubbleAlpha);
  rect(bx, by, tw + padding * 2, th, 22);
  fill(60, bubbleAlpha);
  noStroke();
  textAlign(CENTER, CENTER);
  text(currentMessage, bx + padding, by + padding / 2, tw, th - padding);
}

function drawSubmitButton(cx, cy) {
  if (isNaN(cx) || isNaN(cy)) return;
  let bw = 140;
  let bh = 40;
  let bx = cx - bw / 2;
  let by = cy - bh / 2;
  btnHovered = mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh;
  fill(btnHovered ? 230 : 255);
  stroke(120);
  rect(bx, by, bw, bh, 20);
  fill(60);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Leave Note", cx, cy);
}

function drawNoteDetail() {
  let pad = 20;
  let boxW = 280;
  textSize(16);
  textLeading(22);
  let textLength = textWidth(activeNote.text);
  let estimatedLines = Math.ceil(textLength / (boxW - pad * 2)) + 1;
  let boxH = min(estimatedLines * 22 + pad * 2 + 50, 400);

  let tx = (activeNote.relX * width) + 60;
  let ty = (activeNote.relY * height) - 60;

  if (tx + boxW > width) tx = width - boxW - 20;
  if (ty + boxH > height) ty = height - boxH - 20;
  if (tx < 0) tx = 20;
  if (ty < 0) ty = 20;

  drawingContext.shadowColor = 'rgba(0,0,0,0.3)';
  drawingContext.shadowBlur = 20;
  fill(255, 245, 230, 250);
  stroke(200, 180, 160);
  rect(tx, ty, boxW, boxH, 15);
  drawingContext.shadowBlur = 0;

  fill(80, 60, 50);
  noStroke();
  textAlign(LEFT, TOP);
  text(activeNote.text, tx + pad, ty + pad, boxW - pad * 2, boxH - pad * 2 - 40);

  // Delete Button
  let delX = tx + boxW - 80;
  let delY = ty + boxH - 35;
  let isDelHover = mouseX > delX && mouseX < delX + 60 && mouseY > delY && mouseY < delY + 25;

  fill(isDelHover ? '#ff4444' : '#aa3333');
  textSize(14);
  textAlign(RIGHT, CENTER);
  text("[Delete]", tx + boxW - pad, ty + boxH - pad - 10);

  activeNote.delBtn = { x: delX, y: delY, w: 60, h: 25 };
}

function mousePressed() {
  // 1. Submit Note
  if (btnHovered) {
    let textVal = inputArea.value().trim();
    if (textVal !== '') {
      saveNewNote(textVal);
      inputArea.value('');
      currentMessage = "I will keep it safe for you.";
      messageTimer = millis();
      bubbleAlpha = 0;
    }
    return;
  }

  // 2. Delete Note
  if (activeNote && activeNote.delBtn) {
    let d = activeNote.delBtn;
    if (mouseX > d.x && mouseX < d.x + d.w && mouseY > d.y && mouseY < d.y + d.h) {
      notes = notes.filter(n => n !== activeNote);
      localStorage.setItem('myTreeHoleNotes', JSON.stringify(notes));
      activeNote = null;
      return;
    }
  }

  // 3. Click Note to View
  if (hoveredNote) {
    activeNote = (activeNote === hoveredNote) ? null : hoveredNote;
    return;
  }

  // 4. Click Person (Start Talking)
  if (
    mouseX > personArea.x && mouseX < personArea.x + personArea.w &&
    mouseY > personArea.y && mouseY < personArea.y + personArea.h
  ) {
    // 确保随机选取的句子不和当前句子重复（除非只有一条）
    let nextMsg = random(randomMessages);
    while (nextMsg === currentMessage && randomMessages.length > 1) {
      nextMsg = random(randomMessages);
    }
    currentMessage = nextMsg;
    messageTimer = millis();
    bubbleAlpha = 0;
    return;
  }

  // Close detail on clicking empty space
  activeNote = null;
}

function loadLocalNotes() {
  let savedData = localStorage.getItem('myTreeHoleNotes');
  if (savedData) {
    try {
      notes = JSON.parse(savedData);
    } catch(e) {
      notes = [];
    }
  }
}

function saveNewNote(text) {
  let rx = random(0.1, 0.9);
  let ry = random(0.1, 0.8);
  let bqIdx = floor(random(0, 4));
  let rot = random(-PI/10, PI/10);

  notes.push({
    text: text,
    relX: rx,
    relY: ry,
    bqIndex: bqIdx,
    rotation: rot
  });
  localStorage.setItem('myTreeHoleNotes', JSON.stringify(notes));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
