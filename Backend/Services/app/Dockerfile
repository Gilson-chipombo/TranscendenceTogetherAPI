FROM node:20-alpine

WORKDIR /app

COPY ../../package*.json ./


RUN npm install

COPY ../../ .

RUN npx prisma generate || true
# RUN npx prisma migrate dev --name init --skip-seed || true
# RUN chmod +x ./script.sh
EXPOSE 3000
# CMD ["npm", "run", "start:dev"]