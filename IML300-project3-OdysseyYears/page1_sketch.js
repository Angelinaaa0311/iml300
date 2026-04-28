let bgImages = [];
let currentIndex = 0;
let bgNames = ['Red.png', 'Yellow.png', 'Pink.png', 'Blue.png', 'Purple.png'];
let loadedCount = 0;

function preload() {
  console.log("开始加载资源...");
  for (let i = 0; i < bgNames.length; i++) {
    let path = 'imgs/' + bgNames[i];

    // 使用成功和失败的回调，确保程序不卡死
    bgImages[i] = loadImage(path,
      () => {
        loadedCount++;
        console.log("✅ 加载成功: " + path);
      },
      () => {
        loadedCount++; // 即使失败也增加计数，强行让程序继续
        console.error("❌ 加载失败: " + path + " (请检查文件名或路径)");
      }
    );
  }
}

function setup() {
  // 即使没加载完，我们也强行进入 setup
  createCanvas(windowWidth, windowHeight);
  console.log("Setup 完成");
}

function draw() {
  background(100); // 看到灰色背景说明程序已经跑起来了

  if (bgImages[currentIndex]) {
    image(bgImages[currentIndex], 0, 0, width, height);
  }

  // 在屏幕左上角实时显示调试信息
  fill(255, 255, 0);
  noStroke();
  textSize(18);
  textAlign(LEFT, TOP);
  text("已尝试加载: " + loadedCount + " / " + bgNames.length, 20, 20);
  text("当前尝试显示: " + bgNames[currentIndex], 20, 45);
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    currentIndex = (currentIndex + 1) % bgNames.length;
  } else if (keyCode === LEFT_ARROW) {
    currentIndex = (currentIndex - 1 + bgNames.length) % bgNames.length;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
