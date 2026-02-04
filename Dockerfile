FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache chromium openjdk17

COPY ./dashboard-app ./
COPY ./casanet-server/backend/src/generated/swagger.json ./local-spec/swagger.json
COPY ./casanet-server/backend/src/models/remote2localProtocol.ts ./local-spec/remote2localProtocol.ts
COPY ./casanet-server/backend/src/models/sharedInterfaces.d.ts ./local-spec/sharedInterfaces.d.ts

RUN rm -rf node_modules package-lock.json
RUN npm i --force

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV API_SERVER_SPEC_PATH=/app/local-spec/swagger.json
ENV API_SERVER_SPEC_MODELS_DIR=/app/local-spec

CMD ["npm", "run", "dev"]
