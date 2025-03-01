# Visualisation des Salaires INSEE

Une application moderne de visualisation des données de salaires inspirée de l'outil de l'INSEE, avec des fonctionnalités améliorées.

## Fonctionnalités

- **Comparaison de salaire** : Entrez votre salaire mensuel net pour voir comment il se compare à la distribution nationale
- **Filtres interactifs** : Filtrez les données par sexe, profession, âge et secteur d'activité
- **Visualisation graphique** : Graphique interactif montrant la distribution des salaires par centile
- **Tableau de données** : Accès aux données brutes avec pagination
- **Export de données** : Possibilité d'exporter les données en CSV ou JSON

## Technologies utilisées

- **Next.js** : Framework React moderne avec rendu côté serveur
- **TypeScript** : Pour une meilleure sécurité de type et une maintenance facilitée
- **Tailwind CSS** : Pour un design flexible et rapide
- **Shadcn UI** : Pour des composants élégants et personnalisables
- **Recharts** : Pour les visualisations de données
- **TanStack Table** : Pour la gestion des tableaux de données

## Installation

1. Clonez ce dépôt
2. Installez les dépendances :

```bash
npm install
```

3. Lancez le serveur de développement :

```bash
npm run dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Structure du projet

- `app/` - Pages de l'application Next.js
- `components/` - Composants React réutilisables
- `lib/` - Utilitaires, types et données
  - `data/` - Données et fonctions de manipulation des données
  - `utils.ts` - Fonctions utilitaires

## Développement

### Ajout de nouvelles fonctionnalités

Pour ajouter de nouvelles fonctionnalités ou modifier les existantes, vous pouvez :

1. Modifier les composants dans le dossier `components/`
2. Ajouter ou modifier les données dans `lib/data/`
3. Créer de nouvelles pages dans le dossier `app/`

### Personnalisation du style

Le style est principalement géré par Tailwind CSS. Vous pouvez personnaliser l'apparence en modifiant :

- `app/globals.css` - Styles globaux
- Classes Tailwind dans les composants

## Déploiement

Cette application peut être facilement déployée sur Vercel ou tout autre service compatible avec Next.js.

```bash
npm run build
```

## Licence

MIT
