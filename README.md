# Arbora

Arbora is a modern genealogy platform designed to create, manage and visualize family trees.

The goal is to provide a flexible and intuitive way to explore family relationships through an interactive graph interface.

## Features

- Create and manage family trees
- Manage people and relationships
- Interactive family tree visualization
- Persistent data storage
- Session-based authentication

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Flow
- Zustand

### Backend

- Node.js
- Fastify
- TypeScript
- Prisma
- PostgreSQL

### Infrastructure

- Docker
- Docker Compose

## Project Structure

```
arbora/
├── apps/
│ ├── web/ # Frontend application
│ └── api/ # Backend API
│
├── packages/
│ ├── database/ # Prisma database package
│ └── shared/ # Shared types and utilities
│
└── docker-compose.yml
```

## Getting Started

### Requirements

- Node.js
- npm
- Docker

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd arbora
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Start the development environment:

```bash
npm run dev
```

### Docker

Build and run the production containers:

```bash
docker compose up --build
```

### Environment Variables

See `.env.example` for the required configuration.

### License

Private project.