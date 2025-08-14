// Variables globales
let settings = {
  color: '#3B82F6',
  size: 200
};

// Initialisation
function init() {
  updateClock();
  setInterval(updateClock, 1000);
  
  // Écouter les messages de MyWallpaper
  window.addEventListener('message', handleMessage);
  
  // Signaler que l'addon est prêt
  sendMessage('ADDON_READY');
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
}

// Gérer les messages de MyWallpaper
function handleMessage(event) {
  const message = event.data;
  
  if (message.source !== 'MyWallpaperHost') return;
  
  switch (message.type) {
    case 'SETTINGS_UPDATE':
      updateSettings(message.settings);
      break;
    case 'RESIZE':
      updateSize(message.width, message.height);
      break;
  }
}

// Mettre à jour les paramètres
function updateSettings(newSettings) {
  settings = { ...settings, ...newSettings };
  
  // Appliquer la couleur
  if (settings.color) {
    document.documentElement.style.setProperty('--primary-color', settings.color);
  }
  
  // Appliquer la taille
  if (settings.size) {
    document.documentElement.style.setProperty('--widget-size', settings.size + 'px');
  }
}

// Mettre à jour la taille
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
  
  window.parent.postMessage(message, '*');
}

// Démarrer l'addon
document.addEventListener('DOMContentLoaded', init);