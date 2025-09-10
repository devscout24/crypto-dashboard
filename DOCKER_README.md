# Docker Deployment Guide

This guide explains how to deploy the Crypto Dashboard application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional but recommended)

## Building the Docker Image

The project includes a multi-stage Dockerfile that:

1. Builds the application using Bun
2. Serves the built files using a lightweight static file server

To build the image:

```bash
docker build -t crypto-dashboard .
```

## Environment Variables

The application uses several environment variables defined in the `.env` file. These are:

- `VITE_API_KEY` - Airtable API key
- `VITE_BASE_ID` - Airtable base ID
- `VITE_ENDPOINT_URL` - Airtable endpoint URL
- `VITE_APPWRITE_PROJECT_ID` - Appwrite project ID
- `VITE_APPWRITE_ENDPOINT` - Appwrite endpoint
- Firebase configuration variables

For production deployments, you should:

1. Review and update these values in the `.env` file
2. Ensure the `.env` file is included in the build context (not in `.dockerignore`)
3. Consider using Docker secrets or external secret management for sensitive values

## Running the Container

To run the container:

```bash
docker run -d -p 3000:3000 --name crypto-dashboard crypto-dashboard
```

Note: The application will be available on port 3000 instead of port 80.

## Deploying with Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: "3.8"
services:
  crypto-dashboard:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

## Deploying to Hostinger VPS

1. Copy the project files to your Hostinger VPS
2. Install Docker on your VPS if not already installed
3. Build and run the container as described above

## Deploying with Dockploy

Dockploy is a deployment tool that works with Docker. To deploy with Dockploy:

1. Configure Dockploy to point to your project repository
2. Set up the environment variables in Dockploy
3. Trigger a deployment through Dockploy's interface

## Security Considerations

- The current setup includes the `.env` file in the build for VITE variables
- For sensitive values, consider using Docker secrets or external secret management
- Regularly update the base images (Bun) for security patches
