# Restaurant CRM DevOps

Deployment follows the existing backend pattern:

1. Push to `main`.
2. GitHub Actions builds the Vite app.
3. GitHub Actions builds a Docker image and saves it as `restaurant-crm.tar`.
4. The tar is uploaded to Hetzner with `rsync`.
5. The remote server loads the image and restarts the `restaurant-crm` container.

The container listens on port `3000`. The existing host Nginx should terminate TLS
and proxy the CRM domain to `http://127.0.0.1:3000`.

GitHub secrets:

```env
HETZNER_SSH_KEY=
HETZNER_HOST=
HETZNER_PORT=22
HETZNER_DEPLOY_PATH=
HETZNER_DOCKER_NETWORK=
VITE_API_URL=https://accanto.adammudrak.pp.ua
```

`VITE_API_URL` is baked into the Vite build. Keep it pointed at the backend API.
