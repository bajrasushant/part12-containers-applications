FROM node:20 as base
WORKDIR /usr/src/app
ENV VITE_API_URL="http://localhost:8080/"
COPY --chown=node:node . .

FROM base as build-stage
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
