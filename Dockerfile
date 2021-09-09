FROM node:14.15.0-alpine
RUN apk add --no-cache --virtual .gyp python make g++
RUN apk add --no-cache git
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY ./src ./src
RUN yarn
RUN yarn global add pm2
RUN yarn build

RUN cp -r ./build/** ./

RUN rm -rf ./src
RUN rm -rf ./build

RUN apk del .gyp
RUN apk del git
RUN ls -al
EXPOSE 3001 4001 4011 4012

CMD ["pm2-runtime","./main.js"]
