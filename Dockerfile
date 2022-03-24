FROM node:12.19.0-alpine3.12 as builder

ENV NODE_ENV development
ENV NODE_PATH=src/

RUN apk add --update --no-cache python3 git openssh

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN ln -s /usr/bin/python3 /usr/bin/python

RUN npm install

COPY . .

RUN cat .env || true && \
    npm run build

#----- Upload to S3 ------
FROM amazon/aws-cli AS s3_uploader

ARG S3_BUCKET_NAME

RUN mkdir -p /build/statics

COPY --from=builder /usr/app/build /build/statics

RUN aws s3 cp /build/statics s3://${S3_BUCKET_NAME}/ --recursive

#----- Build docker image ----

FROM nginx:1.21.3-alpine

COPY nginx_default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/app/build /usr/share/nginx/html
