// Variables globales avec valeurs par défaut
let settings = {
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  size: 200,
  opacity: 80,
  speed: 1,
  enabled: true,
  showBorder: false,
  autoHide: true,
  theme: 'modern',
  position: 'center',
  displayText: 'Hello World',
  fontSize: 16,
  borderRadius: 20,
  refreshInterval: 1000,
  // 🆕 v2.1.0 - Nouvelles fonctionnalités
  shadowIntensity: 50,
  animationType: 'bounce',
  showTimestamp: false
};

// Variables pour l'horloge
let clockInterval = null;

// Initialisation
function init() {
  updateClock();
  
  // Appliquer la configuration initiale
  applyAllSettings(settings);
  
  // Démarrer l'horloge
  startClockUpdate();
  
  // Écouter les messages de MyWallpaper
  window.addEventListener('message', handleMessage);
  
  // Signaler que l'addon est prêt
  sendMessage('ADDON_READY');
  
  console.log('🚀 Addon Template Avancé initialisé avec tous les paramètres');
}

// Mettre à jour l'horloge
function updateClock() {
  const now = new Date();
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');
  
  // Format de l'heure
  const time = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Format de la date
  const date = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  timeElement.textContent = time;
  dateElement.textContent = date;
  
  // 🆕 v2.1.0 - Mettre à jour le timestamp si activé
  if (settings.showTimestamp) {
    updateTimestamp();
  }
}

// Gérer les messages de MyWallpaper
function handleMessage(event) {
  const message = event.data;
  
  // Support des deux formats de message
  if (message.type === 'SETTINGS_UPDATE' && message.source === 'MyWallpaperHost') {
    console.log('📥 SETTINGS_UPDATE reçu:', message.settings);
    updateSettings(message.settings);
  } else if (message.type === 'CONFIG_UPDATE') {
    console.log('📥 CONFIG_UPDATE reçu:', message.config);
    updateSettings(message.config);
  } else if (message.type === 'RESIZE') {
    updateSize(message.width, message.height);
  }
}

// Mettre à jour les paramètres
function updateSettings(newSettings) {
  console.log('🔧 Mise à jour des settings:', newSettings);
  
  // Fusionner avec les settings existants
  settings = { ...settings, ...newSettings };
  
  // Support legacy - mapper color vers primaryColor
  if (newSettings.color && !newSettings.primaryColor) {
    settings.primaryColor = newSettings.color;
  }
  
  // Appliquer tous les changements
  applyAllSettings(settings);
  
  console.log('✅ Settings appliqués:', settings);
}

// Appliquer tous les paramètres
function applyAllSettings(config) {
  const widget = document.querySelector('.widget');
  const time = document.querySelector('.time');
  const date = document.querySelector('.date');
  
  if (!widget) return;
  
  // 🎨 Couleurs
  if (config.primaryColor) {
    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
  }
  
  if (config.secondaryColor) {
    document.documentElement.style.setProperty('--secondary-color', config.secondaryColor);
  }
  
  // 📏 Dimensions
  if (config.size) {
    document.documentElement.style.setProperty('--widget-size', config.size + 'px');
  }
  
  if (config.fontSize) {
    document.documentElement.style.setProperty('--font-size', config.fontSize + 'px');
  }
  
  if (config.borderRadius !== undefined) {
    document.documentElement.style.setProperty('--border-radius', config.borderRadius + 'px');
  }
  
  // 🎭 Effets
  if (config.opacity !== undefined) {
    document.documentElement.style.setProperty('--opacity', (config.opacity / 100));
  }
  
  if (config.speed) {
    document.documentElement.style.setProperty('--speed', config.speed + 's');
    
    // Classes de vitesse
    widget.classList.remove('speed-slow', 'speed-normal', 'speed-fast');
    if (config.speed <= 0.5) widget.classList.add('speed-fast');
    else if (config.speed >= 2) widget.classList.add('speed-slow');
    else widget.classList.add('speed-normal');
  }
  
  // ✅ Activation/désactivation
  if (config.enabled !== undefined) {
    widget.classList.toggle('disabled', !config.enabled);
  }
  
  // 🖼️ Bordure
  if (config.showBorder !== undefined) {
    widget.classList.toggle('no-border', !config.showBorder);
  }
  
  // 👻 Auto-hide
  if (config.autoHide !== undefined) {
    widget.classList.toggle('auto-hide', config.autoHide);
  }
  
  // 🎨 Thème
  if (config.theme) {
    // Supprimer les anciens thèmes
    widget.classList.remove('theme-classic', 'theme-modern', 'theme-minimal', 'theme-glassmorphism');
    // Appliquer le nouveau thème
    widget.classList.add('theme-' + config.theme);
  }
  
  // 📝 Texte personnalisé
  if (config.displayText) {
    updateDisplayText(config.displayText);
  }
  
  // ⏱️ Intervalle de rafraîchissement
  if (config.refreshInterval) {
    restartClockUpdate(config.refreshInterval);
  }
  
  // 🆕 v2.1.0 - Nouvelles fonctionnalités
  
  // 🌑 Intensité de l'ombre
  if (config.shadowIntensity !== undefined) {
    document.documentElement.style.setProperty('--shadow-intensity', config.shadowIntensity / 100);
  }
  
  // 🎬 Type d'animation
  if (config.animationType) {
    widget.classList.remove('anim-none', 'anim-bounce', 'anim-fade', 'anim-slide', 'anim-zoom');
    widget.classList.add('anim-' + config.animationType);
  }
  
  // ⏰ Timestamp
  if (config.showTimestamp !== undefined) {
    toggleTimestamp(config.showTimestamp);
  }
}

// Démarrer la mise à jour de l'horloge
function startClockUpdate() {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(updateClock, settings.refreshInterval || 1000);
}

// Redémarrer l'horloge avec un nouvel intervalle
function restartClockUpdate(interval) {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(updateClock, interval);
}

// Mettre à jour le texte affiché
function updateDisplayText(text) {
  let displayElement = document.querySelector('.display-text');
  
  if (!displayElement) {
    // Créer l'élément s'il n'existe pas
    displayElement = document.createElement('div');
    displayElement.className = 'display-text';
    document.querySelector('.clock').appendChild(displayElement);
  }
  
  displayElement.textContent = text;
}

// 🆕 v2.1.0 - Afficher/masquer le timestamp
function toggleTimestamp(show) {
  let timestampElement = document.querySelector('.timestamp');
  
  if (show && !timestampElement) {
    // Créer l'élément timestamp
    timestampElement = document.createElement('div');
    timestampElement.className = 'timestamp';
    document.querySelector('.clock').appendChild(timestampElement);
    updateTimestamp();
  } else if (!show && timestampElement) {
    // Supprimer l'élément timestamp
    timestampElement.remove();
  }
}

// Mettre à jour le timestamp
function updateTimestamp() {
  const timestampElement = document.querySelector('.timestamp');
  if (timestampElement) {
    const now = new Date();
    timestampElement.textContent = `Mis à jour: ${now.toLocaleTimeString()}`;
  }
}

// Mettre à jour la taille (legacy)
function updateSize(width, height) {
  const size = Math.min(width, height);
  document.documentElement.style.setProperty('--widget-size', size + 'px');
}

// Envoyer un message à MyWallpaper
function sendMessage(type, data = {}) {
  const message = {
    type,
    source: 'MyWallpaperAddon',
    timestamp: Date.now(),
    ...data
  };
  
  if (window.parent !== window) {
    window.parent.postMessage(message, '*');
  }
}

// Démarrer l'addon quand le DOM est prêt
document.addEventListener('DOMContentLoaded', init);

// Debug - exposer les fonctions globalement
window.addonDebug = {
  settings,
  updateSettings,
  applyAllSettings,
  sendMessage
};