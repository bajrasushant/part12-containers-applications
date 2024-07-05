FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

# development mode bhayeko le npm install ra run dev
# --host rakhna parne kina bhane to expose the dev server outside
# the docker environment
CMD ["npm", "run", "dev", "--", "--host"]
