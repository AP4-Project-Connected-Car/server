# Connected Car

Serveur HTTP et WebSockets du projet ISEN faisant office de plaque tournante dans l'architecture.

## Lancement avec Docker

### Production

* Copier `.env.prod` et le renommer `.env` en le complétant si nécessaire. Il s'agit d'un fichier regroupant les variables d'environnement.

```bash
$ git clone git@github.com:AP4-Project-Connected-Car/desktop-app.git front
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
$ git clone git@github.com:AP4-Project-Connected-Car/desktop-app.git front
$ docker compose -f docker-compose-dev.yml build # Pour construire les images la première fois
$ cd src && npm install && cd .. # Pour installer les dépendances du serveur localement
$ cd front && npm install && cd .. # Pour installer les dépendances du front localement
```

```bash
$ docker compose -f docker-compose-dev.yml up -d # Pour lancer les conteneurs
$ docker logs -f server
```

```bash
$ docker compose -f docker-compose-dev.yml down # Pour stopper les conteneurs