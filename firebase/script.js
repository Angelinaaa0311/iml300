const firebaseConfig = {
  apiKey: "AIzaSyATAdRUM0bOX7owIR6b4i4rbnAIVp0F244",
  authDomain: "iml300-firebase-demo-67eca.firebaseapp.com",
  projectId: "iml300-firebase-demo-67eca",
  storageBucket: "iml300-firebase-demo-67eca.firebasestorage.app",
  messagingSenderId: "231071242531",
  appId: "1:231071242531:web:1ce039e034f72587af9496"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let dbRef = db.ref("text");

const canvas = document.getElementById("bubble-canvas");
const ctx = canvas.getContext("2d");

const COLORS = [
  { fill: "rgba(255,182,215,0.90)", stroke: "#e91e8c", text: "#880e4f" },
  { fill: "rgba(255,143,188,0.90)", stroke: "#c2185b", text: "#6a0f35" },
  { fill: "rgba(248,187,208,0.92)", stroke: "#f06292", text: "#880e4f" },
  { fill: "rgba(240,160,200,0.90)", stroke: "#d81b60", text: "#7b003e" },
  { fill: "rgba(255,210,235,0.92)", stroke: "#e91e8c", text: "#880e4f" },
];

const bubbles = [];
const particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Standard heart: top centered at (cx, cy-r*0.3), total height ~2r
function heartPath(ctx, cx, cy, r) {
  const t = cy - r * 0.25;   // top of the two bumps
  const tip = cy + r * 0.85; // bottom tip
  const w = r * 1.0;         // half-width
  ctx.beginPath();
  ctx.moveTo(cx, tip);
  // left side up to left bump
  ctx.bezierCurveTo(cx - w * 0.1, cy + r * 0.4, cx - w * 1.2, cy + r * 0.1, cx - w, t);
  // left bump arc
  ctx.bezierCurveTo(cx - w, t - r * 0.55, cx, t - r * 0.55, cx, cy - r * 0.05);
  // right bump arc
  ctx.bezierCurveTo(cx, t - r * 0.55, cx + w, t - r * 0.55, cx + w, t);
  // right side down to tip
  ctx.bezierCurveTo(cx + w * 1.2, cy + r * 0.1, cx + w * 0.1, cy + r * 0.4, cx, tip);
  ctx.closePath();
}

function heartBounds(r) {
  return { w: r * 1.2, h: r * 1.15 };
}

function spawnBubble(text) {
  const r = Math.max(52, Math.min(80, 38 + text.length * 4.5));
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const bounds = heartBounds(r);
  const margin = bounds.w + 4;
  const x = margin + Math.random() * (canvas.width - margin * 2);
  const y = canvas.height * 0.3 + Math.random() * canvas.height * 0.4;
  const speed = 0.7 + Math.random() * 0.8;
  const angle = Math.random() * Math.PI * 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  bubbles.push({ x, y, r, vx, vy, text, color, alpha: 1, wobble: Math.random() * Math.PI * 2, popping: false, scale: 0.01 });
}

function spawnParticles(x, y, color) {
  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 / 20) * i + (Math.random() - 0.5) * 0.3;
    const speed = 1.8 + Math.random() * 3.2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 3 + Math.random() * 5,
      alpha: 1,
      color: color.fill,
      stroke: color.stroke,
      life: 0,
      maxLife: 30 + Math.random() * 20,
      isHeart: Math.random() > 0.4,
    });
  }
}

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function update() {
  const W = canvas.width;
  const H = canvas.height;

  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];

    if (b.popping) {
      b.alpha -= 0.055;
      b.scale += 0.06;
      if (b.alpha <= 0) { bubbles.splice(i, 1); continue; }
      continue;
    }

    // Spawn-in scale animation
    if (b.scale < 1) {
      b.scale = Math.min(1, b.scale + 0.07);
    }

    b.wobble += 0.018;
    b.x += b.vx;
    b.y += b.vy;

    // Boundary bounce — keep heart fully inside screen
    const { w, h } = heartBounds(b.r);
    const left = w + 2;
    const right = W - w - 2;
    const top = h * 0.7 + 2;   // extra top margin for the bumps
    const bottom = H - h * 0.85 - 2;

    if (b.x < left)  { b.x = left;  b.vx = Math.abs(b.vx); }
    if (b.x > right) { b.x = right; b.vx = -Math.abs(b.vx); }
    if (b.y < top)   { b.y = top;   b.vy = Math.abs(b.vy); }
    if (b.y > bottom){ b.y = bottom; b.vy = -Math.abs(b.vy); }

    // Very gentle random drift
    b.vx += (Math.random() - 0.5) * 0.03;
    b.vy += (Math.random() - 0.5) * 0.03;
    const maxSpeed = 1.6;
    const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    if (spd > maxSpeed) { b.vx = b.vx / spd * maxSpeed; b.vy = b.vy / spd * maxSpeed; }
  }

  // Collision pop
  for (let i = 0; i < bubbles.length; i++) {
    for (let j = i + 1; j < bubbles.length; j++) {
      const a = bubbles[i], b = bubbles[j];
      if (a.popping || b.popping) continue;
      if (a.scale < 0.9 || b.scale < 0.9) continue;
      const d = dist(a, b);
      if (d < (a.r + b.r) * 0.82) {
        spawnParticles((a.x + b.x) / 2, (a.y + b.y) / 2, a.color);
        a.popping = true;
        b.popping = true;
      }
    }
  }

  // Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.07;
    p.life++;
    p.alpha = 1 - p.life / p.maxLife;
    if (p.life >= p.maxLife) particles.splice(i, 1);
  }
}

function drawBubble(b) {
  ctx.save();
  ctx.globalAlpha = b.alpha;
  ctx.translate(b.x, b.y);
  ctx.scale(b.scale, b.scale);
  const wx = Math.sin(b.wobble) * 1.5;
  const wy = Math.cos(b.wobble * 1.2) * 1.2;

  heartPath(ctx, wx, wy, b.r);
  ctx.fillStyle = b.color.fill;
  ctx.fill();
  ctx.strokeStyle = b.color.stroke;
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Shine spot
  ctx.save();
  ctx.clip();
  ctx.beginPath();
  ctx.ellipse(wx - b.r * 0.28, wy - b.r * 0.38, b.r * 0.22, b.r * 0.14, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fill();
  ctx.restore();

  // Text
  ctx.fillStyle = b.color.text;
  const fontSize = Math.max(11, Math.min(14, b.r * 0.27));
  ctx.font = `700 ${fontSize}px Quicksand, Helvetica, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const words = b.text.split(" ");
  const lineH = fontSize * 1.25;
  const startY = wy - ((words.length - 1) * lineH) / 2 + b.r * 0.05;
  words.forEach((word, idx) => {
    ctx.fillText(word, wx, startY + idx * lineH);
  });

  ctx.restore();
}

function drawParticle(p) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  if (p.isHeart) {
    heartPath(ctx, p.x, p.y, p.r);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = p.stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach(drawBubble);
  particles.forEach(drawParticle);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

dbRef.on("child_added", (data) => {
  const value = data.val();
  if (value && typeof value === "string" && value.trim()) {
    spawnBubble(value.trim());
  }
});

const textInputSubmit = document.getElementById("text-input-submit");
const textContainerElement = document.getElementById("text-input-entry");
const entry = document.getElementById("text-input-entry");
const share = document.getElementById("text-input-submit");

textInputSubmit.addEventListener("click", submitText);

function submitText() {
  const textToSubmit = textContainerElement.value;
  if (!textToSubmit.trim()) return;
  const newKey = dbRef.push().key;
  const updates = {};
  updates[newKey] = textToSubmit;
  dbRef.update(updates);
}

function submitlock() {
  entry.remove();
  share.value = "Thanks for telling me.";
  share.disabled = true;
  share.style.width = "220px";
}
