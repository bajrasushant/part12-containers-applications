FROM node:20 as base
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm ci


FROM base AS test
USER node
RUN npm run test


FROM node:20
WORKDIR /usr/src/app
COPY --chown=node:node . .
COPY --from=base /usr/src/app .
USER node
CMD ["npm", "run", "start:backend-only"] 
