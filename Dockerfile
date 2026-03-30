FROM node:20-alpine

WORKDIR /app

COPY . .
RUN npm install

RUN npx prisma generate || true
EXPOSE 3000
# CMD ["npm", "run", "start:dev"]