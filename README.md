# Test Healthcare Application

Example web application with built-in security flaws to demonstrate the capabilities of
[HoundDog.ai code scanner](https://hounddog.ai). This toy application is written in Node.js and
allows doctors to manage patient visits.

## Tech Stack

- Frontend Client: Typescript + Remix
- Backend Server: Javascript + Express
- Docker Compose

## Usage

**Prerequisite**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop).

Clone this repository and `cd` into it:

```sh
git clone https://github.com/hounddogai/hounddog-test-government-app && cd hounddog-test-healthcare-app
```

Start the application stack using Docker Compose and open http://localhost:5173 in your browser:

```sh
docker compose up --build --wait
```

To tail the server logs:
```sh
docker compose logs -f server
```

To tail the client logs:
```sh
docker compose logs -f client
```
