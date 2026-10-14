# Infrastructure

**Leads:** Anurag (Docker/SQLite) and Vassil (Linux VM/SSH)

## Docker Support & Deployment

The platform is fully containerized using Docker and Docker Compose.

### Quick Start with Docker Compose

Run the entire platform (Axum backend with persistent SQLite and Next.js frontend):

```bash
docker compose up --build
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8080](http://localhost:8080)
- **Persistent Storage:** Named volume `solana-vps-data` mounted to `/data` (`/data/solana-vps.sqlite`)

To run in the background:
```bash
docker compose up -d
```

To stop:
```bash
docker compose down
```

### Components
1. **`backend/Dockerfile`**: Multi-stage Rust 1.85+ build running on `debian:bookworm-slim`, exposing port 8080 with health checks at `/api/orders`.
2. **`frontend/Dockerfile`**: Multi-stage Node 22 Alpine build for Next.js 16, exposing port 3000 with `NEXT_PUBLIC_BACKEND_URL` configured.
3. **`docker-compose.yml`**: Links frontend and backend, attaches named volume `vps-data:/data` to persist orders, renewals, and payments across restarts.

See [Architecture.md](../Architecture.md).
