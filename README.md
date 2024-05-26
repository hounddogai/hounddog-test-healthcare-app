# Test Healthcare Application

[![Azure](https://img.shields.io/azure-devops/build/hounddogai/5b9a0454-460f-492e-ba5c-81e45aff4656/3?label=azure)](https://dev.azure.com/hounddogai/hounddog-test-healthcare-app/_build/latest?definitionId=3&branchName=main)
[![Bitbucket](https://img.shields.io/bitbucket/pipelines/hounddogai-ws/hounddog-test-healthcare-app/main?label=bitbucket)](https://bitbucket.org/hounddogai-ws/hounddog-test-healthcare-app/pipelines)
[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/NXw6bAeqRWGf6eSe4tD2e4/Ce5YG19cNA9kohw2q676nZ/tree/main.svg?style=shield&circle-token=fd6d86559b76ba9839e70f00fe067573e112f701)](https://dl.circleci.com/status-badge/redirect/circleci/NXw6bAeqRWGf6eSe4tD2e4/Ce5YG19cNA9kohw2q676nZ/tree/main)
[![GitHub](https://img.shields.io/github/actions/workflow/status/hounddogai/hounddog-test-healthcare-app/hounddog.yml?label=github)](https://github.com/hounddogai/hounddog-test-healthcare-app/actions/workflows/hounddog.yml)
[![Gitlab](https://img.shields.io/gitlab/pipeline-status/hounddogai%2Fhounddog-test-healthcare-app?style=flat&label=gitlab)](https://gitlab.com/hounddogai/hounddog-test-healthcare-app/-/pipelines)
[![Jenkins](https://img.shields.io/jenkins/build?jobUrl=https%3A%2F%2Fjenkins.hounddog.ai%2Fjob%2Fhounddog-test-healthcare-app%2F&style=flat&label=jenkins)](https://jenkins.hounddog.ai/job/hounddog-test-healthcare-app/)


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
