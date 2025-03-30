# Estágio de desenvolvimento
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=development /app/package*.json ./
COPY --from=development /app/.next ./.next
COPY --from=development /app/public ./public
COPY --from=development /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
