FROM node:12.19.0-alpine3.12

# must use development so that "npm run build" works
ENV NODE_ENV development
ENV NODE_PATH=src/

RUN apk add --update --no-cache python3 git openssh

WORKDIR /usr/app

EXPOSE 3001