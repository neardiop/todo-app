# 📝 Todo App - Application de Gestion de Tâches

Application web moderne de gestion de tâches développée avec Angular 10, Material Design et JSON Server.

## ✨ Fonctionnalités

- ✅ **Gestion des tâches** : Créer, modifier, supprimer des tâches
- 👥 **Gestion des personnes** : Assigner des tâches à des personnes
- 🌍 **Internationalisation** : Support Français/Anglais avec changement instantané
- 📊 **Export** : Exporter les tâches en Excel (.xlsx) ou PDF
- 🔍 **Filtres** : Filtrer les tâches par titre, personne, date, priorité, labels
- 🎨 **Material Design** : Interface moderne et responsive
- ✏️ **Autocomplete** : Sélection intelligente des personnes
- ✔️ **Validation** : Formulaires avec validation en temps réel

## 🚀 Installation

### Prérequis
- Node.js (v12 ou supérieur)
- npm (v6 ou supérieur)

### Installation des dépendances
```bash
npm install
```

## 💻 Démarrage

### 1. Lancer le serveur API (Backend)
```bash
npx json-server --watch db.json --port 3000
```
L'API sera accessible sur `http://localhost:3000`

### 2. Lancer l'application (Frontend)
```bash
npm start
```
L'application sera accessible sur `http://localhost:4200`

## 📦 Build Production

```bash
npm run build
```
Les fichiers de production seront générés dans le dossier `dist/`

## 🛠️ Technologies Utilisées

- **Angular 10** - Framework frontend
- **Angular Material** - Composants UI
- **Transloco** - Internationalisation (i18n)
- **ng2-smart-table** - Tableaux de données
- **JSON Server** - API REST mock
- **xlsx** - Export Excel
- **jsPDF** - Export PDF
- **RxJS** - Programmation réactive

## 📁 Structure du Projet

```
src/
├── app/
│   ├── components/          # Composants de l'application
│   │   ├── todos/          # Liste des tâches
│   │   ├── persons/        # Liste des personnes
│   │   ├── todo-modal/     # Modal de création/édition de tâche
│   │   └── person-modal/   # Modal de création/édition de personne
│   ├── models/             # Modèles de données
│   ├── services/           # Services (API, Export)
│   └── transloco-root.module.ts  # Configuration i18n
├── assets/
│   └── i18n/               # Fichiers de traduction (fr.json, en.json)
└── styles.css              # Styles globaux

db.json                     # Base de données JSON Server
```

## 🌐 API Endpoints

- `GET /todos` - Liste des tâches
- `POST /todos` - Créer une tâche
- `PUT /todos/:id` - Modifier une tâche
- `DELETE /todos/:id` - Supprimer une tâche
- `GET /persons` - Liste des personnes
- `POST /persons` - Créer une personne
- `PUT /persons/:id` - Modifier une personne
- `DELETE /persons/:id` - Supprimer une personne

## 📝 Utilisation

### Gestion des Tâches
1. Cliquer sur "Ajouter une tâche"
2. Remplir le formulaire (titre, personne, dates, priorité, labels)
3. Valider pour créer la tâche
4. Utiliser les icônes ✏️ et 🗑️ pour modifier ou supprimer

### Export des Données
- Cliquer sur **Excel** pour exporter au format .xlsx
- Cliquer sur **PDF** pour exporter au format .pdf
- Les exports incluent les filtres appliqués

### Changement de Langue
- Utiliser le sélecteur de langue dans le menu latéral
- Changement instantané sans rechargement de page

## 🎨 Personnalisation

Les couleurs et styles peuvent être modifiés dans :
- `src/styles.css` - Styles globaux et tableaux
- `src/app/components/**/*.css` - Styles des composants

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Développé avec ❤️ en utilisant Angular et Material Design
