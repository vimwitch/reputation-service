FROM alpine:latest

RUN apk add nodejs npm && npm i -g yarn

COPY . /src
WORKDIR /src

RUN yarn && yarn build

CMD ["yarn", "start"]
