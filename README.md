# MyWallpaper Addon Template

Template simple pour créer des addons MyWallpaper.

## 🚀 Utilisation

1. **Fork ce repository**
2. **Modifiez les fichiers** selon vos besoins
3. **Testez localement** avec un serveur HTTP
4. **Publiez sur GitHub** et partagez l'URL

## 📁 Structure

```
├── addon.json    # Configuration de l'addon
├── index.html    # Page principale
├── styles.css    # Styles CSS
├── script.js     # Logique JavaScript
└── README.md     # Cette documentation
```

## ⚙️ Configuration (addon.json)

```json
{
  "name": "Mon Premier Addon",
  "description": "Un addon simple pour MyWallpaper",
  "version": "1.0.0",
  "author": {
    "name": "Votre Nom",
    "github": "votreusername"
  },
  "type": "widget",
  "category": ["clock"],
  "settings": {
    "color": {
      "type": "color",
      "label": "Couleur",
      "default": "#3B82F6"
    },
    "size": {
      "type": "range", 
      "label": "Taille",
      "default": 200,
      "min": 100,
      "max": 400
    }
  }
}
```

## 🎨 Personnalisation

### Changer les couleurs
Modifiez les variables CSS dans `styles.css`:
```css
:root {
  --primary-color: #3B82F6;
  --widget-size: 200px;
}
```

### Ajouter des paramètres
Ajoutez dans `addon.json`:
```json
"settings": {
  "nouveauParametre": {
    "type": "boolean",
    "label": "Nouveau paramètre",
    "default": true
  }
}
```

## 🧪 Test local

```bash
# Servir les fichiers localement
npx http-server . -p 8080 --cors

# URL de test: http://localhost:8080
```

## 📤 Publication

1. Créez un repository GitHub public
2. Uploadez tous les fichiers
3. Partagez l'URL GitHub avec les utilisateurs MyWallpaper

## 📝 Types de paramètres

- `color`: Sélecteur de couleur
- `range`: Curseur avec min/max
- `boolean`: Case à cocher
- `string`: Champ texte
- `select`: Liste déroulante

Exemple avec options:
```json
"theme": {
  "type": "select",
  "label": "Thème",
  "default": "modern",
  "options": [
    { "label": "Moderne", "value": "modern" },
    { "label": "Classique", "value": "classic" }
  ]
}
```