# Minimal Node service for the contact-form mailer. Installs only production
# deps, then runs server.js on PORT (default 3000).
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY server.js ./

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
