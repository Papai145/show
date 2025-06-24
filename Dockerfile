FROM node:20-alpine
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production
CMD ["node","./dist/main.js"] 
