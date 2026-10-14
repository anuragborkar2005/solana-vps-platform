# Solana VPS Platform

A proof of concept for paying for VPS access with SOL and signing in over SSH with a Solana wallet.

Users purchase or renew access, delegate access to other wallets, and sign SSH login challenges with Phantom or Solflare.

## Quick Start (Docker)

To run the entire platform with zero local configuration issues:

```bash
docker compose up --build
```

- **Frontend Portal:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8080](http://localhost:8080)
- **Storage:** Orders and payments persist across container restarts in the `solana-vps-data` SQLite volume (`/data/solana-vps.sqlite`).

## Running Locally

If you prefer to run services natively on your machine:

```bash
# 1. Install dependencies
npm run build:all

# 2. Run test suites across backend, ssh PAM/daemon, and frontend
npm test

# 3. Start backend service (Axum on port 8080)
npm run dev:backend

# 4. In a separate terminal, start frontend portal (Next.js on port 3000)
npm run dev:frontend
```

## Testing Features & UI Buttons

For quick review and testing without needing browser wallet extensions (Phantom/Solflare):

1. Click **"Connect Wallet"** in the top navigation or hero section.
2. Select **"⚡ Demo Validator Wallet"** (`2iXtA8...D2pQ` with 5.42 SOL) for instant 1-click test access.
3. Test all platform operations:
   - **Deploy VPS Instance:** Create a new order with custom hostname, datacenter region, and lease period.
   - **Pay Now:** Confirm on-chain payment and trigger instant provisioning.
   - **Renew Lease:** Generate extension invoices and execute on-chain renewal payments.
   - **SSH Gateway Challenge:** Fetch daemon challenge, sign using the Ed25519 demo keypair, and grant PAM session access.
   - **Delegates:** Add and revoke secondary Solana wallet access grants.
   - **Live Web SSH Console:** Test terminal interactions directly in the browser.

## Documentation and History

- [Architecture.md](Architecture.md): Complete architecture specification, components, and responsibilities.
- [docs/commit-history.md](docs/commit-history.md): Recent 3-day development commit history by Anurag Borkar (October 9 to October 11, 2026).
- [docs/diagrams/](docs/diagrams/): Architecture and sequence diagrams.
