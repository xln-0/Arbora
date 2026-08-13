<p align="center">
  <img src="apps/web/public/brand/arbora-mark.png" alt="Arbora" width="112" height="112">
</p>

<h1 align="center">Arbora</h1>

<p align="center">
  A modern, self-hosted genealogy application for building, managing and exploring family trees.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 22">
  <img src="https://img.shields.io/badge/Docker-amd64%20%7C%20arm64-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker architectures">
</p>

Arbora provides an interactive family graph, detailed person records and chronological views while keeping the data under your control. The interface is available in English and French.

## Features

- Create and manage multiple family trees.
- Add, edit and inspect people with birth and death information.
- Model parenthood, free unions, marriages and divorces.
- Preserve relationship milestones and validate ancestry consistency.
- Explore an automatically arranged, interactive family graph.
- Browse all tree elements and a horizontal tree timeline.
- Open individual profiles with relatives and a personal vertical timeline.
- Invite members with owner, editor and reader roles.
- Run locally or self-host with Docker Compose.

## Architecture

The project is an npm monorepo:

```text
arbora/
├── apps/
│   ├── api/          # Fastify HTTP API
│   └── web/          # React and Vite application
├── packages/
│   ├── database/     # Prisma client, schema and migrations
│   └── shared/       # Shared domain types
├── docker-compose.yml
└── docker-compose.prod.yml
```

### Technology

| Area | Stack |
| --- | --- |
| Web | React, TypeScript, Vite, Tailwind CSS, React Flow, Zustand |
| API | Node.js 22, Fastify, TypeScript |
| Data | PostgreSQL, Prisma |
| Delivery | Docker, Docker Compose, GitHub Actions, GHCR |

## Getting started

### Requirements

- Node.js 22
- npm
- Docker with Docker Compose

### Local development

```bash
git clone https://github.com/xln-0/Arbora.git
cd Arbora
cp .env.example .env
```

For development from the host, set `POSTGRES_HOST=localhost` and `CORS_ORIGINS=http://localhost:5173` in `.env`, then start PostgreSQL and initialize the project:

```bash
docker compose up -d postgres
npm ci
npm run gen:database
npm run migrate:deploy --workspace @arbora/database
npm run dev
```

The Web application is served by Vite and the API listens on the configured `PORT` (`3001` by default).

### Docker Compose

To build and start the complete stack locally:

```bash
cp .env.example .env
docker compose up --build
```

Before using this configuration outside a local environment, replace `POSTGRES_PASSWORD`, `CORS_ORIGINS` and `VITE_API_URL` with deployment-specific values.

To use the published production images:

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Container images

| Image | Stable tags | Beta tag |
| --- | --- | --- |
| `ghcr.io/xln-0/arbora-api` | `latest`, `1.0.0` | `beta` |
| `ghcr.io/xln-0/arbora-web` | `latest`, `1.0.0` | `beta` |

Stable images support `linux/amd64` and `linux/arm64`. Beta images target `linux/arm64` for 64-bit Raspberry Pi installations.

## Configuration

| Variable | Purpose | Example |
| --- | --- | --- |
| `POSTGRES_USER` | PostgreSQL user | `arbora` |
| `POSTGRES_PASSWORD` | PostgreSQL password | Use a strong secret |
| `POSTGRES_DB` | PostgreSQL database | `arbora` |
| `POSTGRES_HOST` | Database host | `localhost` or `postgres` |
| `POSTGRES_PORT` | Database port | `5432` |
| `PORT` | API port | `3001` |
| `CORS_ORIGINS` | Trusted Web origin(s) | `https://arbora.example.com` |
| `VITE_API_URL` | Public API URL used by the Web build | `https://api.example.com` |

See [.env.example](.env.example) for a complete template. Never commit a populated `.env` file.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Web and API development servers |
| `npm run build` | Build the database, shared package, API and Web app |
| `npm run test:api` | Run the API domain tests |
| `npm run test:web` | Run the critical React form tests |
| `npm run test:api:integration` | Run API integration and permission tests against the isolated `arbora_test` PostgreSQL database |
| `bash scripts/smoke-docker.sh` | Build and smoke test the API and Web Docker images |
| `npm run gen:database` | Generate the Prisma client |
| `npm run migrate:deploy --workspace @arbora/database` | Apply database migrations |

## Releases and branches

- `main` contains stable code and publishes multiarchitecture `latest` images.
- `develop` contains the next version and publishes ARM64 `beta` images.
- Git tags named `vX.Y.Z` publish immutable, multiarchitecture versioned images.
- Feature and maintenance work is merged into `develop` through pull requests.

See the [releases](https://github.com/xln-0/Arbora/releases) page for published versions.

## Security

Please read [SECURITY.md](SECURITY.md) before reporting a vulnerability. Do not include sensitive details in a public issue.

## Contributing

Contributions and bug reports are welcome. Open an issue before starting a substantial change, create a focused branch from `develop`, and include relevant tests with the pull request.

## License

No open-source license has been granted yet. Unless a `LICENSE` file is added, all rights are reserved by the copyright holder.
