let playerHealth = 100;
let enemyHealth = 100;
let gameOver = false;
let easterEggsFound = { special:false, attack:false, defend:false };
// Modo especial sempre ativo
let specialMode = true;

const log = document.getElementById('log');
const playerImg = document.getElementById('playerImg');
const enemyImg = document.getElementById('enemyImg');
const healthBar = document.getElementById('health');
const enemyHealthBar = document.getElementById('enemyHealth');

function updateHealth() {
  healthBar.style.width = playerHealth + '%';
  enemyHealthBar.style.width = enemyHealth + '%';
}

function logMessage(msg, color='white') {
  log.innerHTML = `<p style="color:${color}">${msg}</p>` + log.innerHTML;
}

function flashBorder(img, color) {
  img.style.border = `3px solid ${color}`;
  setTimeout(() => { img.style.border = '3px solid transparent'; }, 300);
}

function playSound(file) {
  const audio = new Audio(`sounds/${file}`);
  audio.play();
}

function easterEgg(action) {
  if (gameOver) return;
  let chance = Math.random();
  let icon = '';
  if (action === 'special' && chance < 0.5) { icon = '<img src="images/Tigre.png" style="width:32px; vertical-align:middle; animation: pulse 0.5s;">'; easterEggsFound.special = true; }
  else if (action === 'attack' && chance < 0.3) { icon = '<img src="images/Optprime.png" style="width:32px; vertical-align:middle; animation: pulse 0.5s;">'; easterEggsFound.attack = true; }
  else if (action === 'defend' && chance < 0.2) { icon = '<img src="images/SamuraiX.png" style="width:32px; vertical-align:middle; animation: pulse 0.5s;">'; easterEggsFound.defend = true; }
  if (icon) logMessage(`Olhe quem apareceu na sua torcida!: ${icon} "Vamos!!!"`, 'cyan');
}

function triggerVictoryCutscene() {
  const arena = document.getElementById('arena');
  let originalBg = arena.style.backgroundColor;
  arena.style.backgroundColor = '#330000';
  let flashes = 0;
  const interval = setInterval(() => {
    playerImg.style.border = playerImg.style.border === '3px solid gold' ? '3px solid transparent' : '3px solid gold';
    flashes++;
    if (flashes > 5) { clearInterval(interval); playerImg.style.border = '3px solid transparent'; arena.style.backgroundColor = originalBg; logMessage('🎉 Easter Egg desbloqueado! Parabéns! 🎉', 'pink'); showFigureReward(); }
  }, 300);
}

// Final secreto sempre ativo
function triggerSpecialEnding() {
  const arena = document.getElementById('arena');
  let originalBg = arena.style.backgroundColor;
  arena.style.backgroundColor = '#FFD700';
  logMessage('✨ Final Desbloqueado! Feliz Aniversário! ❤️ ✨', 'pink');
  let flashes = 0;
  const interval = setInterval(() => {
    playerImg.style.border = playerImg.style.border === '3px solid pink' ? '3px solid transparent' : '3px solid pink';
    flashes++;
    if (flashes > 6) { clearInterval(interval); playerImg.style.border = '3px solid transparent'; arena.style.backgroundColor = originalBg; showFigureReward(); }
  }, 300);
}

// Pop-up da recompensa física
function showFigureReward() {
  const arena = document.getElementById('arena');
  const rewardMessage = document.createElement('div');
  
  rewardMessage.id = 'figureReward';
  rewardMessage.style.position = 'absolute';
  rewardMessage.style.top = '50%';
  rewardMessage.style.left = '50%';
  rewardMessage.style.transform = 'translate(-50%, -50%)';
  rewardMessage.style.backgroundColor = 'rgba(0,0,0,0.9)';
  rewardMessage.style.color = 'gold';
  rewardMessage.style.padding = '30px';
  rewardMessage.style.border = '3px solid #FFD700';
  rewardMessage.style.borderRadius = '20px';
  rewardMessage.style.fontSize = '1.5em';
  rewardMessage.style.textAlign = 'center';
  rewardMessage.style.zIndex = '1000';
  rewardMessage.innerHTML = `
    🎉 Você venceu a Batalha! 🎉<br><br>
    <strong> "Parabéns!!" </br> Para retribuir, vou te acompanhar nas futuras batalhas! </strong><br> 💛
  `;
  
  document.body.appendChild(rewardMessage);

  setTimeout(() => {
    rewardMessage.style.transition = 'opacity 2s';
    rewardMessage.style.opacity = '0';
    setTimeout(() => rewardMessage.remove(), 2000);
  }, 4000);
}

// Ações do jogo
function enemyAttack() {
  if (gameOver) return;
  const enemies = ['O Alien Ciborg ferozmente', 'Com Deceptlasers', 'Robô Mecânico', 'Com suas garras de aranha'];
  const dmg = Math.floor(Math.random() * 15) + 5;
  playerHealth -= dmg;
  if (playerHealth < 0) playerHealth = 0;
  updateHealth();
  playSound('hit.mp3');
  logMessage(`${enemies[Math.floor(Math.random()*enemies.length)]} atacou A2 causando ${dmg} de dano!`);
  flashBorder(enemyImg, 'red');
  checkEnd();
}

function playerAttack() {
  if (gameOver) return;
  playSound('attack.mp3');
  const dmg = Math.floor(Math.random() * 15) + 5;
  enemyHealth -= dmg;
  if (enemyHealth < 0) enemyHealth = 0;
  updateHealth();
  logMessage(`A2 atacou causando ${dmg} de dano!`);
  flashBorder(playerImg, 'red');
  easterEgg('attack');
  checkEnemy();
}

function playerDefend() {
  if (gameOver) return;
  playSound('defend.mp3');
  logMessage(`A2 se defendeu! O próximo ataque do inimigo será mais fraco.`, 'blue');
  flashBorder(playerImg, 'blue');
  easterEgg('defend');
  setTimeout(enemyAttack, 500);
}

function playerSpecial() {
  if (gameOver) return;
  playSound('special.mp3');
  const dmg = Math.floor(Math.random() * 25) + 10;
  enemyHealth -= dmg;
  if (enemyHealth < 0) enemyHealth = 0;
  updateHealth();
  logMessage(`A2 usou Ataque Especial causando ${dmg} de dano!`, 'gold');
  flashBorder(playerImg, 'gold');
  easterEgg('special');
  checkEnemy();
}

function checkEnemy() {
  if (enemyHealth <= 0) {
    enemyHealth = 0;
    updateHealth();
    gameOver = true;
    playSound('victory.mp3');
    logMessage(`Inimigo derrotado! Você venceu a Arena! 🌟`, 'lime');
    logMessage(`Mensagem especial: “Você salvou o dia!” 💌`, 'pink');
    playerImg.src = 'images/Vitoria.jpg';
    enemyImg.src = 'images/InimigoPerde.png';
    triggerVictoryCutscene();
    triggerSpecialEnding();
  } else { setTimeout(enemyAttack, 500); }
}

function checkEnd() {
  if (playerHealth <= 0) {
    playerHealth = 0;
    updateHealth();
    gameOver = true;
    playSound('defeat.mp3');
    logMessage(`A2 foi derrotada… 😢`, 'red');
    playerImg.src = 'images/Derrota.jpg';
    enemyImg.src = 'images/InimigoGanha.png';
  }
}

function restartGame() {
  gameOver = false;
  playerHealth = 100;
  enemyHealth = 100;
  easterEggsFound = { special:false, attack:false, defend:false };
  updateHealth();
  log.innerHTML = '';
  playerImg.src = 'images/Heroina.png';
  enemyImg.src = 'images/Inimigo.png';
}


for (let i = 0; i < 15; i++) {
  const p = document.createElement('div');
  p.classList.add('particle');
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDelay = Math.random() * 6 + 's';
  document.body.appendChild(p);
}

updateHealth();