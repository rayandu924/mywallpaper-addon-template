// 🤖 MATRIX v2.5.0 - Cyberpunk JavaScript
let settings = {
  primaryColor: '#00ff41',
  displayText: '🤖 MATRIX v2.5.0 🤖'
};

// Variables Matrix Rain
let matrixRain = {
  canvas: null,
  ctx: null,
  drops: [],
  characters: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  fontSize: 14,
  columns: 0
};

// Variables pour l'horloge
let clockInterval = null;

// 🤖 Initialisation Matrix
function init() {
  console.log('🤖 MATRIX v2.5.0 initialisé!');
  
  // Initialiser Matrix Rain
  initMatrixRain();
  
  // Démarrer l'horloge
  updateClock();
  startClockUpdate();
  
  // Appliquer les settings initiaux
  applySettings();
  
  // Écouter les messages de MyWallpaper
  window.addEventListener('message', handleMessage);
  
  // Signaler que l'addon est prêt
  sendMessage('ADDON_READY');
  
  console.log('🤖 MATRIX Interface opérationnelle - Bienvenue dans la Matrice!');
}

// 🌧️ Initialiser l'effet Matrix Rain
function initMatrixRain() {
  const canvas = document.getElementById('matrix-rain');
  if (!canvas) return;
  
  matrixRain.canvas = canvas;
  matrixRain.ctx = canvas.getContext('2d');
  
  // Redimensionner le canvas
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Initialiser les gouttes
  initDrops();
  
  // Démarrer l'animation
  animateMatrix();
}

// 📐 Redimensionner le canvas
function resizeCanvas() {
  matrixRain.canvas.width = window.innerWidth;
  matrixRain.canvas.height = window.innerHeight;
  matrixRain.columns = Math.floor(matrixRain.canvas.width / matrixRain.fontSize);
  initDrops();
}

// 💧 Initialiser les gouttes Matrix
function initDrops() {
  matrixRain.drops = [];
  for (let i = 0; i < matrixRain.columns; i++) {
    matrixRain.drops[i] = Math.random() * matrixRain.canvas.height / matrixRain.fontSize;
  }
}

// 🎬 Animation Matrix Rain
function animateMatrix() {
  const ctx = matrixRain.ctx;
  
  // Fond noir semi-transparent pour l'effet de traînée
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, matrixRain.canvas.width, matrixRain.canvas.height);
  
  // Texte vert Matrix
  ctx.fillStyle = '#00ff41';
  ctx.font = `${matrixRain.fontSize}px Share Tech Mono, monospace`;
  
  // Dessiner les caractères qui tombent
  for (let i = 0; i < matrixRain.drops.length; i++) {
    const char = matrixRain.characters[Math.floor(Math.random() * matrixRain.characters.length)];
    const x = i * matrixRain.fontSize;
    const y = matrixRain.drops[i] * matrixRain.fontSize;
    
    ctx.fillText(char, x, y);
    
    // Réinitialiser la goutte si elle sort de l'écran
    if (y > matrixRain.canvas.height && Math.random() > 0.975) {
      matrixRain.drops[i] = 0;
    }
    
    matrixRain.drops[i]++;
  }
  
  requestAnimationFrame(animateMatrix);
}

// ⏰ Mettre à jour l'horloge
function updateClock() {
  const now = new Date();
  
  // Format heure Matrix style
  const time = now.toLocaleTimeString('fr-FR', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Format date Matrix style
  const date = now.toISOString().split('T')[0];
  
  // Mettre à jour l'interface
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');
  
  if (timeElement) timeElement.textContent = time;
  if (dateElement) dateElement.textContent = date;
}

// ▶️ Démarrer la mise à jour de l'horloge
function startClockUpdate() {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(updateClock, 1000);
}

// 🎛️ Appliquer les settings
function applySettings() {
  // Mettre à jour le texte personnalisé
  const customTextElement = document.getElementById('customText');
  if (customTextElement && settings.displayText) {
    customTextElement.textContent = settings.displayText;
  }
  
  // Mettre à jour les couleurs si nécessaire
  if (settings.primaryColor && settings.primaryColor !== '#00ff41') {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    
    // Mettre à jour les couleurs Matrix
    const style = document.createElement('style');
    style.textContent = `
      .terminal-window { border-color: ${settings.primaryColor} !important; }
      .matrix-title, .value { color: ${settings.primaryColor} !important; }
      .version-badge { color: ${settings.primaryColor} !important; }
    `;
    document.head.appendChild(style);
  }
  
  console.log('🎛️ Settings Matrix appliqués:', settings);
}

// 📨 Gérer les messages de MyWallpaper
function handleMessage(event) {
  try {
    const { type, config, settings: newSettings } = event.data;
    
    console.log('📥 Message Matrix reçu:', { type, config, settings: newSettings });
    
    if (type === 'CONFIG_UPDATE' && config) {
      Object.assign(settings, config);
      applySettings();
    }
    
    if (type === 'SETTINGS_UPDATE' && newSettings) {
      Object.assign(settings, newSettings);
      applySettings();
    }
    
  } catch (error) {
    console.error('❌ Erreur traitement message Matrix:', error);
  }
}

// 📤 Envoyer un message à MyWallpaper
function sendMessage(type, data = {}) {
  try {
    window.parent.postMessage({
      type,
      source: 'matrix-addon',
      version: '2.5.0',
      ...data
    }, '*');
  } catch (error) {
    console.error('❌ Erreur envoi message Matrix:', error);
  }
}

// 🚀 Démarrage automatique quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}