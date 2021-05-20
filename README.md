# Venus Protocol
## Quick Installation & Start

```sh
npm install
npm run start
```

## Requirements and Configuration

You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine

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

## Quick Deployment

```sh
npm install
npm run build
```

testnet server deploy
```
pm2 deploy testnet
```

production server deploy
```
pm2 deploy prod
```