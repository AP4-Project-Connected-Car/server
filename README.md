# Connected Car

Serveur HTTP et WebSockets du projet ISEN faisant office de plaque tournante dans l'architecture.

## Lancement avec Docker

### Production

* Copier `.env.prod` et le renommer `.env` en le complétant si nécessaire. Il s'agit d'un fichier regroupant les variables d'environnement.

```bash
$ git clone git@github.com:AP4-Project-Connected-Car/desktop-app.git front
$ git clone git@github.com:AP4-Project-Connected-Car/I2C-receiver.git
$ docker compose build # Pour construire les images la première fois
```

```bash
$ docker compose up -d # Pour lancer les conteneurs
$ docker logs -f server # Pour voir les logs du serveur
$ docker logs -f front # Pour voir les logs de l'interface
$ docker logs -f i2c # Pour voir les logs du script de lecture I2C
```

```bash
$ docker compose down # Pour stopper les conteneurs
```

### Développement

* Copier `.env.dev` et le renommer `.env` en le complétant si nécessaire. Il s'agit d'un fichier regroupant les variables d'environnement.

```bash
$ git clone git@github.com:AP4-Project-Connected-Car/desktop-app.git front
$ git clone git@github.com:AP4-Project-Connected-Car/I2C-receiver.git
$ docker compose -f docker-compose-dev.yml build # Pour construire les images la première fois
$ cd src && npm install && cd .. # Pour installer les dépendances du serveur localement
$ cd front && npm install && cd .. # Pour installer les dépendances du front localement
```

```bash
$ docker compose -f docker-compose-dev.yml up -d # Pour lancer les conteneurs
$ docker logs -f server # Pour voir les logs du serveur
$ docker logs -f front # Pour voir les logs de l'interface
$ docker logs -f i2c # Pour voir les logs du script de lecture I2C
```

```bash
$ docker compose -f docker-compose-dev.yml down # Pour stopper les conteneurs