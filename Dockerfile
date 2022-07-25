FROM node:16.14.2-alpine3.14 as builder

ARG VERSION
ARG TAR_FILE_PREFIX

ENV NODE_ENV development
ENV NODE_PATH=src/

RUN apk add --update --no-cache python3 git openssh

WORKDIR /usr/app

RUN ln -s /usr/bin/python3 /usr/bin/python

COPY package.json ./
COPY yarn.lock ./
COPY src/constants/contracts/abis ./src/constants/contracts/abis
COPY patches ./patches

RUN yarn

COPY . .

RUN cat .env || true && \
    yarn build && mkdir -p ipfs && tar cfz ./ipfs/${TAR_FILE_PREFIX}-${VERSION}.tgz build

#----- Upload to S3 ------
FROM amazon/aws-cli AS s3_uploader

ARG S3_BUCKET_NAME
ARG S3_IPFS_BUCKET_NAME

RUN mkdir -p /build/{statics,ipfs}

COPY --from=builder /usr/app/build /build/statics
COPY --from=builder /usr/app/ipfs /build/ipfs

RUN aws s3 cp /build/statics s3://${S3_BUCKET_NAME}/ --recursive && \
    aws s3 cp /build/ipfs s3://${S3_IPFS_BUCKET_NAME}/ --recursive

#----- Build docker image ----

FROM nginx:1.21.3-alpine

COPY nginx_default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/app/build /usr/share/nginx/html
