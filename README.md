# Projet ISEN - Serveur HTTP et WebSockets

Serveur HTTP et WebSockets du projet ISEN faisant office de plaque tournante dans l'architecture.

## Structure

```bash
$ tree --gitignore
.
├── config.json # Configuration par défaut
├── docker-compose-dev.yml  # Fichiers docker compose (avec une version dev)
├── docker-compose.yml
├── Dockerfile  # Description de l'image Docker
├── index.js    # Point d'entrée du serveur
├── logs    # Dossier stockant les logs du serveur
│   └── README.md
├── package.json    # Fichiers npm pour la description des dépendances
├── package-lock.json
├── public  # Dossier regroupant les ressources publiques (JS, CSS, ...)
│   └── JS
│       └── app.js
├── README.md
├── utils   # Dossier de modules JS
│   └── logger.js
└── views   # Dossier stockant les pages HTML
    └── index.html

6 directories, 12 files
```

## Lancement sans Docker

* Copier `.env.dev` ou `.env.prod` et le renommer `.env` en le complétant si nécessaire. Il s'agit d'un fichier regroupant les variables d'environnement.

```bash
$ npm install
$ npm start
```

## Lancement avec Docker

### Production

* Copier `.env.dev` ou `.env.prod` et le renommer `.env` en le complétant si nécessaire. Il s'agit d'un fichier regroupant les variables d'environnement.

```bash
$ docker compose build # Pour construire les images la première fois
```

```bash
$ docker compose up -d # Pour lancer les conteneurs
$ docker logs -f server
```

```bash
$ docker compose down # Pour stopper les conteneurs
```

### Développement

* Copier `.env.dev` ou `.env.prod` et le renommer `.env` en le complétant si nécessaire. Il s'agit d'un fichier regroupant les variables d'environnement.

```bash
$ docker compose -f docker-compose-dev.yml build # Pour construire les images la première fois
```

```bash
$ docker compose -f docker-compose-dev.yml up -d # Pour lancer les conteneurs
$ docker logs -f server
```

```bash
$ docker compose -f docker-compose-dev.yml down # Pour stopper les conteneurs