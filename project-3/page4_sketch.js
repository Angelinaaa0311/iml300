let bgImg, houseImg;

// ===== 人物 =====
let personImgs = [];
let currentPerson = 0;
let personAlpha = 255;
let personScale = 1.0;

// ⭐ 单独配置两个人物形态的大小和位置
// 可以在这里随意修改 offsetX(左右偏移), offsetY(上下偏移), width(大小)
let personConfigs = [
  { offsetX: -25, offsetY: 60, width: 140 }, // 人物 0 (初始形态 peo4-1)
  { offsetX: -25, offsetY: 60, width: 140 }  // 人物 1 (提问形态 peo4-2)
];

let personArea = { x: 0, y: 0, w: 0, h: 0 };

// ===== 对话与状态 =====
let step = -1;
let showBubble = false;
let bubbleAlpha = 0;
let currentMessage = "";
let optionAreas = [];

// ===== 问答数据 =====
let qIndex = 0;
let questions = [
  "When was the last time you were completely immersed in something, losing track of time, and what were you doing?",
  "What kind of people or things make you instinctively want to avoid them?",
  "What are the three words your friends use most often to describe you?",
  "What is a small thing that others always praise you for doing well?",
  "When do you feel a bit inadequate and need to muster up courage?",
  "If you didn't have to consider reality, what would your ideal day look like?",
  "What traits do you admire most in others that you also wish to have?",
  "When was the last time you thought 'this is good enough', and in what scenario?",
  "Which decision have you made that made you think, 'Ah, this is so me'?",
  "What habits would your future self 10 years from now want you to keep, and what bad habits to break?"
];
let answers = new Array(10).fill("");

// ===== DOM 元素 =====
let answerInput;
let reportDiv;
let showReport = false;
let reportBtnHover = false;
let reportBtnAlpha = 0; // ⭐ Report按钮的透明度（用于渐显动画）

function preload() {
  bgImg = loadImage("imgs/page4.png");
  houseImg = loadImage("imgs/house.png");

  personImgs[0] = loadImage("imgs/peo4-1.png");
  personImgs[1] = loadImage("imgs/peo4-2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 动态加载 Share Tech 字体
  let fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Share+Tech&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  textFont("'Share Tech', sans-serif");

  // 创建问答输入框
  answerInput = createInput('');
  answerInput.attribute('placeholder', 'Type your answer here...');
  answerInput.style('font-family', "'Share Tech', sans-serif");
  answerInput.style('font-size', '16px');
  answerInput.style('padding', '12px 20px');
  answerInput.style('border-radius', '12px');
  answerInput.style('border', '2px solid #ccc');
  answerInput.style('outline', 'none');
  answerInput.style('text-align', 'center');
  answerInput.style('background', 'rgba(255, 255, 255, 0.9)');
  answerInput.hide();

  // 创建报告界面 (默认隐藏)
  reportDiv = createDiv('');
  reportDiv.style('position', 'absolute');
  reportDiv.style('top', '10%');
  reportDiv.style('left', '50%');
  reportDiv.style('transform', 'translateX(-50%)');
  reportDiv.style('width', '80%');
  reportDiv.style('max-width', '700px');
  reportDiv.style('height', '75%');
  // ⭐ 更改为淡蓝色底色
  reportDiv.style('background', 'rgba(212, 241, 249, 0.95)');
  reportDiv.style('color', '#333'); // 更改为深色文字，确保在淡蓝底色上清晰可见
  reportDiv.style('padding', '40px');
  reportDiv.style('border-radius', '20px');
  reportDiv.style('overflow-y', 'auto');
  reportDiv.style('font-family', "'Share Tech', sans-serif");
  reportDiv.style('line-height', '1.6');
  reportDiv.style('display', 'none');
  reportDiv.style('box-sizing', 'border-box');
  reportDiv.style('box-shadow', '0 10px 30px rgba(0,0,0,0.3)');
}

function draw() {
  background(0);
  if (bgImg) {
    image(bgImg, 0, 0, width, height);
  }

  // ===== 房子 =====
  let w = min(width * 0.4, 500);
  let h = w * (houseImg.height / houseImg.width);
  let floatY = sin(frameCount * 0.02) * 6;

  let houseX = width / 2 - w / 2;
  let houseY = height / 2 - h / 2 + floatY;

  image(houseImg, houseX, houseY, w, h);

  // ===== 人物 Hover 与缩放逻辑 =====
  let isPersonHovered =
    mouseX > personArea.x &&
    mouseX < personArea.x + personArea.w &&
    mouseY > personArea.y &&
    mouseY < personArea.y + personArea.h &&
    step === -1;

  personScale = lerp(personScale, isPersonHovered ? 1.08 : 1.0, 0.2);

  let pConfig = personConfigs[currentPerson];
  let pImg = personImgs[currentPerson];

  let pw = pConfig.width * personScale;
  let ph = (pConfig.width * (pImg.height / pImg.width)) * personScale;

  let centerX = houseX + w / 2;
  let centerY = houseY + h / 2;

  let px = centerX + pConfig.offsetX - pw / 2;
  let py = centerY + pConfig.offsetY - ph / 2;

  personAlpha = lerp(personAlpha, 255, 0.1);

  tint(255, personAlpha);
  image(pImg, px, py, pw, ph);
  noTint();

  personArea = { x: px, y: py, w: pw, h: ph };

  // ===== 动态输入框位置 =====
  if (step === 2 && !showReport) {
    answerInput.show();
    let inputW = 340;
    answerInput.position(width / 2 - inputW / 2, houseY + h + 20);
    answerInput.size(inputW);
  } else {
    answerInput.hide();
  }

  // ===== 气泡与选项 =====
  if (showBubble && !showReport) {
    bubbleAlpha = lerp(bubbleAlpha, 255, 0.1);
    drawBubble(px, py, pw);
    drawOptions(px, py, pw, houseY, h);
  }

  // ===== Report 按钮 =====
  drawReportButton();
}

function mousePressed() {
  // 1. 检测 Report 按钮点击 (改到右上角)
  let btnW = 110;
  let btnH = 45;
  let btnX = width - btnW - 20;
  let btnY = 20;

  if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
    toggleReport();
    return;
  }

  // 如果报告界面开着，禁止背景点击
  if (showReport) return;

  // 2. 检测选项按钮点击
  if (step >= 0) {
    for (let i = 0; i < optionAreas.length; i++) {
      let a = optionAreas[i];
      if (mouseX > a.x && mouseX < a.x + a.w && mouseY > a.y && mouseY < a.y + a.h) {
        handleOptionClick(i);
        return;
      }
    }
  }

  // 3. 检测初始人物点击
  if (
    mouseX > personArea.x && mouseX < personArea.x + personArea.w &&
    mouseY > personArea.y && mouseY < personArea.y + personArea.h &&
    step === -1
  ) {
    step = 0;
    showBubble = true;
    bubbleAlpha = 0;
    currentMessage = "The first step to fighting confusion is to know yourself.";
    return;
  }
}

function handleOptionClick(optIndex) {
  if (step === 0) { // 点击 "How?"
    step = 1;
    currentPerson = 1; // 切换动作
    personAlpha = 0;   // 触发人物渐显
    bubbleAlpha = 0;
    currentMessage = "Let me help you.\nI'll ask you a few questions. Please answer them one by one.";
  }
  else if (step === 1) { // 点击 "Start"
    step = 2;
    qIndex = 0;
    bubbleAlpha = 0;
    currentMessage = questions[qIndex];
    answerInput.value(answers[qIndex]);
  }
  else if (step === 2) { // 问答进行中点击 "Next"
    answers[qIndex] = answerInput.value();
    qIndex++;

    if (qIndex < 10) {
      bubbleAlpha = 0;
      currentMessage = questions[qIndex];
      answerInput.value(answers[qIndex]);
    } else {
      step = 3; // 问答结束
      bubbleAlpha = 0;
      currentMessage = "How is it? Do you know yourself a little better now?";
      updateReportHTML(); // 同步更新报告界面的内容
    }
  }
  else if (step === 3) { // 点击结束选项
    step = 4;
    bubbleAlpha = 0;
    currentMessage = "Keep taking your time to explore yourself.";
  }
}

function drawBubble(px, py, pw) {
  textSize(16);
  let padding = 20;

  // 根据文本内容自动换行并拉伸气泡
  let rawTw = textWidth(currentMessage);
  let tw = min(max(rawTw, 200), 400);
  let isMultiLine = rawTw > 400 || currentMessage.includes('\n');
  let th = isMultiLine ? 100 : 60;

  // 如果是在问答环节显示题号，适当增加高度
  if (step === 2) th += 20;

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
  textLeading(22);

  // 问答环节渲染题号前缀
  let displayMsg = currentMessage;
  if (step === 2) {
    displayMsg = `[ Q${qIndex + 1}/10 ]\n${currentMessage}`;
  }

  text(displayMsg, bx + padding, by + padding / 2, tw, th - padding);
}

function drawOptions(px, py, pw, houseY, h) {
  optionAreas = [];
  let options = [];
  let yOffset = py - 20;

  if (step === 0) options = ["How?"];
  else if (step === 1) options = ["Start"];
  else if (step === 2) {
    options = ["Next"];
    yOffset = houseY + h + 85; // 把Next按钮放到输入框下方
  }
  else if (step === 3) options = ["Yes", "No", "Let me think"];
  else if (step === 4) return; // 结束不显示按钮

  let bw = (step === 3) ? 110 : 90;
  let bh = 36;
  let gap = (step === 3) ? 120 : 100;
  let center = px + pw / 2;

  let totalWidth = options.length * bw + (options.length - 1) * (gap - bw);
  let startX = center - totalWidth / 2;

  for (let i = 0; i < options.length; i++) {
    let x = startX + i * gap;

    let isHovered = mouseX > x && mouseX < x + bw && mouseY > yOffset && mouseY < yOffset + bh;

    fill(isHovered ? 240 : 255, bubbleAlpha);
    stroke(120, bubbleAlpha);
    rect(x, yOffset, bw, bh, 15);

    fill(60, bubbleAlpha);
    noStroke();
    textAlign(CENTER, CENTER);
    text(options[i], x + bw / 2, yOffset + bh / 2);

    optionAreas[i] = { x: x, y: yOffset, w: bw, h: bh };
  }
}

// ===== Report 界面与按钮 =====
function drawReportButton() {
  // ⭐ Report按钮渐显出现
  reportBtnAlpha = lerp(reportBtnAlpha, 255, 0.05);

  // ⭐ 移至右上角
  let btnW = 110;
  let btnH = 45;
  let btnX = width - btnW - 20;
  let btnY = 20;

  reportBtnHover = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;

  // 按钮Hover背景与边框同步应用透明度
  fill(reportBtnHover ? 240 : 255, reportBtnAlpha * 0.9);
  stroke(120, reportBtnAlpha);
  strokeWeight(2);
  rect(btnX, btnY, btnW, btnH, 12);

  noStroke();
  fill(60, reportBtnAlpha);
  textSize(18);
  textAlign(CENTER, CENTER);
  // 文字稍微向下偏移修正对齐
  text(showReport ? "Close" : "Report", btnX + btnW / 2, btnY + btnH / 2 - 2);
}

function toggleReport() {
  showReport = !showReport;
  if (showReport) {
    updateReportHTML();
    reportDiv.style('display', 'block');
  } else {
    reportDiv.style('display', 'none');
  }
}

function updateReportHTML() {
  // ⭐ 配合淡蓝色背景，调整了文字和分割线的颜色使其更融合
  let html = `<h2 style="text-align: center; margin-bottom: 20px; color: #222;">Self-Discovery Report</h2>`;
  html += `<hr style="border-color: #aaa; margin-bottom: 30px;">`;

  let hasAnswers = false;
  for (let i = 0; i < 10; i++) {
    if (answers[i].trim() !== "") hasAnswers = true;
    html += `
      <div style="margin-bottom: 25px;">
        <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Question ${i + 1}:</div>
        <div style="font-size: 17px; margin-bottom: 8px; color: #111;">${questions[i]}</div>
        <div style="color: #00796b; font-size: 18px; font-weight: bold;">
          > ${answers[i] || "<i style='color: #999;'>(No answer provided yet)</i>"}
        </div>
      </div>
    `;
  }

  if (!hasAnswers && step < 3) {
    html = `<h2 style="text-align: center; margin-top: 50px;">You haven't answered any questions yet.</h2>
            <p style="text-align: center; color: #666;">Talk to the character to start your self-discovery journey.</p>`;
  }

  reportDiv.html(html);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // 窗口改变时调整输入框的位置
  if (step === 2 && !showReport) {
    let w = min(width * 0.4, 500);
    let h = w * (houseImg.height / houseImg.width);
    let floatY = sin(frameCount * 0.02) * 6;
    let houseY = height / 2 - h / 2 + floatY;
    let inputW = 340;
    answerInput.position(width / 2 - inputW / 2, houseY + h + 20);
  }
}
