# Run `npm run build` before buildung an image
FROM node:14.15.0-alpine
RUN apk add --no-cache --virtual .gyp python make g++
RUN apk add --no-cache git
WORKDIR /app
COPY package.json ./
COPY ./build ./

RUN yarn global add pm2
RUN yarn

RUN apk del .gyp
RUN apk del git
RUN ls -al
EXPOSE 3001
CMD ["pm2-runtime","./main.js"]
