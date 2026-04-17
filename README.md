# Mini API

API REST Node.js / Express / TypeScript / Sequelize avec documentation Swagger automatique via tsoa.

## Stack

| Couche | Technologie |
|---|---|
| Runtime | Node.js (latest) + TypeScript |
| Framework | Express 5 |
| ORM | Sequelize 6 + PostgreSQL |
| Documentation | tsoa → OpenAPI 3 / Swagger UI |
| Tests | Jest + Supertest (unit, integration, e2e) |
| Reverse proxy | nginx |
| HTTPS | Let's Encrypt via certbot |
| CI | GitHub Actions |

---

## Développement local

### Prérequis

- Node.js ≥ 20
- PostgreSQL (local ou Docker)

### Installation

```bash
git clone <repo>
cd mini_api
npm install
cp .env.example .env   # puis adapter les valeurs
```

### Variables d'environnement (`.env`)

```env
DB_HOST=localhost
DB_USER=miniapi
DB_PASSWORD=miniapi
DB_NAME=miniapi
DB_DIALECT=postgres
PORT=3000

DOMAIN=api.example.com     # utilisé uniquement en production
ACME_EMAIL=you@example.com # utilisé uniquement en production
```

### Démarrer le serveur

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.  
La documentation Swagger est disponible sur `http://localhost:3000/api-docs`.

### Peupler la base de données

```bash
npm run seed
```

---

## Tests

| Commande | Portée |
|---|---|
| `npm test` | Tests unitaires + intégration |
| `npm run test:unit` | Tests unitaires uniquement |
| `npm run test:integration` | Tests d'intégration uniquement |
| `npm run test:e2e` | Tests e2e (nécessite une BDD PostgreSQL) |
| `npm run test:coverage` | Rapport de couverture |

Les tests e2e utilisent une base dédiée (`miniapi_test`) configurée dans `.env.test`.

---

## Build de production

```bash
npm run build
```

Génère le dossier `dist/` prêt à l'emploi :

1. `tsoa spec-and-routes` — génère `app/routers/routes.ts` et `app/config/swagger.json`
2. `tsc -p tsconfig.build.json` — compile TypeScript vers `dist/`
3. Copie `swagger.json` dans `dist/config/`

---

## Déploiement (Docker)

### Architecture

```sh
Internet
   │
   ▼
nginx :80/:443
   │  ├─ HTTP  → redirige vers HTTPS
   │  └─ HTTPS → proxy vers app:3000
   │
   ▼
app :3000 (Node.js, réseau interne Docker uniquement)
   │
   ▼
postgres :5432
```

### Prérequis techniques

- Docker + Docker Compose installés sur le serveur
- Ports 80 et 443 ouverts dans le pare-feu
- Un nom de domaine pointant vers l'IP du serveur (enregistrement DNS A)
- Clé SSH configurée et liée au dépôt GitHub (pour le clone et les mises à jour)

### 1. Cloner le dépôt

```bash
git clone <repo>
cd mini_api
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` avec les valeurs de production :

```env
DB_USER=miniapi
DB_PASSWORD=<mot_de_passe_sécurisé>
DB_NAME=miniapi

DOMAIN=api.example.com
ACME_EMAIL=you@example.com
```

> `DB_HOST` et `DB_DIALECT` sont gérés directement dans `docker-compose.yml`.

### 3. Obtenir le certificat SSL (première fois uniquement)

Avant de lancer le script, s'assurer que le domaine (`DOMAIN`) est correctement configuré pour pointer vers le serveur (enregistrement DNS A). S'assurer aussi que les ports 80 et 443 sont ouverts dans le pare-feu.

Ce script résout le problème de démarrage en créant un certificat auto-signé temporaire pour lancer nginx, puis le remplace par un certificat Let's Encrypt réel.

```bash
sudo DOMAIN=api.example.com ACME_EMAIL=you@example.com sh scripts/init-ssl.sh
```

Il effectue les étapes suivantes :

1. Crée un certificat auto-signé temporaire (pour que nginx puisse démarrer)
2. Démarre nginx
3. Lance certbot pour obtenir le certificat Let's Encrypt via le challenge HTTP
4. Recharge nginx avec le vrai certificat

### 4. Démarrer la stack complète

```bash
# Arrêter et supprimer les conteneurs existants (optionnel, si c'est la première fois)
docker compose down
# Démarrer tous les services en arrière-plan
docker compose up -d
```

Ordre de démarrage géré automatiquement :

- `postgres` démarre en premier (health check)
- `app` attend que postgres soit prêt
- `nginx` attend que app soit démarré
- `certbot` renouvelle le certificat toutes les 12h

### 5. Vérifier que tout tourne

```bash
docker compose ps
docker compose logs app
```

L'API est accessible sur `https://api.example.com`.  
La documentation Swagger est sur `https://api.example.com/api-docs`.

---

## Mise à jour

```bash
git pull
docker compose build app
docker compose up -d app
```

Seul le service `app` est rebuild — postgres et nginx ne sont pas affectés.

---

## Renouvellement SSL

Le renouvellement est **automatique** : le service `certbot` tente un renouvellement toutes les 12h (Let's Encrypt renouvelle uniquement si le certificat expire dans moins de 30 jours).

Pour forcer un renouvellement manuel :

```bash
docker compose run --rm certbot renew --force-renewal
docker compose exec nginx nginx -s reload
```

---

## CI/CD (GitHub Actions)

Le pipeline CI se déclenche à chaque push et pull request sur `main` :

| Job | Description |
|---|---|
| `unit-integration` | Tests unitaires et d'intégration (sans BDD) |
| `e2e` | Tests end-to-end avec une instance PostgreSQL éphémère |

Les jobs sont indépendants et s'exécutent en parallèle.
