FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache chromium

COPY ./ ./
RUN rm -rf node_modules package-lock.json
RUN npm i --force

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD ["npm", "run", "dev"]