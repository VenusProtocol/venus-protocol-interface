FROM node:12.19.0-alpine3.12

# must use development so that "npm run build" works
ENV NODE_ENV development
ENV NODE_PATH=src/

WORKDIR /usr/app

COPY . .

RUN npm install && npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]