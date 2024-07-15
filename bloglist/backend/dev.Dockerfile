FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

USER node

CMD ["npm", "run", "dev"]
