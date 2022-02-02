# Venus Protocol
## Quick Installation & Start

```sh
npm install
npm run start
```

## Requirements and Configuration

You’ll need to have Node v14.19.0 on your local development machine

And add .env file from template `cp .env.template .env`

## Creating an App

To create a new app, you may choose one of the following methods:

```
venus-protocol-ui
├── node_modules
├── public
├── src
├──── assets
├──── components
├──── containers
├──── core
├──── utilities
├──── index.js
├──── serviceWorker.js
├── .env
├── .gitignore
├── package.json
├── README.md
```

## Deployment

To deploy, raise a PR to update image and config at: https://github.com/VenusProtocol/venus-k8s-app

## Local Development

To run dev environment:

```
docker compose up venus-ui-dev
```

To run prod environment:

```
docker compose build && docker compose up venus-ui-prod
```
