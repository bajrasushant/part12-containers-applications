FROM node:20 AS base 
WORKDIR /usr/src/app
ENV VITE_BACKEND_URL="http://localhost:8080/api"
COPY --chown=node:node . .

FROM base AS build-stage
USER root
RUN chown -R node:node /usr/src/app
USER node
RUN npm ci
RUN npm run build

FROM build-stage as test
USER node
RUN npm ci
RUN npm run test

FROM nginx:1.27-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
