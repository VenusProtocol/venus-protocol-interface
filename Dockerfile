FROM node:12.19.0-alpine3.12 as builder

ENV NODE_ENV development
ENV NODE_PATH=src/

RUN apk add --update --no-cache python3

WORKDIR /usr/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN cat .env || true && \
    npm run build

FROM nginx:1.21.3-alpine

COPY nginx_default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/app/build /usr/share/nginx/html
