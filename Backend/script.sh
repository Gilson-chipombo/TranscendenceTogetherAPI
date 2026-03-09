#! /bin/bash
npx prisma generate || true
npx prisma migrate dev
echo "Success migrating database"
npm run start:dev
exec "$@"
