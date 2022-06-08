FROM node:lts-alpine

WORKDIR /app

RUN npm install

RUN npm run build

CMD ["npm", "run", "start:prod"]
