# Projet ISEN - Serveur HTTP et WebSockets

Serveur HTTP et WebSockets du projet ISEN faisant office de plaque tournante dans l'architecture.

## Lancement avec Docker

### Production

* Copier `.env.prod` et le renommer `.env` en le complétant si nécessaire. Il s'agit d'un fichier regroupant les variables d'environnement.

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

* Copier `.env.dev` et le renommer `.env` en le complétant si nécessaire. Il s'agit d'un fichier regroupant les variables d'environnement.

```bash
$ docker compose -f docker-compose-dev.yml build # Pour construire les images la première fois
$ cd src && npm install && cd .. # Pour installer les dépendances localement
```

```bash
$ docker compose -f docker-compose-dev.yml up -d # Pour lancer les conteneurs
$ docker logs -f server
```

```bash
$ docker compose -f docker-compose-dev.yml down # Pour stopper les conteneurs