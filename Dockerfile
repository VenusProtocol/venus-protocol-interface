FROM node:20.11.1-alpine as builder

ARG VERSION
ARG TAR_FILE_PREFIX

RUN apk add --update --no-cache python3 git openssh

WORKDIR /usr/app

COPY . .

RUN yarn

COPY . .

RUN cat .env || true && \
    NODE_OPTIONS="--max-old-space-size=16384" yarn build && mkdir -p ipfs && tar cfz ./ipfs/${TAR_FILE_PREFIX}-${VERSION}.tgz apps/evm/build

#----- Upload to S3 ------
FROM amazon/aws-cli AS s3_uploader

ARG S3_BUCKET_NAME
ARG S3_IPFS_BUCKET_NAME

RUN mkdir -p /build/{statics,ipfs}

COPY --from=builder /usr/app/apps/evm/build /build/statics
COPY --from=builder /usr/app/ipfs /build/ipfs

RUN aws s3 cp /build/statics s3://${S3_BUCKET_NAME}/ --recursive && \
    aws s3 cp /build/ipfs s3://${S3_IPFS_BUCKET_NAME}/ --recursive

#----- Build docker image ----

FROM nginx:1.21.3-alpine

COPY nginx_default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/app/apps/evm/build /usr/share/nginx/html
