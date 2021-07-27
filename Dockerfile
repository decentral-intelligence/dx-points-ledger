# Run `npm run build` before buildung a container
FROM node:14
WORKDIR /app
COPY package*.json ./
COPY ./build .

RUN npm i pm2 -g
RUN npm ci --only=production

RUN ls -al
EXPOSE 3000
CMD ["pm2-runtime","main.js"]
