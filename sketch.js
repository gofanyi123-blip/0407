let gameState = "START"; 
let level = 1;
let lives = 3;
let stars = 0;
let isPlaying = false; 
let isPaused = false; 
let mode = "SEQUENCE"; 
let pathPoints = [];
let damageFlash = 0;   
let confetti = [];     
let currentObstacles = []; 

// 語系資料字典
let curLang = 'zh'; 
let langSelect; // 🌟 下拉式選單變數
const langData = {
  zh: { title: "電流急急棒", start: "開始遊戲", select: "選擇關卡", instr: "遊戲說明", back: "返回", resume: "繼續遊戲", retry: "重新挑戰", home: "回到主畫面", pause: "遊戲暫停", clear: "關卡通過!", fail: "通關失敗", next: "下一關", replay: "再玩一次", hint: "請點擊左側 藍色起點 啟動遊戲", statusLvl: "關卡: ", statusLife: "生命: ", statusWait: "⚠️ 待機中", i1: "1. 滑鼠控制紅點，點擊藍色起點啟動", i2: "2. 避開牆壁、圓球與邊框", i3: "3. 右上角按鈕可暫停", i4: "4. 抵達綠色終點過關" },
  en: { title: "Wire Loop", start: "Start", select: "Levels", instr: "Instructions", back: "Back", resume: "Resume", retry: "Retry", home: "Menu", pause: "Paused", clear: "Cleared!", fail: "Failed", next: "Next", replay: "Replay", hint: "Click BLUE start point", statusLvl: "Level: ", statusLife: "Lives: ", statusWait: "⚠️ Standby", i1: "1. Click blue dot to start", i2: "2. Avoid black areas", i3: "3. Top-right to pause", i4: "4. Reach green goal" },
  jp: { title: "イライラ棒", start: "スタート", select: "レベル", instr: "遊び方", back: "戻る", resume: "再開", retry: "リトライ", home: "メニュー", pause: "一時停止", clear: "クリア!", fail: "失敗", next: "次へ", replay: "もう一度", hint: "青い地点をクリック", statusLvl: "レベル: ", statusLife: "ライフ: ", statusWait: "⚠️ 待機中", i1: "1. 青い点をクリック", i2: "2. 壁や玉を避ける", i3: "3. 右上で停止", i4: "4. 緑のゴールへ" },
  ko: { title: "전류급급봉", start: "시작", select: "레벨", instr: "설명", back: "뒤로", resume: "계속", retry: "다시", home: "메뉴", pause: "정지", clear: "성공!", fail: "실패", next: "다음", replay: "다시", hint: "파란색 점 클릭", statusLvl: "레벨: ", statusLife: "생명: ", statusWait: "⚠️ 대기", i1: "1. 파란색 클릭 시작", i2: "2. 검은 벽 피하기", i3: "3. 우측 상단 일시정지", i4: "4. 초록색 도착" },
  th: { title: "เกมลวดหนาม", start: "เริ่ม", select: "ด่าน", instr: "วิธีเล่น", back: "กลับ", resume: "ต่อ", retry: "ใหม่", home: "หน้าหลัก", pause: "หยุด", clear: "ผ่าน!", fail: "พลาด", next: "ต่อไป", replay: "อีกครั้ง", hint: "คลิกจุดสีฟ้า", statusLvl: "ด่าน: ", statusLife: "ชีวิต: ", statusWait: "⚠️ รอ", i1: "1. คลิกสีฟ้าเพื่อเริ่ม", i2: "2. เลี่ยงสีดำ", i3: "3. ขวาบนหยุด", i4: "4. ไปที่สีเขียว" },
  de: { title: "Heißer Draht", start: "Start", select: "Levels", instr: "Info", back: "Zurück", resume: "Weiter", retry: "Neu", home: "Menü", pause: "Pause", clear: "Sieg!", fail: "Verloren", next: "Weiter", replay: "Nochmal", hint: "Blau klicken", statusLvl: "Level: ", statusLife: "Leben: ", statusWait: "⚠️ Wartet", i1: "1. Blau zum Start", i2: "2. Schwarz vermeiden", i3: "3. Pause oben rechts", i4: "4. Grünes Ziel" },
  fr: { title: "Fil Électrique", start: "Jouer", select: "Niveaux", instr: "Règles", back: "Retour", resume: "Play", retry: "Encore", home: "Menu", pause: "Pause", clear: "Gagné!", fail: "Perdu", next: "Suivant", replay: "Rejouer", hint: "Cliquez le bleu", statusLvl: "Niveau: ", statusLife: "Vies: ", statusWait: "⚠️ Attente", i1: "1. Cliquez le bleu", i2: "2. Évitez le noir", i3: "3. Pause en haut", i4: "4. But vert" }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  // 🌟 初始化下拉選單
  langSelect = createSelect();
  langSelect.position(20, 20); 
  langSelect.option('繁體中文', 'zh');
  langSelect.option('English', 'en');
  langSelect.option('日本語', 'jp');
  langSelect.option('한국어', 'ko');
  langSelect.option('ไทย', 'th');
  langSelect.option('Deutsch', 'de');
  langSelect.option('Français', 'fr');
  langSelect.selected('zh'); // 預設選中中文
  langSelect.changed(() => { curLang = langSelect.value(); });

  // 簡單美化下拉選單
  langSelect.style('padding', '5px');
  langSelect.style('border-radius', '5px');
  langSelect.style('background-color', 'white');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 🌟 處理點擊一次性的邏輯
function mouseClicked() {
  if (gameState === "PLAY") {
    // 暫停鍵點擊
    if (dist(mouseX, mouseY, width - 50, 50) < 25) {
      isPaused = !isPaused;
      return;
    }
    // 藍色起點啟動
    if (!isPaused && !isPlaying) {
      if (dist(mouseX, mouseY, 60, height / 2) < 30) {
        isPlaying = true;
      }
    }
  }
}

function draw() {
  background(50); 
  let t = langData[curLang];

  // 🌟 管理選單顯示：只在主畫面、選關、說明、結果、暫停時顯示
  if (gameState === "PLAY" && isPlaying && !isPaused) {
    langSelect.hide();
  } else {
    langSelect.show();
  }

  switch (gameState) {
    case "START": drawMenu(t); break;
    case "INSTRUCTIONS": drawInstructions(t); break;
    case "SELECT": drawLevelSelect(t); break;
    case "PLAY": playLoop(t); break;
    case "RESULT": drawResult(t); break;
    case "GAMEOVER": drawGameOver(t); break;
  }
}

function playLoop(t) {
  drawMap();
  displayStatus(t);
  drawPauseButton();

  if (isPaused) {
    drawPauseMenu(t);
  } else {
    if (!isPlaying) {
      fill(255); textSize(20); text(t.hint, width / 2, height - 60);
    } else {
      checkCollision();
      checkWin();
    }
  }
  
  if (damageFlash > 0) {
    noFill(); stroke(255, 0, 0, damageFlash); strokeWeight(40);
    rect(0, 0, width, height); damageFlash -= 10; 
  }
}

function drawPauseMenu(t) {
  push(); fill(0, 180); rect(0, 0, width, height); 
  fill(255, 204, 0); textSize(50); text(t.pause, width / 2, height * 0.2);
  let cy = height * 0.5;
  drawButton(t.resume, width / 2, cy - 80, 220, 50, () => { isPaused = false; });
  drawButton(t.retry, width / 2, cy - 15, 220, 50, () => { startLevel(); });
  drawButton(t.home, width / 2, cy + 50, 220, 50, () => { gameState = "START"; });
  pop();
}

function drawMenu(t) {
  fill(255, 204, 0); textSize(height * 0.08); text(t.title, width / 2, height * 0.3);
  drawButton(t.start, width / 2, height * 0.5, 240, 60, () => { level = 1; mode = "SEQUENCE"; startLevel(); });
  drawButton(t.select, width / 2, height * 0.62, 240, 60, () => { gameState = "SELECT"; });
  drawButton(t.instr, width / 2, height * 0.74, 240, 60, () => { gameState = "INSTRUCTIONS"; });
}

function drawInstructions(t) {
  fill(255); textSize(30); text(t.instr, width / 2, height * 0.25);
  textSize(18); text(t.i1, width / 2, height * 0.4); text(t.i2, width / 2, height * 0.47);
  text(t.i3, width / 2, height * 0.54); text(t.i4, width / 2, height * 0.61);
  drawButton(t.back, width / 2, height * 0.8, 150, 50, () => { gameState = "START"; });
}

function drawResult(t) {
  background(20, 50, 20); drawConfetti();
  fill(255, 204, 0); textSize(40); text("Level " + level + " " + t.clear, width / 2, height * 0.25);
  textSize(80); text("★".repeat(stars) + "☆".repeat(3 - stars), width / 2, height * 0.45);
  let btnY = height * 0.75;
  drawButton(t.replay, width / 2 - 240, btnY, 180, 50, () => { startLevel(); });
  let nTxt = (mode === "SEQUENCE" && level < 30) ? t.next : t.select;
  drawButton(nTxt, width / 2, btnY, 180, 50, () => {
    if (mode === "SEQUENCE" && level < 30) { level++; startLevel(); } else { gameState = "SELECT"; }
  });
  drawButton(t.home, width / 2 + 240, btnY, 180, 50, () => { gameState = "START"; });
}

function drawGameOver(t) {
  background(70, 10, 10); fill(255); textSize(60); text(t.fail, width / 2, height * 0.4);
  drawButton(t.retry, width / 2 - 110, height * 0.65, 180, 50, () => { startLevel(); });
  drawButton(t.home, width / 2 + 110, height * 0.65, 180, 50, () => { gameState = "START"; });
}

function displayStatus(t) {
  fill(255); textSize(18); textAlign(LEFT);
  text(t.statusLvl + level, 50, height-60); 
  text(t.statusLife + "❤️".repeat(max(0, lives)), 50, height-35);
  if(!isPlaying && !isPaused && gameState === "PLAY") { fill(255, 204, 0); text(t.statusWait, 150, height-60); }
  textAlign(CENTER);
}

// --- 物理與地圖繪製 ---

function drawMap() {
  noStroke(); fill(0); 
  rect(0, 0, width, 30); rect(0, height - 30, width, 30);
  rect(0, 0, 30, height); rect(width - 30, 0, 30, height);
  push(); stroke(0); let w = map(level, 1, 30, 100, 30);
  strokeWeight(w); noFill(); beginShape();
  for (let p of pathPoints) vertex(p.x, p.y);
  endShape(); pop();
  currentObstacles = []; if (level > 5) {
    fill(0); let count = floor(level / 4);
    for (let i = 0; i < count; i++) {
      let x = map(i, 0, 8, width * 0.2, width * 0.8), y = height / 2 + sin(frameCount * 0.05 + i) * (height * 0.2);
      ellipse(x, y, 50, 50); currentObstacles.push({ x: x, y: y, r: 25 });
    }
  }
  fill(0, 150, 255); ellipse(60, height / 2, 45, 45); 
  fill(0, 255, 100); rect(width - 75, height / 2 - 30, 45, 60); 
  fill(255, 100, 100); ellipse(mouseX, mouseY, 14, 14);
}

function checkCollision() {
  if (isPaused) return;
  let hit = false; let pMouse = createVector(mouseX, mouseY);
  if (mouseX < 37 || mouseX > width - 37 || mouseY < 37 || mouseY > height - 37) hit = true;
  let currentPathWidth = map(level, 1, 30, 100, 30);
  let safetyRadius = currentPathWidth / 2 - 7; 
  let isOnPath = false;
  for (let i = 0; i < pathPoints.length - 1; i++) {
    if (distToSegment(pMouse, pathPoints[i], pathPoints[i + 1]) < safetyRadius) { isOnPath = true; break; }
  }
  if (!isOnPath) hit = true;
  if (!hit) { for (let obs of currentObstacles) { if (dist(mouseX, mouseY, obs.x, obs.y) < (obs.r + 7)) { hit = true; break; } } }
  if (hit) { lives--; damageFlash = 200; isPlaying = false; if (lives <= 0) gameState = "GAMEOVER"; else { mouseX = 60; mouseY = height / 2; } }
}

function startLevel() {
  lives = 3; isPlaying = false; isPaused = false; gameState = "PLAY";
  pathPoints = []; randomSeed(level * 123);
  pathPoints.push(createVector(60, height / 2)); 
  for (let i = 1; i < 6; i++) pathPoints.push(createVector(i * (width / 6), height / 2 + random(-height * 0.3, height * 0.3)));
  pathPoints.push(createVector(width - 60, height / 2));
}

function drawPauseButton() {
  let px = width - 50, py = 50; let h = dist(mouseX, mouseY, px, py) < 25;
  stroke(0); strokeWeight(2); fill(h ? 220 : 255); ellipse(px, py, 50, 50);
  fill(0); noStroke();
  if (!isPaused) { rect(px - 8, py - 10, 6, 20); rect(px + 2, py - 10, 6, 20); }
  else { triangle(px - 5, py - 10, px - 5, py + 10, px + 10, py); }
}

function drawButton(txt, x, y, w, h, callback) {
  let hovering = mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;
  stroke(0); strokeWeight(2); fill(hovering ? 230 : 255);
  rectMode(CENTER); rect(x, y, w, h, 15);
  noStroke(); fill(0); textSize(18); text(txt, x, y);
  rectMode(CORNER);
  if (hovering && mouseIsPressed) { callback(); mouseIsPressed = false; }
}

function drawLevelSelect(t) {
  fill(255); textSize(30); text(t.select, width / 2, height * 0.1);
  let cols = 6; let sx = width / 8.5, sy = height / 9;
  for (let i = 0; i < 30; i++) {
    let x = (width/2 - (2.5 * sx)) + (i % cols) * sx, y = height * 0.25 + floor(i / cols) * sy;
    drawButton((i + 1).toString(), x, y, 60, 55, () => { level = i + 1; mode = "MANUAL"; startLevel(); });
  }
  drawButton(t.back, width / 2, height - 60, 160, 40, () => { gameState = "START"; });
}

function checkWin() { if (mouseX > width - 75 && dist(mouseX, mouseY, width - 50, height/2) < 40) { stars = lives; initConfetti(); gameState = "RESULT"; } }

function initConfetti() {
  confetti = []; for (let i = 0; i < 100; i++) {
    confetti.push({ x: random(width), y: random(-height, 0), size: random(5, 12), color: color(random(255), random(255), random(255)), speed: random(3, 7), angle: random(TWO_PI) });
  }
}

function drawConfetti() {
  for (let c of confetti) {
    fill(c.color); noStroke(); push(); translate(c.x, c.y); rotate(c.angle); rect(0, 0, c.size, c.size); pop();
    c.y += c.speed; c.angle += 0.1;
  }
}

function distToSegment(p, v, w) {
  let l2 = dist(v.x, v.y, w.x, w.y); l2 = l2 * l2; if (l2 == 0) return dist(p.x, p.y, v.x, v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t)); return dist(p.x, p.y, v.x + t * (w.x - v.x), v.y + t * (w.y - v.y));
}