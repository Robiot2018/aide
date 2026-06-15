# aide

cd api
npm init -y
npm install -D typescript
npx tsc --init
          
npm install fastify better-sqlite3 @fastify/cors @fastify/static
npm install -D @types/node @types/better-sqlite3
npx tsc
node dist/index.js

